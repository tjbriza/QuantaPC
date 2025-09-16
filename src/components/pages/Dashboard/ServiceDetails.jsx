import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSupabaseRead } from '../../../hooks/useSupabaseRead';
import { useAuth } from '../../../context/AuthContext';

// Minimal status chip styling shared with Orders
function StatusBadge({ status }) {
  const map = {
    paid: 'bg-green-100 text-green-700',
    quoted: 'bg-amber-100 text-amber-700',
    failed: 'bg-red-100 text-red-700',
    cancelled: 'bg-red-100 text-red-700',
    scheduled: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-purple-100 text-purple-700',
    expired: 'bg-red-100 text-red-700',
    pending: 'bg-slate-100 text-slate-700',
  };
  const cls = map[status] || 'bg-slate-100 text-slate-700';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium capitalize ${cls}`}
    >
      {status?.replace('_', ' ') || 'unknown'}
    </span>
  );
}

export default function ServiceDetails() {
  const { serviceNumber } = useParams();
  const { session } = useAuth();

  const {
    data: service,
    loading,
    error,
  } = useSupabaseRead('service_requests', {
    select:
      'id, service_number, status, quote_amount, created_at, updated_at, xendit_invoice_url, payment_method, paid_at, quote_notes, service:services(name), technician:technicians(name)',
    filter: { service_number: serviceNumber, user_id: session?.user?.id },
    single: true,
    enabled: !!serviceNumber && !!session?.user?.id,
  });

  const { data: history } = useSupabaseRead('service_status_history', {
    select: 'id, status, message, created_at',
    filter: { service_request_id: service?.id },
    order: { column: 'created_at', ascending: true },
    enabled: !!service?.id,
  });

  const title = useMemo(
    () => (service ? `Service #${service.service_number}` : 'Service'),
    [service],
  );

  return (
    <div className='flex flex-col w-full mt-4 mb-16'>
      <div className='flex justify-between items-start mb-6 w-full'>
        <div>
          <h1 className='text-3xl font-bold'>{title}</h1>
          {service?.created_at ? (
            <p className='text-sm text-slate-600 mt-1'>
              Created {new Date(service.created_at).toLocaleString()}
            </p>
          ) : null}
        </div>
        <div className='space-x-2'>
          {service?.xendit_invoice_url ? (
            <a
              href={service.xendit_invoice_url}
              target='_blank'
              rel='noreferrer'
              className='inline-block px-3 py-2 rounded border border-slate-300 hover:bg-slate-50'
            >
              View Invoice
            </a>
          ) : null}
          <Link
            to='/dashboard/services'
            className='inline-block px-3 py-2 rounded bg-slate-800 text-white hover:bg-slate-900'
          >
            Back to Services
          </Link>
        </div>
      </div>

      {loading ? (
        <div className='text-base'>Loading service…</div>
      ) : error ? (
        <div className='text-red-600 text-base'>Failed to load service.</div>
      ) : !service ? (
        <div className='text-gray-600'>Service not found.</div>
      ) : (
        <div className='grid md:grid-cols-3 gap-6 w-full'>
          <div className='md:col-span-2 space-y-6'>
            <div className='bg-white rounded-lg border p-6'>
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <div className='flex items-center gap-3 mb-2'>
                    <h3 className='text-lg font-semibold'>
                      {service.service?.name || 'Service Request'}
                    </h3>
                    <StatusBadge status={service.status} />
                  </div>
                  <p className='text-sm text-slate-600'>
                    Service Number: {service.service_number}
                  </p>
                  {service?.technician?.name ? (
                    <p className='text-sm text-slate-600'>
                      Technician: {service.technician.name}
                    </p>
                  ) : null}
                </div>
                <div className='text-right'>
                  <p className='text-lg font-bold'>
                    {service.quote_amount
                      ? `₱${Number(service.quote_amount).toLocaleString()}`
                      : '—'}
                  </p>
                  {service.payment_method && (
                    <p className='text-sm text-slate-600 capitalize'>
                      {service.payment_method}
                    </p>
                  )}
                </div>
              </div>
              <div className='border-t pt-4 mt-2 flex items-center justify-between'>
                <div className='text-sm text-slate-600'>
                  Invoice Link:
                  {service.xendit_invoice_url ? (
                    <a
                      href={service.xendit_invoice_url}
                      target='_blank'
                      rel='noreferrer'
                      className='ml-2 text-blue-600 hover:underline'
                    >
                      Open invoice
                    </a>
                  ) : (
                    <span className='ml-2 text-slate-500'>Not available</span>
                  )}
                </div>
                {service.xendit_invoice_url && (
                  <a
                    href={service.xendit_invoice_url}
                    target='_blank'
                    rel='noreferrer'
                    className='px-4 py-2 rounded bg-slate-800 text-white hover:bg-slate-900'
                  >
                    View / Pay Invoice
                  </a>
                )}
              </div>
            </div>

            <div className='bg-white rounded-lg border p-6'>
              <h2 className='text-lg font-semibold mb-4'>Notes</h2>
              <p className='text-sm whitespace-pre-wrap'>
                {service.quote_notes || 'No notes yet.'}
              </p>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='bg-white rounded-lg border p-6'>
              <h2 className='text-lg font-semibold mb-4'>Status Timeline</h2>
              <ol className='relative border-l border-slate-200 pl-4'>
                {(history || []).length === 0 ? (
                  <p className='text-sm text-slate-600'>No history yet.</p>
                ) : (
                  (history || []).map((h) => (
                    <li key={h.id} className='mb-6 ml-2'>
                      <div className='absolute w-3 h-3 bg-slate-300 rounded-full mt-1.5 -left-1.5 border border-white'></div>
                      <time className='mb-1 text-xs font-normal leading-none text-slate-500'>
                        {new Date(h.created_at).toLocaleString()}
                      </time>
                      <p className='text-sm font-medium capitalize'>
                        {h.status}
                      </p>
                      {h.message ? (
                        <p className='text-sm text-slate-600'>{h.message}</p>
                      ) : null}
                    </li>
                  ))
                )}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
