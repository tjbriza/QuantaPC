import { useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useSupabaseRead } from '../../../hooks/useSupabaseRead';
import EmptyState from '../../ui/EmptyState';

export default function ServicesDashboard() {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const { data, loading, error } = useSupabaseRead('service_requests', {
    select:
      'id, service_number, status, quote_amount, created_at, xendit_invoice_url, service:services(name)',
    filter: { user_id: userId },
    order: { column: 'created_at', ascending: false },
    enabled: !!userId,
  });

  const rows = useMemo(() => data || [], [data]);

  if (!userId) return null;

  return (
    <div className='flex flex-col w-full mt-4 mb-16'>
      <div className='flex justify-between items-center mb-6 w-full'>
        <h1 className='text-3xl font-bold'>My Service Requests</h1>
      </div>
      {loading ? (
        <div className='text-base'>Loading your service requests…</div>
      ) : error ? (
        <div className='text-red-600 text-base'>
          Failed to load service requests.
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title='No service requests yet'
          description='Submit a service request to get started.'
          actionLabel='Request a Service'
          actionHref='/services'
        />
      ) : (
        <div className='overflow-x-auto bg-white border rounded-lg'>
          <table className='min-w-full divide-y divide-slate-200'>
            <thead className='bg-slate-50'>
              <tr>
                <th className='px-4 py-3 text-left text-sm font-semibold text-slate-700'>
                  SR #
                </th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-slate-700'>
                  Service
                </th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-slate-700'>
                  Status
                </th>
                <th className='px-4 py-3 text-right text-sm font-semibold text-slate-700'>
                  Quote
                </th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-slate-700'>
                  Requested
                </th>
                <th className='px-4 py-3 text-right text-sm font-semibold text-slate-700'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200'>
              {rows.map((r) => (
                <tr key={r.id} className='hover:bg-slate-50'>
                  <td className='px-4 py-3 text-sm font-mono'>
                    {r.service_number}
                  </td>
                  <td className='px-4 py-3 text-sm'>
                    {r.service?.name || '-'}
                  </td>
                  <td className='px-4 py-3 text-sm capitalize'>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        r.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : r.status === 'quoted'
                            ? 'bg-amber-100 text-amber-700'
                            : r.status === 'failed' || r.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-sm text-right'>
                    {r.quote_amount
                      ? `₱${Number(r.quote_amount).toLocaleString()}`
                      : '—'}
                  </td>
                  <td className='px-4 py-3 text-sm'>
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className='px-4 py-3 text-sm text-right space-x-2'>
                    {r.xendit_invoice_url ? (
                      <a
                        className='inline-block px-3 py-1 rounded border border-slate-300 hover:bg-slate-50'
                        href={r.xendit_invoice_url}
                        target='_blank'
                        rel='noreferrer'
                      >
                        View Invoice
                      </a>
                    ) : null}
                    <a
                      className='inline-block px-3 py-1 rounded bg-slate-800 text-white hover:bg-slate-900'
                      href={`/dashboard/services/${r.service_number}`}
                    >
                      View Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
