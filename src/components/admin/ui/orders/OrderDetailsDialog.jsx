import React from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
} from '@mui/material';

export default function OrderDetailsDialog({
  open,
  onClose,
  selectedOrder,
  statusSelection,
  setStatusSelection,
  statusMessage,
  setStatusMessage,
  handleSaveStatus,
  orderWriteLoading,
  historyWriteLoading,
  historyLoading,
  historyError,
  orderHistory,
  itemsLoading,
  itemsError,
  items,
}) {
  const noChanges =
    selectedOrder &&
    !statusMessage.trim() &&
    statusSelection === (selectedOrder?.status || '');
  const saveDisabled =
    !selectedOrder || noChanges || orderWriteLoading || historyWriteLoading;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='md'
      sx={{ '& .MuiPaper-root': { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ borderRadius: 3, pb: 1.5 }}>Order Details</DialogTitle>
      <DialogContent dividers sx={{ borderRadius: 3 }}>
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

            <FormControl
              fullWidth
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                },
              }}
            >
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

            <TextField
              fullWidth
              label='Status Change Message'
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              multiline
              rows={2}
              required
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                },
              }}
              placeholder='Enter a message explaining the status change...'
            />

            <Typography variant='h6' sx={{ mt: 2 }}>
              Status History
            </Typography>
            {historyLoading ? (
              <CircularProgress size={20} />
            ) : historyError ? (
              <Typography color='error'>Error loading order history</Typography>
            ) : (
              <List sx={{ mb: 3 }}>
                {(orderHistory || []).map((history) => (
                  <ListItem key={history.id} divider>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography variant='body1' color='primary'>
                            {history.status}
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            {new Date(history.created_at).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                      secondary={history.message}
                    />
                  </ListItem>
                ))}
              </List>
            )}

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
      <DialogActions sx={{ borderRadius: 3, px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: 3 }}>
          Close
        </Button>
        <Button
          variant='contained'
          onClick={handleSaveStatus}
          disabled={saveDisabled}
          sx={{ borderRadius: 3 }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
