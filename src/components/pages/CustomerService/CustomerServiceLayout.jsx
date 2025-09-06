import { Outlet, useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const CustomerServiceLayout = () => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const links = [
    { name: 'Payment FAQs', path: '/CustomerService/PaymentFaqs' },
    { name: 'Privacy Policy', path: '/CustomerService/PrivacyPolicy' },
    {
      name: 'Cancellation Policy',
      path: '/CustomerService/CancellationPolicy',
    },
    { name: 'Cookie Policy', path: '/CustomerService/CookiePolicy' },
    {
      name: 'Return And Refunds',
      path: '/CustomerService/ReturnAndRefunds',
    },
    {
      name: 'Terms And Conditions',
      path: '/CustomerService/TermsAndConditions',
    },
    { name: 'Contact Us', path: '/CustomerService/ContactUs' },
  ];

  const activeLink = links.find((link) => link.path === location.pathname);

  return (
    <div className='min-h-screen'>
      <div className='max-w-[90rem] mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-[15vh]'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-extrabold text-gray-900 sm:text-5xl'>
            Customer Service
          </h1>
          <p className='mt-4 text-xl text-gray-600'>
            Here you'll find everything you need to know about our policies and
            how we handle your orders and data. Our goal is to make your
            shopping experience as smooth as possible.
          </p>
        </div>

        <div className='lg:hidden mb-8'>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='w-full flex justify-between items-center px-4 py-3 text-left text-lg font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            <span>{activeLink ? activeLink.name : 'Select a topic'}</span>
            <ChevronDown
              className={`w-6 h-6 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isDropdownOpen && (
            <nav className='mt-2 bg-white shadow-lg rounded-lg p-2'>
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsDropdownOpen(false)}
                  className={`
                    ${location.pathname === link.path ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    block px-4 py-2 text-base font-medium rounded-md
                  `}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className='lg:grid lg:grid-cols-4 lg:gap-8'>
          <aside className='hidden lg:block'>
            <nav className='space-y-1'>
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`
                      group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md
                      ${isActive ? 'text-gray-900' : 'text-gray-600 hover:text-black'}
                    `}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <ChevronRight className='w-5 h-5 text-gray-500' />
                    )}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className='lg:col-span-3 border-l border-gray-300 pl-8'>
            <div className='px-4 py-5 sm:p-6'>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CustomerServiceLayout;
