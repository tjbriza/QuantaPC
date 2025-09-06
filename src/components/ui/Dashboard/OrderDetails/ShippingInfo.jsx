export default function ShippingInfo({ order }) {
  if (!order.shipping_full_name) {
    return null;
  }

  return (
    <div>
      <h3 className='font-bold text-lg mb-4'>Shipping Address</h3>
      <div className='text-sm space-y-1'>
        <div>{order.shipping_full_name}</div>
        {order.shipping_address_line && (
          <div>{order.shipping_address_line}</div>
        )}
        <div>
          {order.shipping_city}, {order.shipping_province}
        </div>
        <div>{order.shipping_postal_code}</div>
      </div>

      {order.status === 'shipped' && (
        <div className='mt-4 text-xs text-gray-600'>
          (The products are expected to be delivered soon.)
        </div>
      )}

      <div className='mt-6'>
        <h3 className='font-bold text-lg mb-2'>Payment Method</h3>
        <div className='flex items-center gap-2'>
          {order.payment_method && (
            <>
              <div className='text-blue-600'>₱</div>
              <span className='text-sm'>{order.payment_method}</span>
              <span className='text-sm text-gray-600'>
                {order.customer_email || 'Customer account'}
              </span>
            </>
          )}
          {!order.payment_method && (
            <span className='text-sm text-gray-500'>
              No payment method specified
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
