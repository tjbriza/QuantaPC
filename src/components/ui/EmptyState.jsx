import React from 'react';

// Generic Empty State component for consistent spacing and typography
// Props:
// - icon: a lucide-react icon component (e.g., Heart, Package)
// - title: string
// - description?: string
// - actionLabel?: string
// - actionHref?: string (renders anchor)
// - actionOnClick?: () => void (renders button)
// - className?: string to extend container styles
export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
  className = '',
}) {
  return (
    <div
      className={`min-h-[50vh] flex flex-col items-center justify-center text-center w-full ${className}`}
    >
      {Icon ? (
        <Icon className='w-16 h-16 text-gray-300 mb-4' aria-hidden='true' />
      ) : null}
      {title ? (
        <h2 className='text-2xl font-semibold text-gray-700 mb-2'>{title}</h2>
      ) : null}
      {description ? (
        <p className='text-gray-500 mb-6 max-w-prose'>{description}</p>
      ) : null}
      {actionLabel ? (
        actionHref ? (
          <a
            href={actionHref}
            className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
          >
            {actionLabel}
          </a>
        ) : (
          <button
            onClick={actionOnClick}
            className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
            type='button'
          >
            {actionLabel}
          </button>
        )
      ) : null}
    </div>
  );
}
