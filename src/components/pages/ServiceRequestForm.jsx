import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';
import { useSupabaseWrite } from '../../hooks/useSupabaseWrite';
import { useAuth } from '../../context/AuthContext';
import { generateServiceNumber } from '../../utils/serviceNumber';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function ServiceRequestForm() {
  const navigate = useNavigate();
  const query = useQuery();
  const serviceKey = (query.get('service') || '').trim();
  const { session } = useAuth();

  // Load the service by key
  const { data: service, loading: serviceLoading } = useSupabaseRead(
    'services',
    {
      select: 'id, key, name, description',
      filter: { key: serviceKey || 'repairs_upgrades' },
      single: true,
      enabled: !!serviceKey,
    },
  );

  // Form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { insertData, loading: insertLoading } =
    useSupabaseWrite('service_requests');

  useEffect(() => {
    // Prefill from session if available
    if (session?.user?.email) {
      setContactEmail((e) => e || session.user.email);
    }
    if (session?.user?.user_metadata?.full_name) {
      setContactName((n) => n || session.user.user_metadata.full_name);
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service?.id) return;
    if (
      !contactName.trim() ||
      !contactEmail.trim() ||
      !issueDescription.trim()
    ) {
      return;
    }
    setSubmitting(true);
    try {
      const basePayload = {
        user_id: session?.user?.id || null,
        service_id: service.id,
        contact_name: contactName.trim(),
        contact_email: contactEmail.trim(),
        contact_phone: contactPhone.trim() || null,
        issue_description: issueDescription.trim(),
        status: 'pending',
      };

      // Generate SR# at creation. Retry to avoid rare unique collisions.
      let created = null;
      let lastError = null;
      for (let i = 0; i < 3 && !created; i++) {
        const payload = {
          ...basePayload,
          service_number: generateServiceNumber(),
        };
        const { data, error } = await insertData(payload);
        if (!error && data && data[0]) {
          created = data[0];
          break;
        }
        lastError = error;
        // if unique violation, retry; otherwise break
        if (!error?.message?.toLowerCase()?.includes('unique')) break;
      }
      if (!created) throw lastError || new Error('Failed to create request');

      setSuccess(true);
      // optional: redirect to thank you or dashboard
      setTimeout(() => navigate('/services'), 1500);
    } catch (err) {
      // could show toast or inline error
      console.error('Failed to create service request', err);
    } finally {
      setSubmitting(false);
    }
  };

  const title =
    service?.name ||
    (serviceKey === 'consultation'
      ? 'Consultations'
      : serviceKey === 'technical_support'
        ? 'Technical Support'
        : 'Repairs & Upgrades');

  return (
    <div className='min-h-screen w-full py-32'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14'>
        <h1 className='text-2xl sm:text-3xl font-bold text-slate-800 mb-6'>
          {serviceLoading ? 'Loading…' : `Request: ${title}`}
        </h1>
        <p className='text-slate-600 text-sm mb-6'>
          Fill out the form and our team will reach out by email. For
          repairs/upgrades, please describe the issue or the upgrade you want.
        </p>

        <form
          onSubmit={handleSubmit}
          className='bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 space-y-4'
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-slate-700'>
                Full Name
              </label>
              <input
                type='text'
                className='mt-1 w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700'>
                Email
              </label>
              <input
                type='email'
                className='mt-1 w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
            </div>
            <div className='sm:col-span-2'>
              <label className='block text-sm font-medium text-slate-700'>
                Phone (optional)
              </label>
              <input
                type='tel'
                className='mt-1 w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700'>
              Describe your issue or request
            </label>
            <textarea
              className='mt-1 w-full min-h-[140px] rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              required
            />
          </div>

          <div className='flex items-center justify-end gap-3 pt-2'>
            <button
              type='button'
              onClick={() => navigate('/services')}
              className='px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={submitting || !service}
              className='px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60'
            >
              {submitting ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
          {success && (
            <p className='text-sm text-green-600'>
              Request submitted. We will contact you via email.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
