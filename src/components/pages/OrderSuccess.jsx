import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);

  const { data: orderData } = useSupabaseRead('orders', {
    filter: { order_number: orderNumber },
    single: true,
    select: '*, order_items(*, products(name, image_url))',
  });

  useEffect(() => {
    if (orderData) {
      setOrder(orderData);
    }
  }, [orderData]);

  return (
    <div className='max-w-2xl mx-auto text-center py-64'>
      <CheckCircle className='w-20 h-20 text-green-500 mx-auto mb-6' />
      <h1 className='text-3xl font-bold text-gray-900 mb-4'>
        Payment Successful!
      </h1>
      <p className='text-gray-600 mb-8'>
        Your order has been confirmed and is being processed.
      </p>

      {order && (
        <div className='bg-white rounded-lg shadow p-6 mb-8 text-left'>
          <h2 className='text-xl font-semibold mb-4'>Order Details</h2>
          <div className='space-y-2'>
            <p>
              <span className='font-medium'>Order Number:</span>{' '}
              {order.order_number}
            </p>
            <p>
              <span className='font-medium'>Total Amount:</span> ₱
              {order.total_amount.toLocaleString()}
            </p>
            <p>
              <span className='font-medium'>Status:</span>{' '}
              <span className='text-green-600 capitalize'>{order.status}</span>
            </p>
            <p>
              <span className='font-medium'>Order Date:</span>{' '}
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      <div className='space-x-4'>
        <Link
          to='/dashboard/orders'
          className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700'
        >
          View My Orders
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
