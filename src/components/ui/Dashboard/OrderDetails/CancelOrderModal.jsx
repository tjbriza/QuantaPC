import { useState, useEffect } from 'react';

// Tailwind-based cancellation modal aligned with existing user dashboard design.
export default function CancelOrderModal({ open, onClose, onSubmit, loading }) {
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setReason('');
      setTouched(false);
    }
  }, [open]);

  if (!open) return null;

  const disabled = loading || (!reason.trim() && touched);

  return (
    <div className='fixed inset-0 z-[1200] flex items-center justify-center'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='relative bg-white w-full max-w-md rounded-lg shadow-xl border border-gray-200 p-6 animate-fade-in'>
        <h2 className='text-xl font-semibold mb-2'>Cancel Order</h2>
        <p className='text-sm text-gray-600 mb-4'>
          You can cancel while the order is still pending or paid (before it
          ships). Optionally tell us why so we can improve.
        </p>
        <label className='block text-sm font-medium mb-1'>
          Reason (optional)
        </label>
        <textarea
          className='w-full border rounded-md p-2 text-sm min-h-[110px] focus:outline-none focus:ring-2 focus:ring-gray-900/70 focus:border-gray-900 resize-y'
          placeholder='e.g. Ordered by mistake, found a better price, need to change items, etc.'
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          onBlur={() => setTouched(true)}
          maxLength={400}
        />
        <div className='flex justify-between mt-2 text-xs text-gray-500'>
          <span>
            {reason.trim() ? `${reason.trim().length} / 400` : 'Optional'}
          </span>
          {reason.length > 360 && <span>{400 - reason.length} left</span>}
        </div>
        <div className='flex items-center justify-end gap-3 mt-6'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 rounded-md text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 transition'
            disabled={loading}
          >
            Keep Order
          </button>
          <button
            type='button'
            onClick={() => onSubmit(reason.trim())}
            disabled={disabled}
            className={`px-5 py-2 rounded-md text-sm font-medium text-white transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${
              loading ? 'bg-gray-700' : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            {loading ? 'Cancelling...' : 'Confirm Cancel'}
          </button>
        </div>
        <p className='mt-4 text-[11px] text-gray-500 leading-snug'>
          Cancelling will stop further processing. If payment was already
          completed, refund handling (if applicable) may take additional time.
        </p>
      </div>
    </div>
  );
}
