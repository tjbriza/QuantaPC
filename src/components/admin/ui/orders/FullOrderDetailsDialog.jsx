import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';

// Read-only rich details view for an order
export default function FullOrderDetailsDialog({
  open,
  onClose,
  order,
  items,
  loading = false,
}) {
  const monetary = (v) =>
    typeof v === 'number' ? `₱${v.toLocaleString()}` : v == null ? '—' : v;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>Full Order Details</DialogTitle>
      <DialogContent dividers>
        {loading || !order ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant='subtitle1' fontWeight={600} gutterBottom>
                Order Overview
              </Typography>
              <Grid
                container
                spacing={1}
                sx={{ display: 'flex', flexDirection: 'column' }}
              >
                <Grid item xs={6} md={3}>
                  <Typography variant='caption' color='text.secondary'>
                    Order #
                  </Typography>
                  <Typography variant='body2'>
                    {order.order_number || '—'}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant='caption' color='text.secondary'>
                    Status
                  </Typography>
                  <Box>
                    <Chip size='small' label={order.status} color='primary' />
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant='caption' color='text.secondary'>
                    Created
                  </Typography>
                  <Typography variant='body2'>
                    {new Date(order.created_at).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant='caption' color='text.secondary'>
                    Paid At
                  </Typography>
                  <Typography variant='body2'>
                    {order.paid_at
                      ? new Date(order.paid_at).toLocaleString()
                      : '—'}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant='caption' color='text.secondary'>
                    Payment Method
                  </Typography>
                  <Typography variant='body2'>
                    {order.payment_method || '—'}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant='caption' color='text.secondary'>
                    Subtotal
                  </Typography>
                  <Typography variant='body2'>
                    {monetary(order.subtotal)}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant='caption' color='text.secondary'>
                    Shipping Fee
                  </Typography>
                  <Typography variant='body2'>
                    {monetary(order.shipping_fee)}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant='caption' color='text.secondary'>
                    Total
                  </Typography>
                  <Typography variant='body2' fontWeight={600}>
                    {monetary(order.total_amount)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant='caption' color='text.secondary'>
                    Customer Email
                  </Typography>
                  <Typography variant='body2'>
                    {order.customer_email || '—'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant='subtitle1' fontWeight={600} gutterBottom>
                Shipping
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <Typography variant='caption' color='text.secondary'>
                    Name
                  </Typography>
                  <Typography variant='body2'>
                    {order.shipping_full_name || '—'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant='caption' color='text.secondary'>
                    Phone
                  </Typography>
                  <Typography variant='body2'>
                    {order.shipping_phone || '—'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='caption' color='text.secondary'>
                    Address
                  </Typography>
                  <Typography variant='body2'>
                    {[
                      order.shipping_address_line,
                      order.shipping_city,
                      order.shipping_province,
                      order.shipping_postal_code,
                    ]
                      .filter(Boolean)
                      .join(', ') || '—'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant='subtitle1' fontWeight={600} gutterBottom>
                Items ({(items || []).length})
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {(items || []).map((it) => (
                  <Box
                    key={it.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      component='img'
                      src={it.product?.image_url || 'https://placehold.co/48'}
                      alt={it.product?.name}
                      sx={{
                        width: 48,
                        height: 48,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant='body2' noWrap>
                        {it.product?.name}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        Qty: {it.quantity} • Price: ₱{it.price_snapshot}
                      </Typography>
                    </Box>
                    <Typography variant='body2' fontWeight={600}>
                      ₱{(it.quantity * it.price_snapshot).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
                {(!items || items.length === 0) && (
                  <Typography variant='body2' color='text.secondary'>
                    No items.
                  </Typography>
                )}
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
