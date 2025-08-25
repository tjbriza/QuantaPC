import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useSupabaseRead } from '../../../hooks/useSupabaseRead';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function Orders() {
  const { session } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState('all');

  const {
    data: orders,
    loading,
    error,
  } = useSupabaseRead('orders', {
    filter: { user_id: session?.user?.id },
    select: `
      *,
      order_items(
        id,
        quantity,
        price_snapshot,
        products(
          id,
          name,
          image_url
        )
      )
    `,
    order: { column: 'created_at', ascending: false },
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className='w-5 h-5 text-yellow-500' />;
      case 'paid':
        return <CheckCircle className='w-5 h-5 text-green-500' />;
      case 'shipped':
        return <Truck className='w-5 h-5 text-blue-500' />;
      case 'delivered':
        return <Package className='w-5 h-5 text-purple-500' />;
      case 'failed':
      case 'expired':
      case 'cancelled':
        return <XCircle className='w-5 h-5 text-red-500' />;
      default:
        return <Clock className='w-5 h-5 text-gray-500' />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'failed':
      case 'expired':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders =
    selectedStatus === 'all'
      ? orders
      : orders?.filter((order) => order.status === selectedStatus);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-lg'>Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-red-600'>
          Error loading orders: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full items-center mt-4 mb-16'>
      <div className='flex justify-between items-center mb-6 w-full'>
        <h1 className='text-3xl font-bold'>My Orders</h1>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className='border rounded px-3 py-2'
        >
          <option value='all'>All Orders</option>
          <option value='pending'>Pending</option>
          <option value='paid'>Paid</option>
          <option value='shipped'>Shipped</option>
          <option value='delivered'>Delivered</option>
          <option value='cancelled'>Cancelled</option>
        </select>
      </div>

      {!orders || orders.length === 0 ? (
        <div className='text-center py-8 w-full'>
          <Package className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <p className='text-gray-500 mb-4'>No orders found.</p>
          <a
            href='/catalog'
            className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700'
          >
            Start Shopping
          </a>
        </div>
      ) : (
        <div className='space-y-6 w-full'>
          {filteredOrders?.map((order) => (
            <div
              key={order.id}
              className='bg-white rounded-lg shadow-md border p-6'
            >
              {/* Order Header */}
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <div className='flex items-center gap-3 mb-2'>
                    <h3 className='text-lg font-semibold'>
                      Order #{order.order_number}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                  <p className='text-sm text-gray-600'>
                    Ordered on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  {order.paid_at && (
                    <p className='text-sm text-gray-600'>
                      Paid on {new Date(order.paid_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className='text-right'>
                  <p className='text-lg font-bold'>
                    ₱{order.total_amount.toLocaleString()}
                  </p>
                  <p className='text-sm text-gray-600'>
                    {order.order_items?.length || 0} items
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className='border-t pt-4'>
                <div className='space-y-3'>
                  {order.order_items?.slice(0, 3).map((item) => (
                    <div key={item.id} className='flex items-center space-x-4'>
                      <img
                        src={
                          item.products?.image_url ||
                          'https://placehold.co/50x50'
                        }
                        alt={item.products?.name}
                        className='w-12 h-12 object-cover rounded border'
                      />
                      <div className='flex-1'>
                        <h4 className='font-medium text-sm'>
                          {item.products?.name}
                        </h4>
                        <p className='text-xs text-gray-600'>
                          Qty: {item.quantity} × ₱
                          {item.price_snapshot.toLocaleString()}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='font-medium text-sm'>
                          ₱
                          {(
                            item.quantity * item.price_snapshot
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}

                  {(order.order_items?.length || 0) > 3 && (
                    <p className='text-sm text-gray-500 text-center'>
                      +{order.order_items.length - 3} more items
                    </p>
                  )}
                </div>
              </div>

              {/* Shipping Info */}
              {order.shipping_full_name && (
                <div className='border-t pt-4 mt-4'>
                  <h4 className='font-medium mb-2'>Shipping Address</h4>
                  <div className='text-sm text-gray-600'>
                    <p>{order.shipping_full_name}</p>
                    <p>{order.shipping_address_line}</p>
                    <p>
                      {order.shipping_city}, {order.shipping_province}{' '}
                      {order.shipping_postal_code}
                    </p>
                  </div>
                </div>
              )}

              {/* Order Actions */}
              <div className='flex justify-end space-x-2 mt-4 pt-4 border-t'>
                {order.status === 'shipped' && (
                  <button className='bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700'>
                    Track Package
                  </button>
                )}
                {order.status === 'delivered' && (
                  <button className='bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700'>
                    Review Products
                  </button>
                )}
                {(order.status === 'pending' || order.status === 'failed') && (
                  <button
                    onClick={() =>
                      window.open(order.xendit_invoice_url, '_blank')
                    }
                    className='bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700'
                  >
                    Complete Payment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
