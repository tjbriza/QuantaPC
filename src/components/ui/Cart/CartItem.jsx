export default function CartItem({
  item,
  selected,
  onSelectChange,
  onQuantityChange,
}) {
  return (
    <div className='px-6 py-6 hover:bg-gray-50 transition-colors flex items-center space-x-6'>
      <input
        type='checkbox'
        checked={selected}
        onChange={(e) => onSelectChange(item.cart_item_id, e.target.checked)}
        className='w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
      />
      <img
        src={item.image || 'https://placehold.co/100x100'}
        alt={item.product_name}
        className='w-20 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0'
      />
      <div className='flex-1 min-w-0'>
        <h3 className='text-lg font-semibold text-gray-900 truncate'>
          {item.product_name}
        </h3>
        <p className='text-xl font-bold text-blue-600 mt-1'>
          ${item.product_price.toFixed(2)}
        </p>
      </div>
      <div className='flex items-center space-x-3'>
        <label className='text-sm font-medium text-gray-700'>Qty:</label>
        <input
          type='number'
          min='1'
          max='99'
          value={item.quantity}
          onChange={(e) =>
            onQuantityChange(item.product_id, Number(e.target.value))
          }
          className='w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        />
      </div>
      <div className='text-right'>
        <p className='text-lg font-bold text-gray-900'>
          ${(item.product_price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
