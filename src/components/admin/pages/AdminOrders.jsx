import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSupabaseRead } from '../../../hooks/useSupabaseRead';
import { useSupabaseWrite } from '../../../hooks/useSupabaseWrite';
import { useToast } from '../../../context/ToastContext';
import { usePaginatedOrders } from '../../../hooks/usePaginatedOrders';

export default function AdminOrders() {
  const [ordersReloadKey, setOrdersReloadKey] = useState(Date.now());
  const { toast } = useToast();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({
    items: [],
    quickFilterValues: [],
  });

  const {
    rows: orders,
    rowCount,
    loading: ordersLoading,
  } = usePaginatedOrders(page, pageSize, sortModel, filterModel);
  const ordersError = null;

  const {
    insertData,
    updateData,
    deleteData,
    loading: writeLoading,
  } = useSupabaseWrite('orders');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusSelection, setStatusSelection] = useState('');

  const {
    data: items,
    loading: itemsLoading,
    error: itemsError,
  } = useSupabaseRead('order_items', {
    select: '*, product:products(id, name, image_url)',
    filter: { order_id: selectedOrder ? selectedOrder.id : null },
    enabled: !!selectedOrder,
  });

  const rows = useMemo(
    () =>
      (orders || []).map((o) => ({
        id: o.id,
        order_number: o.order_number,
        customer_email: o.customer_email,
        total_amount: o.total_amount,
        status: o.status,
        created_at: o.created_at,
      })),
    [orders],
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 260 },
    { field: 'order_number', headerName: 'Order #', width: 160 },
    { field: 'customer_email', headerName: 'Email', width: 220 },
    { field: 'total_amount', headerName: 'Total', width: 120 },
    { field: 'status', headerName: 'Status', width: 140 },
    { field: 'created_at', headerName: 'Created At', width: 200 },
  ];

  const handleRowClick = (params) => {
    const order = orders.find((o) => o.id === params.id);
    setSelectedOrder(order);
    setStatusSelection(order?.status || 'pending');
  };

  const closeDialog = () => {
    setSelectedOrder(null);
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    const { data, error } = await updateData(
      { id: selectedOrder.id },
      { status: statusSelection },
    );
    if (error) {
      console.error('Failed to update order status', error);
      toast.error('Failed to update order status');
      return;
    }
    toast.success('Order status updated');
    setOrdersReloadKey(Date.now());
    // refresh selected order details
    const updated = { ...selectedOrder, status: statusSelection };
    setSelectedOrder(updated);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h5' fontWeight={600} sx={{ mb: 2 }}>
        Orders
      </Typography>

      {ordersError ? (
        <Typography color='error'>Error loading orders</Typography>
      ) : (
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowCount={rowCount}
            loading={ordersLoading || writeLoading}
            getRowId={(r) => r.id}
            onRowClick={handleRowClick}
            paginationMode='server'
            sortingMode='server'
            filterMode='server'
            paginationModel={{ page, pageSize }}
            sortModel={sortModel}
            filterModel={filterModel}
            onPaginationModelChange={(model) => {
              setPage(model.page);
              setPageSize(model.pageSize);
            }}
            onSortModelChange={(model) => {
              setSortModel(model);
              setPage(0);
            }}
            onFilterModelChange={(model) => {
              setFilterModel(model);
              setPage(0);
            }}
            pageSizeOptions={[10, 25, 50]}
          />
        </div>
      )}

      <Dialog
        open={!!selectedOrder}
        onClose={closeDialog}
        fullWidth
        maxWidth='md'
      >
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Box>
              <Typography variant='subtitle1' sx={{ mb: 1 }}>
                Order #: {selectedOrder.order_number || selectedOrder.id}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Customer email: {selectedOrder.customer_email}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Total: ₱{selectedOrder.total_amount}
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id='status-label'>Status</InputLabel>
                <Select
                  labelId='status-label'
                  value={statusSelection}
                  label='Status'
                  onChange={(e) => setStatusSelection(e.target.value)}
                >
                  <MenuItem value='pending'>pending</MenuItem>
                  <MenuItem value='paid'>paid</MenuItem>
                  <MenuItem value='shipped'>shipped</MenuItem>
                  <MenuItem value='delivered'>delivered</MenuItem>
                  <MenuItem value='cancelled'>cancelled</MenuItem>
                  <MenuItem value='failed'>failed</MenuItem>
                  <MenuItem value='expired'>expired</MenuItem>
                </Select>
              </FormControl>

              <Typography variant='h6' sx={{ mt: 2 }}>
                Items
              </Typography>
              {itemsLoading ? (
                <CircularProgress size={20} />
              ) : itemsError ? (
                <Typography color='error'>Error loading items</Typography>
              ) : (
                <List>
                  {(items || []).map((it) => (
                    <ListItem key={it.id} divider>
                      <ListItemAvatar>
                        <Avatar src={it.product?.image_url} variant='square' />
                      </ListItemAvatar>
                      <ListItemText
                        primary={it.product?.name}
                        secondary={`Quantity: ${it.quantity} • Price: ₱${it.price_snapshot}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Close</Button>
          <Button
            variant='contained'
            onClick={handleSaveStatus}
            disabled={writeLoading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
