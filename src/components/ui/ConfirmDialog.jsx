import { useState, useCallback } from 'react';

export function useConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [resolver, setResolver] = useState(null);

  const confirm = useCallback((msg) => {
    return new Promise((resolve) => {
      setMessage(msg);
      setOpen(true);
      setResolver(() => resolve);
    });
  }, []);

  const handleCancel = () => {
    if (resolver) resolver(false);
    setOpen(false);
  };

  const handleConfirm = () => {
    if (resolver) resolver(true);
    setOpen(false);
  };

  const dialog = open ? (
    <div className='fixed inset-0 flex items-center justify-center z-100'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-96'>
        <h2 className='text-lg font-bold mb-2'>Confirm</h2>
        <p className='mb-4'>{message}</p>
        <div className='flex justify-end gap-2'>
          <button
            className='px-4 py-2 bg-gray-200 rounded cursor-pointer'
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className='px-4 py-2 bg-red-500 text-white rounded cursor-pointer'
            onClick={handleConfirm}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, dialog };
}
