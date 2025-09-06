export default function OrderRefundInfo({ order }) {
  if (order.status !== 'cancelled' && order.status !== 'expired') {
    return null;
  }

  return (
    <div className='text-right text-sm text-gray-600 mb-6'>
      <div>
        ₱ {order.total_amount?.toLocaleString()} was refunded to your{' '}
        {order.payment_method || 'payment method'}
      </div>
      <div>
        ({order.customer_email || 'account'}) on{' '}
        {order.paid_at
          ? new Date(order.paid_at).toLocaleDateString()
          : new Date().toLocaleDateString()}
        .
      </div>
    </div>
  );
}
