export default function OrderRefundInfo({ order }) {
  if (order.status !== 'cancelled' && order.status !== 'expired') return null;

  const isPaid = !!order.paid_at;
  const reason = order.cancellation_reason;

  return (
    <div className='text-right text-sm text-gray-600 mb-6'>
      {order.status === 'expired' && (
        <div>
          This invoice expired and the order was cancelled automatically.
        </div>
      )}
      {order.status === 'cancelled' && (
        <div>
          Order cancelled
          {order.cancelled_at && (
            <> on {new Date(order.cancelled_at).toLocaleDateString()}</>
          )}
          {reason && <> — {reason}</>}.
        </div>
      )}
      {isPaid && (
        <div className='mt-1'>
          Payment was received; refund processing (if applicable) will be
          handled separately.
        </div>
      )}
    </div>
  );
}
