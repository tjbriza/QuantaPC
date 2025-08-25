// Failed Page (src/components/pages/OrderFailed.jsx)
import { useParams, Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function OrderFailed() {
  const { orderNumber } = useParams();

  return (
    <div className='max-w-2xl mx-auto text-center py-64'>
      <XCircle className='w-20 h-20 text-red-500 mx-auto mb-6' />
      <h1 className='text-3xl font-bold text-gray-900 mb-4'>Payment Failed</h1>
      <p className='text-gray-600 mb-8'>
        Unfortunately, we couldn't process your payment for order {orderNumber}.
        Please try again or contact our support team.
      </p>

      <div className='space-x-4'>
        <Link
          to='/cart'
          className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700'
        >
          Back to Cart
        </Link>
        <Link
          to='/catalog'
          className='bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700'
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
