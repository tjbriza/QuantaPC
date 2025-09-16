import { useState, useMemo, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useSupabaseRead } from '../../../hooks/useSupabaseRead';
import { useSupabaseWrite } from '../../../hooks/useSupabaseWrite';
import { useToast } from '../../../context/ToastContext';
import { usePaginatedOrders } from '../../../hooks/usePaginatedOrders';
import { useAuth } from '../../../context/AuthContext';
import OrderFilters from '../ui/orders/OrderFilters';
import OrderTable from '../ui/orders/OrderTable';
import OrderDetailsDialog from '../ui/orders/OrderDetailsDialog';
import FullOrderDetailsDialog from '../ui/orders/FullOrderDetailsDialog';

export default function AdminOrders() {
  const [ordersReloadKey, setOrdersReloadKey] = useState(Date.now());
  const [messagesReloadKey, setMessagesReloadKey] = useState(Date.now());
  const { toast } = useToast();
  const { session } = useAuth();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({
    items: [],
    quickFilterValues: [],
  });

  const [statuses, setStatuses] = useState([]); // multi-select
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [search, setSearch] = useState('');
  const [appliedAdvancedFilters, setAppliedAdvancedFilters] = useState({
    statuses: [],
    dateFrom: '',
    dateTo: '',
    paymentMethod: '',
    search: '',
  });
  const isDirty = useMemo(
    () =>
      JSON.stringify(appliedAdvancedFilters) !==
      JSON.stringify({ statuses, dateFrom, dateTo, paymentMethod, search }),
    [appliedAdvancedFilters, statuses, dateFrom, dateTo, paymentMethod, search],
  );
  const applyAdvancedFilters = () => {
    setAppliedAdvancedFilters({
      statuses: [...statuses],
      dateFrom,
      dateTo,
      paymentMethod,
      search,
    });
    setPage(0);
  };

  const {
    rows: orders,
    rowCount,
    loading: ordersLoading,
  } = usePaginatedOrders(
    page,
    pageSize,
    sortModel,
    filterModel,
    ordersReloadKey,
    appliedAdvancedFilters,
  );
  const ordersError = null;

  const {
    insertData: insertOrder,
    updateData: updateOrder,
    deleteData: deleteOrder,
    loading: orderWriteLoading,
  } = useSupabaseWrite('orders');

  const { insertData: insertOrderEditLog, loading: orderEditWriteLoading } =
    useSupabaseWrite('order_edit_logs');
  const { insertData: insertHistory, loading: historyWriteLoading } =
    useSupabaseWrite('order_status_history');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusSelection, setStatusSelection] = useState('');
  const [fullDetailsOrder, setFullDetailsOrder] = useState(null); // { order, items }
  const [fullDetailsOrderId, setFullDetailsOrderId] = useState(null); // id being fetched
  const [statusMessage, setStatusMessage] = useState('');

  const {
    data: items,
    loading: itemsLoading,
    error: itemsError,
  } = useSupabaseRead('order_items', {
    select: '*, product:products(id, name, image_url)',
    filter: { order_id: selectedOrder ? selectedOrder.id : null },
    enabled: !!selectedOrder,
  });

  // fetch all status messages
  const { data: allMessages, loading: messagesLoading } = useSupabaseRead(
    'order_status_history',
    {
      select: 'order_id, message, created_at',
      enabled: true,
      key: messagesReloadKey, // forces refresh when messages are updated
    },
  );

  // get the latest message for each order by finding the most recent created_at
  const latestMessages = useMemo(() => {
    if (!allMessages) return [];

    // group messages by order_id and find the latest for each
    const messageMap = new Map();
    allMessages.forEach((msg) => {
      const existing = messageMap.get(msg.order_id);
      if (
        !existing ||
        new Date(msg.created_at) > new Date(existing.created_at)
      ) {
        messageMap.set(msg.order_id, msg);
      }
    });
    return Array.from(messageMap.values());
  }, [allMessages]);

  const {
    data: orderHistory,
    loading: historyLoading,
    error: historyError,
  } = useSupabaseRead('order_status_history', {
    select: '*',
    filter: { order_id: selectedOrder ? selectedOrder.id : null },
    options: { order: 'created_at.desc' },
    enabled: !!selectedOrder,
  });

  const rows = useMemo(
    () =>
      (orders || []).map((o) => {
        const latestMessage = latestMessages?.find((m) => m.order_id === o.id);
        return {
          id: o.id,
          order_number: o.order_number,
          customer_email: o.customer_email,
          total_amount: o.total_amount,
          status: o.status,
          created_at: o.created_at,
          latest_message: latestMessage?.message || '',
        };
      }),
    [orders, latestMessages],
  );

  const columns = [
    { field: 'order_number', headerName: 'Order #', width: 220 },
    { field: 'customer_email', headerName: 'Email', width: 220 },
    { field: 'total_amount', headerName: 'Total', width: 120 },
    { field: 'status', headerName: 'Status', width: 140 },
    {
      field: 'latest_message',
      headerName: 'Latest Update',
      width: 220,
      renderCell: (params) => (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography
            variant='body2'
            sx={{
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              px: 1,
            }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    { field: 'created_at', headerName: 'Created At', width: 270 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 260,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const order = orders.find((o) => o.id === params.row.id);
        return (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Button
              variant='contained'
              size='small'
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOrder(order);
                setStatusSelection(order?.status || 'pending');
              }}
              sx={{ minWidth: 'unset', whiteSpace: 'nowrap', borderRadius: 3 }}
            >
              Change Status
            </Button>
            <Button
              variant='outlined'
              size='small'
              onClick={(e) => {
                e.stopPropagation();
                if (!order) return;
                setFullDetailsOrderId(order.id); // trigger hook fetch
              }}
              sx={{ minWidth: 'unset', whiteSpace: 'nowrap', borderRadius: 3 }}
            >
              Full Details
            </Button>
          </Box>
        );
      },
    },
  ];

  const closeDialog = () => {
    setSelectedOrder(null);
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    if (!statusMessage.trim()) {
      toast.error('Please provide a message for the status change');
      return;
    }

    const prevLatestMsg =
      (latestMessages || []).find((m) => m.order_id === selectedOrder.id)
        ?.message || '';
    const previous = {
      status: selectedOrder.status,
      status_message: prevLatestMsg,
    };
    const next = {
      status: statusSelection,
      status_message: statusMessage.trim(),
    };

    const { error: orderError } = await updateOrder(
      { id: selectedOrder.id },
      { status: statusSelection },
    );

    if (orderError) {
      console.error('Failed to update order status', orderError);
      toast.error('Failed to update order status');
      return;
    }

    // insert into order_edit_logs
    const changed_fields = [];
    if (previous.status !== next.status) changed_fields.push('status');
    if (previous.status_message !== next.status_message)
      changed_fields.push('status_message');
    const { error: orderEditError } = await insertOrderEditLog({
      order_id: selectedOrder.id,
      actor_user_id: session?.user?.id,
      changed_fields,
      previous_values: previous,
      new_values: next,
      // optional: include message in summary-like field? For now, embed into new_values
    });

    if (orderEditError) {
      console.error('Failed to save order edit log', orderEditError);
      toast.error('Failed to save order edit log');
      return;
    }

    // also insert into order_status_history for UI history/messages
    const { error: historyError } = await insertHistory({
      order_id: selectedOrder.id,
      status: statusSelection,
      message: statusMessage.trim(),
      created_by: session?.user?.id,
    });

    if (historyError) {
      console.error('Failed to save status history', historyError);
      toast.error('Failed to save status history');
      return;
    }

    // update the reload keys to refresh data
    const newTime = Date.now();
    setOrdersReloadKey(newTime);
    setMessagesReloadKey(newTime);

    // force a rerender of the grid and close dialog
    setTimeout(() => {
      // show success message
      toast.success('Order status updated');

      // clear form and close dialog
      setStatusMessage('');
      setSelectedOrder(null);

      // update keys again to ensure refresh
      const refreshTime = Date.now();
      setOrdersReloadKey(refreshTime);
      setMessagesReloadKey(refreshTime);
    }, 100);
  };

  const resetAdvancedFilters = () => {
    setStatuses([]);
    setDateFrom('');
    setDateTo('');
    setPaymentMethod('');
    setSearch('');
    setAppliedAdvancedFilters({
      statuses: [],
      dateFrom: '',
      dateTo: '',
      paymentMethod: '',
      search: '',
    });
    setPage(0);
  };

  // simple status options
  const STATUS_OPTIONS = [
    'pending',
    'paid',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ];
  // dynamically load distinct payment methods from existing orders
  const { data: paymentMethodRows, loading: paymentMethodsLoading } =
    useSupabaseRead('orders', {
      select: 'payment_method',
      limit: 500,
      enabled: true,
    });

  const PAYMENT_METHOD_OPTIONS = useMemo(() => {
    if (!paymentMethodRows || paymentMethodRows.length === 0) {
      return ['']; // fallback defaults
    }
    const set = new Set();
    paymentMethodRows.forEach((r) => {
      if (r && r.payment_method) {
        set.add(String(r.payment_method).toLowerCase());
      }
    });
    if (set.size === 0) return ['cod', 'gcash', 'card', 'paypal'];
    return Array.from(set).sort();
  }, [paymentMethodRows]);
  // full order & items fetch via hooks (enabled when id set)
  const {
    data: fullOrderData,
    loading: fullOrderLoading,
    error: fullOrderError,
  } = useSupabaseRead('orders', {
    select: '*',
    filter: { id: fullDetailsOrderId },
    single: true,
    enabled: !!fullDetailsOrderId,
  });
  const {
    data: fullOrderItems,
    loading: fullItemsLoading,
    error: fullItemsError,
  } = useSupabaseRead('order_items', {
    select: '*, product:products(id, name, image_url)',
    filter: { order_id: fullDetailsOrderId },
    enabled: !!fullDetailsOrderId,
  });

  // consolidate in effect (avoid setState during render)
  useEffect(() => {
    if (!fullDetailsOrderId) return;
    if (fullOrderError || fullItemsError) {
      console.error(
        'Failed loading full order',
        fullOrderError || fullItemsError,
      );
      toast.error('Failed to load full details');
      setFullDetailsOrderId(null);
      return;
    }
    if (!fullOrderLoading && !fullItemsLoading) {
      setFullDetailsOrder({
        order: fullOrderData,
        items: fullOrderItems || [],
      });
    }
  }, [
    fullDetailsOrderId,
    fullOrderLoading,
    fullItemsLoading,
    fullOrderData,
    fullOrderItems,
    fullOrderError,
    fullItemsError,
    toast,
  ]);

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: 'calc(100vh - 64px)',
        boxSizing: 'border-box',
      }}
    >
      <OrderFilters
        title='Orders'
        statuses={statuses}
        setStatuses={setStatuses}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        search={search}
        setSearch={setSearch}
        STATUS_OPTIONS={STATUS_OPTIONS}
        PAYMENT_METHOD_OPTIONS={PAYMENT_METHOD_OPTIONS}
        paymentMethodsLoading={paymentMethodsLoading}
        applyAdvancedFilters={applyAdvancedFilters}
        resetAdvancedFilters={resetAdvancedFilters}
        isDirty={isDirty}
        appliedAdvancedFilters={appliedAdvancedFilters}
      />
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <OrderTable
          rows={rows}
          columns={columns}
          rowCount={rowCount}
          loading={
            ordersLoading ||
            orderWriteLoading ||
            orderEditWriteLoading ||
            historyWriteLoading ||
            messagesLoading
          }
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          sortModel={sortModel}
          setSortModel={setSortModel}
          filterModel={filterModel}
          setFilterModel={setFilterModel}
        />
      </Box>
      <OrderDetailsDialog
        open={!!selectedOrder}
        onClose={closeDialog}
        selectedOrder={selectedOrder}
        statusSelection={statusSelection}
        setStatusSelection={setStatusSelection}
        statusMessage={statusMessage}
        setStatusMessage={setStatusMessage}
        handleSaveStatus={handleSaveStatus}
        orderWriteLoading={orderWriteLoading}
        historyWriteLoading={orderEditWriteLoading || historyWriteLoading}
        historyLoading={historyLoading}
        historyError={historyError}
        orderHistory={orderHistory}
        itemsLoading={itemsLoading}
        itemsError={itemsError}
        items={items}
      />
      <FullOrderDetailsDialog
        open={!!fullDetailsOrderId}
        onClose={() => {
          setFullDetailsOrder(null);
          setFullDetailsOrderId(null);
        }}
        order={fullDetailsOrder?.order}
        items={fullDetailsOrder?.items}
        loading={fullOrderLoading || fullItemsLoading}
      />
    </Box>
  );
}
