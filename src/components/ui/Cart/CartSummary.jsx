import { Link } from 'react-router-dom';

export default function CartSummary({ totalItems, totalPrice }) {
  return (
    <div className='bg-gray-50 px-6 py-6 border-t-2 border-gray-300'>
      <div className='flex justify-between items-center'>
        <div className='text-gray-600'>
          <span className='font-medium'>Total Items: {totalItems}</span>
        </div>
        <div className='text-right'>
          <p className='text-2xl font-bold text-gray-900'>
            Total:{' '}
            {totalPrice.toLocaleString('en-PH', {
              style: 'currency',
              currency: 'PHP',
            })}
          </p>
        </div>
      </div>
      <div className='mt-4 flex justify-end space-x-4'>
        <Link
          to='/catalog'
          className='bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium'
        >
          Continue Shopping
        </Link>
        <button className='bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-bold'>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
