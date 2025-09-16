import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';

export default function ServiceDetailsDialog({
  open,
  onClose,
  selected,
  statusSelection,
  setStatusSelection,
  note,
  setNote,
  handleSave,
  saving,
  historyLoading,
  historyError,
  history,
}) {
  const noChanges =
    selected && !note.trim() && statusSelection === (selected?.status || '');
  const saveDisabled = !selected || noChanges || saving;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Service Request</DialogTitle>
      <DialogContent dividers>
        {selected && (
          <Box>
            <Typography variant='subtitle1' sx={{ mb: 1 }}>
              SR #: {selected.service_number || selected.id}
            </Typography>
            <Typography variant='body2' sx={{ mb: 2 }}>
              Service: {selected.service_name}
            </Typography>
            <Typography variant='body2' sx={{ mb: 2 }}>
              Customer: {selected.contact_name} • {selected.contact_email}
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id='svc-status-label'>Status</InputLabel>
              <Select
                labelId='svc-status-label'
                value={statusSelection}
                label='Status'
                onChange={(e) => setStatusSelection(e.target.value)}
              >
                <MenuItem value='pending'>pending</MenuItem>
                <MenuItem value='quoted'>quoted</MenuItem>
                <MenuItem value='paid'>paid</MenuItem>
                <MenuItem value='scheduled'>scheduled</MenuItem>
                <MenuItem value='in_progress'>in_progress</MenuItem>
                <MenuItem value='completed'>completed</MenuItem>
                <MenuItem value='failed'>failed</MenuItem>
                <MenuItem value='expired'>expired</MenuItem>
                <MenuItem value='cancelled'>cancelled</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label='Update Note (optional)'
              value={note}
              onChange={(e) => setNote(e.target.value)}
              multiline
              rows={2}
              sx={{ mb: 2 }}
              placeholder='Add a short note about this change'
            />

            <Typography variant='h6' sx={{ mt: 2, mb: 1 }}>
              Status History
            </Typography>
            {historyLoading ? (
              <Typography variant='body2'>Loading…</Typography>
            ) : historyError ? (
              <Typography color='error'>Failed to load history</Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {(history || []).map((h) => (
                  <Box
                    key={h.id}
                    sx={{ p: 1, border: '1px solid #eee', borderRadius: 1 }}
                  >
                    <Typography variant='body2' color='primary'>
                      {h.status}
                    </Typography>
                    <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap' }}>
                      {h.message}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {new Date(h.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant='contained'
          onClick={handleSave}
          disabled={saveDisabled}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
