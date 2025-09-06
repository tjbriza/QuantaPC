import { CheckCircle, Truck, XCircle } from 'lucide-react';

// status for progress tracking
const progressSteps = ['pending', 'paid', 'shipped', 'delivered'];
const statusMeta = {
  pending: { label: 'Pending', progressLabel: 'Ordered' },
  paid: { label: 'Paid', progressLabel: 'Ordered' },
  shipped: { label: 'Shipped', progressLabel: 'Shipped' },
  delivered: { label: 'Delivered', progressLabel: 'Delivered' },
  failed: { label: 'Failed', progressLabel: 'Failed' },
  expired: { label: 'Expired', progressLabel: 'Expired' },
  cancelled: { label: 'Cancelled', progressLabel: 'Cancelled' },
};

export default function OrderProgressBar({ order }) {
  const getProgressPercentage = (status) => {
    if (['failed', 'expired', 'cancelled'].includes(status)) {
      return { progress: 100, isError: true };
    }
    const currentIndex = progressSteps.indexOf(status);
    if (currentIndex === -1) return { progress: 0, isError: false };
    return {
      progress: ((currentIndex + 1) / progressSteps.length) * 100,
      isError: false,
    };
  };

  const { progress, isError } = getProgressPercentage(order.status);

  return (
    <div className='mb-8'>
      <div className='flex items-center mb-4 relative'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full h-1 bg-gray-300'></div>
        </div>

        <div className='absolute inset-0 flex items-center'>
          <div
            className={`h-1 transition-all duration-300 ${
              isError ? 'bg-red-500' : 'bg-gray-900'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className='flex justify-between items-center w-full relative z-10'>
          <div className='flex flex-col items-center'>
            <div
              className={`w-6 h-6 rounded-full border-2 border-white ${
                progress >= 25
                  ? isError
                    ? 'bg-red-500'
                    : 'bg-gray-900'
                  : 'bg-gray-300'
              }`}
            ></div>
          </div>

          <div className='flex flex-col items-center'>
            <div
              className={`p-2 rounded-full border-2 border-white ${
                progress >= 75
                  ? isError
                    ? 'bg-red-500'
                    : 'bg-gray-900'
                  : 'bg-gray-300'
              }`}
            >
              <Truck
                className={`w-6 h-6 ${
                  progress >= 75 ? 'text-white' : 'text-gray-400'
                }`}
              />
            </div>
          </div>

          <div className='flex flex-col items-center'>
            <div
              className={`p-2 rounded-full border-2 border-white ${
                progress >= 100
                  ? isError
                    ? 'bg-red-500'
                    : 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            >
              {isError ? (
                <XCircle className='w-6 h-6 text-white' />
              ) : (
                <CheckCircle
                  className={`w-6 h-6 ${
                    progress >= 100 ? 'text-white' : 'text-gray-400'
                  }`}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='flex justify-between text-sm font-medium'>
        <span className={progress >= 25 ? 'text-gray-900' : 'text-gray-400'}>
          {statusMeta[order.status]?.progressLabel || 'Ordered'}
        </span>
        <span className={progress >= 75 ? 'text-gray-900' : 'text-gray-400'}>
          Out for Delivery
        </span>
        <span
          className={
            isError
              ? 'text-red-500'
              : progress >= 100
                ? 'text-green-500'
                : 'text-gray-400'
          }
        >
          {isError
            ? order.status === 'cancelled'
              ? 'Cancelled'
              : order.status === 'failed'
                ? 'Delivery Failed'
                : order.status === 'expired'
                  ? 'Expired'
                  : 'Failed'
            : 'Delivered'}
        </span>
      </div>
    </div>
  );
}
