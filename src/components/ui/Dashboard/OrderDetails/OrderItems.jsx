export default function OrderItems({ order }) {
  return (
    <div className='mb-8'>
      <h3 className='font-bold text-lg mb-4'>Items Purchased</h3>
      <div className='space-y-3'>
        {order.order_items?.map((item) => (
          <div key={item.id} className='flex gap-3'>
            <img
              src={item.products?.image_url || 'https://placehold.co/48x48'}
              alt={item.products?.name}
              className='w-12 h-12 object-cover rounded border'
            />
            <div className='flex-1'>
              <p className='font-medium text-sm'>{item.products?.name}</p>
              <p className='text-xs text-gray-500'>
                Qty: {item.quantity} × ₱{item.price_snapshot?.toLocaleString()}
              </p>
            </div>
            <div className='text-right text-sm font-medium'>
              ₱{(item.quantity * item.price_snapshot).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
