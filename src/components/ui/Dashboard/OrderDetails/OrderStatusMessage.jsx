export default function OrderStatusMessage({ order }) {
  const getStatusMessage = (order) => {
    switch (order.status) {
      case 'delivered':
        return 'Thank you for Shopping with quantapc!';
      case 'shipped':
        return 'quantapc has shipped out the order.';
      case 'cancelled':
        return `You cancelled this order on ${new Date(order.created_at).toLocaleDateString()}.`;
      case 'failed':
        return "We're sorry, your delivery was unsuccessful.";
      case 'expired':
        return 'This order has expired and been cancelled.';
      case 'paid':
        return 'Your order has been confirmed and is being processed.';
      case 'pending':
        return 'Changed your mind? You can cancel your order before it ships.';
      default:
        return 'Order is being processed.';
    }
  };

  const getActionButton = (order) => {
    switch (order.status) {
      case 'delivered':
        return (
          <button className='bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded text-sm hover:bg-gray-50'>
            Buy Again
          </button>
        );
      case 'shipped':
        return (
          <button className='bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded text-sm hover:bg-gray-50'>
            Order Received
          </button>
        );
      case 'cancelled':
      case 'expired':
        return null;
      case 'failed':
        return (
          <button className='bg-gray-900 text-white px-6 py-2 rounded text-sm hover:bg-gray-800'>
            Reschedule / Contact Support
          </button>
        );
      case 'pending':
        return order.xendit_invoice_url ? (
          <div className='flex gap-3'>
            <a
              href={order.xendit_invoice_url}
              target='_blank'
              rel='noreferrer'
              className='bg-orange-600 text-white px-6 py-2 rounded text-sm hover:bg-orange-700 inline-block'
            >
              Complete Payment
            </a>
            <button className='bg-gray-900 text-white px-6 py-2 rounded text-sm hover:bg-gray-800'>
              Cancel Order
            </button>
          </div>
        ) : (
          <button className='bg-gray-900 text-white px-6 py-2 rounded text-sm hover:bg-gray-800'>
            Cancel Order
          </button>
        );
      case 'paid':
        return (
          <button className='bg-gray-900 text-white px-6 py-2 rounded text-sm hover:bg-gray-800'>
            Cancel Order
          </button>
        );
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage(order);
  const actionButton = getActionButton(order);

  return (
    <div className='flex justify-between items-center mb-8'>
      <div className='text-lg'>{statusMessage}</div>
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
}
