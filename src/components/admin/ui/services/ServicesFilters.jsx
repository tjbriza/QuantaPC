import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

export default function ServicesFilters({
  title = 'Services',
  statuses,
  setStatuses,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  paymentMethod,
  setPaymentMethod,
  serviceId,
  setServiceId,
  technicianId,
  setTechnicianId,
  search,
  setSearch,
  STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  SERVICE_OPTIONS,
  TECHNICIAN_OPTIONS,
  applyAdvancedFilters,
  resetAdvancedFilters,
  isDirty,
  appliedAdvancedFilters,
}) {
  const clearDisabled =
    !search &&
    !statuses.length &&
    !dateFrom &&
    !dateTo &&
    !paymentMethod &&
    !serviceId &&
    !technicianId &&
    !Object.values(appliedAdvancedFilters || {}).some((v) =>
      Array.isArray(v) ? v.length : v,
    ) &&
    !isDirty;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
      <Typography variant='h5' fontWeight={600}>
        {title}
      </Typography>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        sx={{ flexWrap: 'wrap', width: '100%' }}
      >
        <TextField
          size='small'
          label='Search (ID / SR # / Email / Name)'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            minWidth: 260,
            '& .MuiOutlinedInput-root': { borderRadius: 4 },
          }}
        />
        <FormControl
          size='small'
          sx={{
            minWidth: 180,
            '& .MuiOutlinedInput-root': { borderRadius: 4 },
          }}
        >
          <InputLabel id='statuses-label'>Status</InputLabel>
          <Select
            labelId='statuses-label'
            multiple
            value={statuses}
            label='Status'
            onChange={(e) => {
              const value = e.target.value;
              setStatuses(typeof value === 'string' ? value.split(',') : value);
            }}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((val) => (
                  <Chip size='small' key={val} label={val} />
                ))}
              </Box>
            )}
          >
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label='From'
          type='date'
          size='small'
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
        />
        <TextField
          label='To'
          type='date'
          size='small'
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
        />
        <FormControl
          size='small'
          sx={{
            minWidth: 160,
            '& .MuiOutlinedInput-root': { borderRadius: 4 },
          }}
        >
          <InputLabel id='payment-label'>Payment</InputLabel>
          <Select
            labelId='payment-label'
            value={paymentMethod}
            label='Payment'
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <MenuItem value=''>All</MenuItem>
            {PAYMENT_METHOD_OPTIONS.map((pm) => (
              <MenuItem key={pm} value={pm}>
                {pm}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          size='small'
          sx={{
            minWidth: 200,
            '& .MuiOutlinedInput-root': { borderRadius: 4 },
          }}
        >
          <InputLabel id='service-label'>Service</InputLabel>
          <Select
            labelId='service-label'
            value={serviceId}
            label='Service'
            onChange={(e) => setServiceId(e.target.value)}
          >
            <MenuItem value=''>All</MenuItem>
            {SERVICE_OPTIONS.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          size='small'
          sx={{
            minWidth: 200,
            '& .MuiOutlinedInput-root': { borderRadius: 4 },
          }}
        >
          <InputLabel id='technician-label'>Technician</InputLabel>
          <Select
            labelId='technician-label'
            value={technicianId}
            label='Technician'
            onChange={(e) => setTechnicianId(e.target.value)}
          >
            <MenuItem value=''>All</MenuItem>
            {TECHNICIAN_OPTIONS.map((t) => (
              <MenuItem key={t.value} value={t.value}>
                {t.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack direction='row' spacing={1} alignItems='center'>
          <Button
            variant='contained'
            size='medium'
            onClick={applyAdvancedFilters}
            disabled={!isDirty}
            sx={{ borderRadius: 3 }}
          >
            Apply
          </Button>
          <Tooltip title='Clear filters'>
            <span>
              <IconButton
                size='small'
                onClick={resetAdvancedFilters}
                disabled={clearDisabled}
              >
                <ClearIcon fontSize='small' />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>
    </Box>
  );
}
