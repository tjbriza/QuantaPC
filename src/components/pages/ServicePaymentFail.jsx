import { useParams, Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function ServicePaymentFail() {
  const { serviceNumber } = useParams();
  return (
    <div className='max-w-2xl mx-auto text-center py-64'>
      <XCircle className='w-20 h-20 text-red-500 mx-auto mb-6' />
      <h1 className='text-3xl font-bold text-gray-900 mb-4'>Payment Failed</h1>
      <p className='text-gray-600 mb-8'>
        We couldn't process the payment for service request {serviceNumber}. If
        you believe this is an error, you can try the invoice link again or
        contact support.
      </p>
      <div className='space-x-4'>
        <Link
          to='/services'
          className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700'
        >
          Services
        </Link>
        <Link
          to='/contact'
          className='bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700'
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
