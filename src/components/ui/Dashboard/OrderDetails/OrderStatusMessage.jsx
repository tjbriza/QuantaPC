import { useState } from 'react';
import { useToast } from '../../../../context/ToastContext';
import { useAuth } from '../../../../context/AuthContext';
import { supabase } from '../../../../supabaseClient';
import CancelOrderModal from './CancelOrderModal';

export default function OrderStatusMessage({ order }) {
  const { toast } = useToast();
  const { session } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const cancellableStatuses = ['pending', 'paid'];

  const getStatusMessage = (o) => {
    switch (o.status) {
      case 'delivered':
        return 'Thank you for Shopping with quantapc!';
      case 'shipped':
        return 'quantapc has shipped out the order.';
      case 'cancelled':
        return `You cancelled this order on ${new Date(o.cancelled_at || o.created_at).toLocaleDateString()}${o.cancellation_reason ? `: “${o.cancellation_reason}”` : ''}`;
      case 'failed':
        return "We're sorry, your delivery was unsuccessful.";
      case 'expired':
        return 'This order has expired and been cancelled.';
      case 'paid':
        return 'Your order has been confirmed and is being processed.';
      case 'pending':
        return 'Changed your mind? You can cancel your order before it ships.';
      default:
        return 'Order is being processed.';
    }
  };

  const [showCancelModal, setShowCancelModal] = useState(false);

  const submitCancellation = async (reasonRaw) => {
    if (!order || submitting) return;
    const reason = reasonRaw || 'User requested cancellation';
    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc('cancel_order', {
        p_order: order.id,
        p_reason: reason,
        p_restore_stock: true,
      });
      if (error) {
        console.error('cancel_order rpc error', error);
        toast.error(error.message || 'Cancellation failed');
        setShowCancelModal(false);
        return;
      }
      if (!data?.success) {
        toast.error(data?.message || 'Unable to cancel order');
        setShowCancelModal(false);
        return;
      }
      toast.success('Order cancelled');
      setShowCancelModal(false);
      // simple refresh
      setTimeout(() => window.location.reload(), 600);
    } catch (e) {
      console.error(e);
      toast.error('Cancellation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getActionButton = (o) => {
    if (submitting) {
      return (
        <button
          disabled
          className='bg-gray-400 text-white px-6 py-2 rounded text-sm cursor-not-allowed'
        >
          Cancelling...
        </button>
      );
    }
    switch (o.status) {
      case 'delivered':
        return (
          <button className='bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded text-sm hover:bg-gray-50'>
            Buy Again
          </button>
        );
      case 'shipped':
        return (
          <button className='bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded text-sm hover:bg-gray-50'>
            Order Received
          </button>
        );
      case 'failed':
        return (
          <button className='bg-gray-900 text-white px-6 py-2 rounded text-sm hover:bg-gray-800'>
            Reschedule / Contact Support
          </button>
        );
      case 'pending':
        return (
          <div className='flex gap-3'>
            {o.xendit_invoice_url && (
              <a
                href={o.xendit_invoice_url}
                target='_blank'
                rel='noreferrer'
                className='bg-orange-600 text-white px-6 py-2 rounded text-sm hover:bg-orange-700 inline-block'
              >
                Pay Order
              </a>
            )}
            <button
              onClick={() => setShowCancelModal(true)}
              className='bg-gray-900 text-white px-6 py-2 rounded text-sm hover:bg-gray-800'
            >
              Cancel Order
            </button>
          </div>
        );
      case 'paid':
        return (
          <div className='flex gap-3'>
            <button
              onClick={() => setShowCancelModal(true)}
              className='bg-gray-900 text-white px-6 py-2 rounded text-sm hover:bg-gray-800'
            >
              Cancel Order
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage(order);
  const actionButton = cancellableStatuses.includes(order.status)
    ? getActionButton(order)
    : getActionButton(order); // will be null or other actions

  return (
    <>
      <div className='flex justify-between items-center mb-8'>
        <div className='text-lg'>{statusMessage}</div>
        {actionButton && <div>{actionButton}</div>}
      </div>
      <CancelOrderModal
        open={showCancelModal}
        onClose={() => (!submitting ? setShowCancelModal(false) : null)}
        onSubmit={submitCancellation}
        loading={submitting}
      />
    </>
  );
}
