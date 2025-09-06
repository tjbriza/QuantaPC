import { useParams, Link } from 'react-router-dom';
import { useSupabaseRead } from '../../../hooks/useSupabaseRead';
import { useAuth } from '../../../context/AuthContext';
import OrderHeader from '../../ui/Dashboard/OrderDetails/OrderHeader';
import OrderProgressBar from '../../ui/Dashboard/OrderDetails/OrderProgressBar';
import OrderStatusMessage from '../../ui/Dashboard/OrderDetails/OrderStatusMessage';
import OrderRefundInfo from '../../ui/Dashboard/OrderDetails/OrderRefundInfo';
import OrderItems from '../../ui/Dashboard/OrderDetails/OrderItems';
import ShippingInfo from '../../ui/Dashboard/OrderDetails/ShippingInfo';
import OrderTimeline from '../../ui/Dashboard/OrderDetails/OrderTimeline';

export default function OrderDetails() {
  const { orderNumber } = useParams();
  const { session } = useAuth();

  const {
    data: order,
    loading,
    error,
  } = useSupabaseRead('orders', {
    select: `*, order_items(id, quantity, price_snapshot, products(id, name, image_url))`,
    filter: { order_number: orderNumber, user_id: session?.user?.id },
    single: true,
    enabled: !!orderNumber && !!session?.user?.id,
  });

  // Fetch status history for timeline
  const { data: history } = useSupabaseRead('order_status_history', {
    select: 'id, status, message, created_at',
    filter: { order_id: order?.id },
    order: { column: 'created_at', ascending: true },
    enabled: !!order?.id,
  });

  if (loading) return <div className='p-8 text-center'>Loading order...</div>;
  if (error)
    return (
      <div className='p-8 text-center text-red-600'>
        Error loading order: {error.message}
      </div>
    );
  if (!order) {
    return (
      <div className='p-8 text-center'>
        <p className='text-gray-600 mb-4'>Order not found.</p>
        <Link to='/dashboard/orders' className='text-blue-600 hover:underline'>
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className='w-full h-full'>
      <div className='w-full px-4 py-2'>
        <div className='p-8 mb-6'>
          <OrderHeader order={order} />
          <OrderProgressBar order={order} />

          <div className='border-t border-black-300 mb-8'></div>

          <OrderStatusMessage order={order} />
          <OrderRefundInfo order={order} />

          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <OrderItems order={order} />
              <ShippingInfo order={order} />
            </div>

            <div className='border-l border-black-300 pl-8'>
              <OrderTimeline history={history} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
