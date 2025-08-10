import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

export default function CartItem({
  item,
  selected,
  onSelectChange,
  onQuantityChange,
}) {
  const maxQty = item.stock_quantity ?? 1;
  const [quantity, setQuantity] = useState(item.quantity);

  const updateQuantity = (newQty) => {
    const clamped = Math.max(1, Math.min(maxQty, newQty));
    setQuantity(clamped);
    onQuantityChange(item.product_id, clamped);
  };

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

      <div className='flex items-center space-x-2'>
        <label className='text-sm font-medium text-gray-700'>Qty:</label>
        <div className='flex items-center border border-gray-300 rounded-md overflow-hidden'>
          <button
            type='button'
            onClick={() => updateQuantity(quantity - 1)}
            disabled={quantity <= 1}
            className='px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'
          >
            <Minus size={16} />
          </button>

          <input
            type='number'
            min='1'
            max={maxQty}
            value={quantity}
            onChange={(e) => updateQuantity(parseInt(e.target.value) || 1)}
            onBlur={() => updateQuantity(quantity)}
            className='w-16 px-2 py-2 text-center border-0 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
          />

          <button
            type='button'
            onClick={() => updateQuantity(quantity + 1)}
            disabled={quantity >= maxQty}
            className='px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className='text-right'>
        <p className='text-lg font-bold text-gray-900'>
          ${(item.product_price * quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
