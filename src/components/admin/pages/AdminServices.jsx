import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useSupabaseRead } from '../../../hooks/useSupabaseRead';
import { useSupabaseWrite } from '../../../hooks/useSupabaseWrite';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';
import ServicesFilters from '../ui/services/ServicesFilters';
import ServicesTable from '../ui/services/ServicesTable';
import { usePaginatedServices } from '../../../hooks/usePaginatedServices';
import ServiceDetailsDialog from '../ui/services/ServiceDetailsDialog';

export default function AdminServices() {
  const { toast } = useToast();
  const { session } = useAuth();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [reloadKey, setReloadKey] = useState(Date.now());

  // Advanced filters
  const [statuses, setStatuses] = useState([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  const [search, setSearch] = useState('');
  const [appliedAdvancedFilters, setAppliedAdvancedFilters] = useState({
    statuses: [],
    dateFrom: '',
    dateTo: '',
    paymentMethod: '',
    search: '',
    serviceId: '',
    technicianId: '',
  });

  const isDirty = useMemo(
    () =>
      JSON.stringify(appliedAdvancedFilters) !==
      JSON.stringify({
        statuses,
        dateFrom,
        dateTo,
        paymentMethod,
        search,
        serviceId,
        technicianId,
      }),
    [
      appliedAdvancedFilters,
      statuses,
      dateFrom,
      dateTo,
      paymentMethod,
      search,
      serviceId,
      technicianId,
    ],
  );
  const applyAdvancedFilters = () => {
    setAppliedAdvancedFilters({
      statuses: [...statuses],
      dateFrom,
      dateTo,
      paymentMethod,
      search,
      serviceId,
      technicianId,
    });
    setPage(0);
  };
  const resetAdvancedFilters = () => {
    setStatuses([]);
    setDateFrom('');
    setDateTo('');
    setPaymentMethod('');
    setServiceId('');
    setTechnicianId('');
    setSearch('');
    setAppliedAdvancedFilters({
      statuses: [],
      dateFrom: '',
      dateTo: '',
      paymentMethod: '',
      search: '',
      serviceId: '',
      technicianId: '',
    });
    setPage(0);
  };

  const { rows, rowCount, loading } = usePaginatedServices(
    page,
    pageSize,
    sortModel,
    filterModel,
    reloadKey,
    appliedAdvancedFilters,
  );

  // Distinct lists for filters
  const { data: services, loading: servicesLoading } = useSupabaseRead(
    'services',
    { select: 'id, name', enabled: true },
  );
  const SERVICE_OPTIONS = useMemo(
    () => (services || []).map((s) => ({ value: s.id, label: s.name })),
    [services],
  );

  const { data: technicians, loading: techniciansLoading } = useSupabaseRead(
    'technicians',
    { select: 'id, name', enabled: true },
  );
  const TECHNICIAN_OPTIONS = useMemo(
    () => (technicians || []).map((t) => ({ value: t.id, label: t.name })),
    [technicians],
  );

  const { data: paymentMethodRows, loading: paymentMethodsLoading } =
    useSupabaseRead('service_requests', {
      select: 'payment_method',
      limit: 500,
      enabled: true,
    });
  const PAYMENT_METHOD_OPTIONS = useMemo(() => {
    if (!paymentMethodRows || paymentMethodRows.length === 0) return [''];
    const set = new Set();
    paymentMethodRows.forEach(
      (r) =>
        r?.payment_method && set.add(String(r.payment_method).toLowerCase()),
    );
    if (set.size === 0) return ['gcash', 'card', 'bank'];
    return Array.from(set).sort();
  }, [paymentMethodRows]);

  // Actions: update status, assign technician, create invoice
  const { updateData: updateServiceRequest, loading: updateLoading } =
    useSupabaseWrite('service_requests');
  const { insertData: insertServiceHistory, loading: historyInsertLoading } =
    useSupabaseWrite('service_status_history');
  const { insertData: insertServiceEditLog } = useSupabaseWrite(
    'service_request_edit_logs',
  );

  // Create invoice dialog
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [activeSR, setActiveSR] = useState(null);
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceEmail, setInvoiceEmail] = useState('');
  const [invoiceLink, setInvoiceLink] = useState('');

  // Service status dialog
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [statusSelection, setStatusSelection] = useState('pending');
  const [statusNote, setStatusNote] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const {
    data: serviceHistory,
    loading: serviceHistoryLoading,
    error: serviceHistoryError,
  } = useSupabaseRead('service_status_history', {
    select: '*',
    filter: { service_request_id: selectedService ? selectedService.id : null },
    options: { order: 'created_at.desc' },
    enabled: !!selectedService,
  });

  const openInvoiceDialog = (row) => {
    setActiveSR(row);
    setInvoiceAmount(String(row.quote_amount || ''));
    setInvoiceEmail(row.contact_email || '');
    setInvoiceLink(row.xendit_invoice_url || '');
    setInvoiceDialogOpen(true);
  };
  const closeInvoiceDialog = () => {
    setInvoiceDialogOpen(false);
    setActiveSR(null);
    setInvoiceLink('');
  };
  const createInvoice = async () => {
    const amt = Number(invoiceAmount);
    if (!activeSR || !amt || amt <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    try {
      const resp = await fetch('/api/createServiceInvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(import.meta.env?.VITE_ADMIN_API_TOKEN
            ? { 'x-admin-token': import.meta.env.VITE_ADMIN_API_TOKEN }
            : {}),
        },
        body: JSON.stringify({
          serviceRequestId: activeSR.id,
          amount: amt,
          payerEmail: invoiceEmail,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Failed to create invoice');
      toast.success('Invoice created. Copy the link below.');
      setReloadKey(Date.now());
      if (data.invoiceUrl) setInvoiceLink(data.invoiceUrl);
    } catch (e) {
      console.error(e);
      toast.error('Invoice creation failed');
    }
  };

  const rowsMapped = useMemo(
    () =>
      (rows || []).map((r) => ({
        id: r.id,
        service_number: r.service_number,
        service_name: r.service?.name || '-',
        contact_name: r.contact_name || '-',
        contact_email: r.contact_email || '-',
        status: r.status,
        quote_amount: r.quote_amount || 0,
        payment_method: r.payment_method || '-',
        xendit_invoice_url: r.xendit_invoice_url || '',
        technician: r.technician?.name || '-',
        scheduled_at: r.scheduled_at || null,
        created_at: r.created_at,
        quote_notes: r.quote_notes || '',
      })),
    [rows],
  );

  const columns = [
    { field: 'service_number', headerName: 'SR #', width: 160 },
    { field: 'service_name', headerName: 'Service', width: 180 },
    { field: 'contact_name', headerName: 'Name', width: 160 },
    { field: 'contact_email', headerName: 'Email', width: 220 },
    { field: 'status', headerName: 'Status', width: 140 },
    { field: 'quote_notes', headerName: 'Notes', width: 240 },
    { field: 'quote_amount', headerName: 'Quote (₱)', width: 120 },
    { field: 'payment_method', headerName: 'Payment', width: 130 },
    { field: 'technician', headerName: 'Technician', width: 160 },
    { field: 'scheduled_at', headerName: 'Scheduled', width: 200 },
    { field: 'created_at', headerName: 'Created At', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 340,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = rows.find((r) => r.id === params.row.id) || {};
        return (
          <Stack direction='row' spacing={1} alignItems='center'>
            <Button
              size='small'
              variant='contained'
              onClick={(e) => {
                e.stopPropagation();
                const sr = rowsMapped.find((r) => r.id === params.row.id);
                setSelectedService(sr);
                setStatusSelection(sr?.status || 'pending');
                setStatusNote('');
                setServiceDialogOpen(true);
              }}
              sx={{ borderRadius: 3 }}
            >
              View Status
            </Button>
            <Button
              size='small'
              variant='outlined'
              onClick={(e) => {
                e.stopPropagation();
                openInvoiceDialog(params.row);
              }}
              sx={{ borderRadius: 3, whiteSpace: 'nowrap' }}
            >
              {params.row.xendit_invoice_url
                ? 'View Invoice'
                : 'Create Invoice'}
            </Button>
          </Stack>
        );
      },
    },
  ];

  const STATUS_OPTIONS = [
    'pending',
    'quoted',
    'paid',
    'scheduled',
    'in_progress',
    'completed',
    'failed',
    'expired',
    'cancelled',
  ];

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
      <ServicesFilters
        title='Service Requests'
        statuses={statuses}
        setStatuses={setStatuses}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        serviceId={serviceId}
        setServiceId={setServiceId}
        technicianId={technicianId}
        setTechnicianId={setTechnicianId}
        search={search}
        setSearch={setSearch}
        STATUS_OPTIONS={STATUS_OPTIONS}
        PAYMENT_METHOD_OPTIONS={
          paymentMethodsLoading ? ['loading...'] : PAYMENT_METHOD_OPTIONS || []
        }
        SERVICE_OPTIONS={SERVICE_OPTIONS}
        TECHNICIAN_OPTIONS={TECHNICIAN_OPTIONS}
        applyAdvancedFilters={applyAdvancedFilters}
        resetAdvancedFilters={resetAdvancedFilters}
        isDirty={isDirty}
        appliedAdvancedFilters={appliedAdvancedFilters}
      />
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <ServicesTable
          rows={rowsMapped}
          columns={columns}
          rowCount={rowCount}
          loading={
            loading || servicesLoading || techniciansLoading || updateLoading
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

      <Dialog
        open={invoiceDialogOpen}
        onClose={closeInvoiceDialog}
        fullWidth
        maxWidth='xs'
      >
        <DialogTitle>
          {invoiceLink ? 'View Invoice' : 'Create Payment Link'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label='Amount (PHP)'
              type='number'
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(e.target.value)}
              disabled={!!invoiceLink}
            />
            <TextField
              label='Payer Email'
              type='email'
              value={invoiceEmail}
              onChange={(e) => setInvoiceEmail(e.target.value)}
              disabled={!!invoiceLink}
            />
            {invoiceLink ? (
              <Stack direction='row' spacing={1} alignItems='center'>
                <TextField
                  label='Invoice URL'
                  value={invoiceLink}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  disabled
                />
                <Button
                  variant='outlined'
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(invoiceLink);
                      toast.success('Invoice link copied');
                    } catch {
                      toast.error('Failed to copy');
                    }
                  }}
                  sx={{ whiteSpace: 'nowrap', borderRadius: 3 }}
                >
                  Copy Link
                </Button>
              </Stack>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeInvoiceDialog}>Cancel</Button>
          <Button
            variant='contained'
            onClick={createInvoice}
            disabled={!!invoiceLink}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <ServiceDetailsDialog
        open={serviceDialogOpen}
        onClose={() => {
          setServiceDialogOpen(false);
          setSelectedService(null);
          setStatusNote('');
        }}
        selected={selectedService}
        statusSelection={statusSelection}
        setStatusSelection={setStatusSelection}
        note={statusNote}
        setNote={setStatusNote}
        saving={savingStatus || updateLoading || historyInsertLoading}
        historyLoading={serviceHistoryLoading}
        historyError={serviceHistoryError}
        history={serviceHistory}
        handleSave={async () => {
          if (!selectedService) return;
          if (!statusNote.trim()) {
            toast.error('Please provide a note for this status change');
            return;
          }
          setSavingStatus(true);
          try {
            // replace quote_notes with the new note (history is tracked in service_status_history)
            const trimmed = statusNote.trim();
            const payload = {
              status: statusSelection,
              quote_notes: trimmed,
              updated_at: new Date().toISOString(),
            };
            const { error } = await updateServiceRequest(
              { id: selectedService.id },
              payload,
            );
            if (error) {
              toast.error('Failed to update');
              return;
            }
            // insert into service_status_history
            const { error: histErr } = await insertServiceHistory({
              service_request_id: selectedService.id,
              status: statusSelection,
              message: statusNote.trim(),
              created_by: session?.user?.id || null,
            });
            if (histErr) {
              console.error('history insert error', histErr);
              toast.error('Failed to save history');
              return;
            }
            // insert into service_request_edit_logs
            try {
              const prev = {
                status: selectedService.status,
                quote_notes: selectedService.quote_notes || '',
              };
              const next = {
                status: statusSelection,
                quote_notes: trimmed,
              };
              const changed = Object.keys(next).filter(
                (k) => String(prev[k] ?? '') !== String(next[k] ?? ''),
              );
              if (changed.length > 0) {
                await insertServiceEditLog({
                  service_request_id: selectedService.id,
                  actor_user_id: session?.user?.id || null,
                  changed_fields: changed,
                  previous_values: prev,
                  new_values: next,
                });
              }
            } catch (logErr) {
              console.error('edit log insert error', logErr);
              // non-blocking
            }
            toast.success('Service status updated');
            const t = Date.now();
            setReloadKey(t);
            setServiceDialogOpen(false);
            setSelectedService(null);
            setStatusNote('');
          } finally {
            setSavingStatus(false);
          }
        }}
      />
    </Box>
  );
}
