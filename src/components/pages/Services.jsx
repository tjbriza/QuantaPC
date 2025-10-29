import React, { useMemo } from 'react';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CalendarCog, Handshake, Cpu } from 'lucide-react';

export default function Services() {
  const navigate = useNavigate();
  const { session } = useAuth();

  // Load services from DB (utilize schema)
  const { data: services, loading } = useSupabaseRead('services', {
    select: 'id, key, name, description, active',
    filter: { active: true },
  });

  // Defaults in case DB is empty or missing any entry
  const defaults = {
    repairs_upgrades: {
      title: 'Repairs & Upgrades',
      description:
        'Quanta PC offers fast and reliable repairs for any hardware or software issue. Upgrade your system with the latest components to keep it powerful and future-ready.',
      icon: CalendarCog,
      to: '/services/request?service=repairs_upgrades',
    },
    consultation: {
      title: 'Consultations',
      description:
        "Get guidance from Quanta PC specialists before you buy or upgrade. We'll recommend the best solutions based on your budget and goals.",
      icon: Handshake,
      to: '/services/request?service=consultation',
    },
    technical_support: {
      title: 'Technical Support',
      description:
        'Quanta PC provides dependable technical support to solve your PC issues quickly. From troubleshooting to setup assistance, our team ensures your system runs smoothly.',
      icon: Cpu,
      to: '/services/request?service=technical_support',
    },
  };

  const cards = useMemo(() => {
    const byKey = new Map((services || []).map((s) => [s.key, s]));
    const keys = ['repairs_upgrades', 'consultation', 'technical_support'];
    return keys.map((k) => {
      const db = byKey.get(k);
      const base = defaults[k];
      return {
        key: k,
        title: db?.name || base.title,
        description: db?.description || base.description,
        Icon: base.icon,
        to: base.to,
      };
    });
  }, [services]);

  return (
    <div className='min-h-screen w-full pt-32'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14'>
        <header className='text-center mb-8 sm:mb-12'>
          <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800'>
            Our Company Services
          </h1>
          <p className='mt-3 text-sm sm:text-base text-slate-600 max-w-3xl mx-auto'>
            At Quanta PC, we make high-performance computing simple and
            accessible. Whether you need to build, buy, or rent a custom PC, or
            book repair services, we deliver technology straight to
            you—reliable, flexible, and on your terms.
          </p>
          {!session && (
            <div className='mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto'>
              <p className='text-sm text-blue-800 mb-3'>
                <strong>Login Required:</strong> Please log in to access service
                requests. Service options are disabled until you authenticate.
              </p>
              <button
                onClick={() => navigate('/login')}
                className='px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors'
              >
                Login / Register
              </button>
            </div>
          )}
        </header>

        <section className='grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {(loading ? [1, 2, 3] : cards).map((card, idx) => {
            const Icon = loading ? CalendarCog : card.Icon;
            const title = loading ? 'Loading…' : card.title;
            const description = loading
              ? 'Please wait while we load services.'
              : card.description;

            const isClickable = !loading && session;

            return (
              <div
                key={loading ? idx : card.key}
                className={`text-left rounded-2xl border border-slate-200 bg-white/80 shadow-sm transition-all p-5 sm:p-6 ${
                  isClickable
                    ? 'hover:bg-white hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    : 'cursor-not-allowed opacity-75'
                }`}
                onClick={() => isClickable && navigate(card.to)}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : -1}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    navigate(card.to);
                  }
                }}
              >
                <div className='flex items-start gap-4'>
                  <div className='shrink-0 rounded-xl bg-slate-800 text-white p-3'>
                    <Icon className='w-6 h-6' />
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-lg sm:text-xl font-semibold text-slate-900'>
                        {title}
                      </h3>
                      {!session && !loading && (
                        <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
                          Login Required
                        </span>
                      )}
                    </div>
                    <p className='mt-2 text-sm text-slate-600 leading-relaxed'>
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
