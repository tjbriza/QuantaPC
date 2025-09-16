import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';

// Displays service request payment success info
export default function ServicePaymentSuccess() {
  const { serviceNumber } = useParams();
  const [serviceRequest, setServiceRequest] = useState(null);

  const { data } = useSupabaseRead('service_requests', {
    filter: { service_number: serviceNumber },
    single: true,
    select: '*, service:services(name), technician:technicians(name)',
  });

  useEffect(() => {
    if (data) setServiceRequest(data);
  }, [data]);

  return (
    <div className='max-w-2xl mx-auto text-center py-64'>
      <CheckCircle className='w-20 h-20 text-green-500 mx-auto mb-6' />
      <h1 className='text-3xl font-bold text-gray-900 mb-4'>
        Payment Successful!
      </h1>
      <p className='text-gray-600 mb-8'>
        Your service request payment was received.
      </p>

      {serviceRequest && (
        <div className='bg-white rounded-lg shadow p-6 mb-8 text-left'>
          <h2 className='text-xl font-semibold mb-4'>
            Service Request Details
          </h2>
          <div className='space-y-2'>
            <p>
              <span className='font-medium'>Service Number:</span>{' '}
              {serviceRequest.service_number}
            </p>
            <p>
              <span className='font-medium'>Service:</span>{' '}
              {serviceRequest.service?.name || '—'}
            </p>
            <p>
              <span className='font-medium'>Status:</span>{' '}
              <span className='text-green-600 capitalize'>
                {serviceRequest.status}
              </span>
            </p>
            {serviceRequest.quote_amount && (
              <p>
                <span className='font-medium'>Amount Paid:</span> ₱
                {Number(serviceRequest.quote_amount).toLocaleString()}
              </p>
            )}
            <p>
              <span className='font-medium'>Requested At:</span>{' '}
              {new Date(serviceRequest.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      <div className='space-x-4'>
        <Link
          to='/services'
          className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700'
        >
          Services
        </Link>
        <Link
          to='/dashboard'
          className='bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700'
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
