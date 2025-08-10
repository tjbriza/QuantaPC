export default function EmptyCart() {
  return (
    <div className='bg-white rounded-lg shadow-lg border-t-4 border-b-4 border-gray-300 p-12 text-center'>
      <div className='space-y-4'>
        <svg
          className='mx-auto w-24 h-24 text-gray-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6-2.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm0 0V9a2.5 2.5 0 00-2.5-2.5H9m0 0V4.5A2.5 2.5 0 0011.5 2h1A2.5 2.5 0 0115 4.5V7'
          />
        </svg>
        <h3 className='text-xl font-semibold text-gray-700'>
          Your cart is empty
        </h3>
        <p className='text-gray-500 mb-6'>
          Looks like you haven't added any items to your cart yet.
        </p>
        <a
          href='/catalog'
          className='inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium'
        >
          Start Shopping
        </a>
      </div>
    </div>
  );
}
