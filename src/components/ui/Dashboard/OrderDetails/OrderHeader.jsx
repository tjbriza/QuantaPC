import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function OrderHeader({ order }) {
  return (
    <>
      {/* Back Button */}
      <div className='mb-6'>
        <Link
          to='/dashboard/orders'
          className='inline-flex items-center gap-2 text-lg text-black hover:text-gray-700 hover:underline'
        >
          <ArrowLeft className='w-6 h-6' />
          Back to My Orders
        </Link>
      </div>

      <h2 className='text-2xl font-semibold mb-6'>Order Tracking</h2>

      {/* Order Info Table */}
      <div className='bg-sky-500 p-4 mb-8'>
        <div className='grid grid-cols-4 gap-4 text-center'>
          <div>
            <div className='font-medium text-sm mb-1'>ORDER NUMBER (ID)</div>
            <div className='text-lg font-bold'>{order.order_number}</div>
          </div>
          <div>
            <div className='font-medium text-sm mb-1'>TOTAL</div>
            <div className='text-lg font-bold'>
              ₱ {order.total_amount?.toLocaleString()}
            </div>
          </div>
          <div>
            <div className='font-medium text-sm mb-1'>SHIP TO</div>
            <div className='text-lg font-bold'>
              {order.shipping_full_name || 'N/A'}
            </div>
          </div>
          <div>
            <div className='font-medium text-sm mb-1'>ORDER DATE</div>
            <div className='text-lg font-bold'>
              {new Date(order.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
