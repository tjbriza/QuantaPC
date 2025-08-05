import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import '../../components.css';

export default function Navigation() {
  const { session, signOut } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic classes based on scroll position and page
  const textColor = isHomePage 
    ? (isScrolled ? 'text-black/90 hover:text-black' : 'text-white/90 hover:text-white')
    : 'text-black/90 hover:text-black';
  const iconColor = isHomePage
    ? (isScrolled ? 'text-black/80 hover:text-black' : 'text-white/80 hover:text-white')
    : 'text-black/80 hover:text-black';
  const hoverBg = isHomePage
    ? (isScrolled ? 'hover:bg-black/10' : 'hover:bg-white/10')
    : 'hover:bg-black/10';

  return (
    <div className='fixed top-0 left-0 right-0 z-50 p-2 md:p-4'>
      <nav className='nav-container mx-auto bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20 max-w-screen-xl'>
        <div className='flex items-center justify-between px-4 md:px-8 py-3 md:py-4'>
          {/* Left Navigation - Hidden on mobile */}
          <div className='hidden lg:flex items-center space-x-6 xl:space-x-8'>
            <Link
              to='/catalog'
              className={`nav-link ${textColor} text-sm font-medium tracking-wide`}
            >
              SHOP
              <span className='nav-underline'></span>
            </Link>
            <Link
              to='/catalog'
              className={`nav-link ${textColor} text-sm font-medium tracking-wide`}
            >
              BUILDS
              <span className='nav-underline'></span>
            </Link>
            <Link
              to='/about'
              className={`nav-link ${textColor} text-sm font-medium tracking-wide`}
            >
              ABOUT
              <span className='nav-underline'></span>
            </Link>
          </div>

          {/* Center Brand */}
          <Link
            to='/'
            className={`flex items-center p-2 rounded-lg transition-all duration-300 ${hoverBg} hover:scale-105 relative order-1 lg:order-2`}
          >
            {isHomePage ? (
              <>
                {/* White logo - visible when not scrolled on home page */}
                <img
                  src='/images/logo.png'
                  alt='Quanta PC'
                  className={`h-6 md:h-8 w-auto absolute transition-opacity duration-500 ease-in-out ${
                    isScrolled ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                {/* Black logo - visible when scrolled on home page */}
                <img
                  src='/images/logoblack.png'
                  alt='Quanta PC'
                  className={`h-6 md:h-8 w-auto transition-opacity duration-500 ease-in-out ${
                    isScrolled ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </>
            ) : (
              /* Black logo - always visible on other pages */
              <img
                src='/images/logoblack.png'
                alt='Quanta PC'
                className='h-6 md:h-8 w-auto'
              />
            )}
          </Link>

          {/* Right Icons */}
          <div className='flex items-center space-x-3 md:space-x-6 order-2 lg:order-3'>
            {/* Search */}
            <button
              className={`${iconColor} p-1.5 md:p-2 rounded-lg transition-all duration-300 ${hoverBg} hover:scale-105`}
            >
              <svg
                className='w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 hover:scale-110'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <circle cx='11' cy='11' r='8' />
                <path d='m21 21-4.35-4.35' />
              </svg>
            </button>

            {/* Delivery - Hidden on mobile */}
            <button
              className={`${iconColor} p-1.5 md:p-2 rounded-lg transition-all duration-300 ${hoverBg} hover:scale-105 hidden md:block`}
            >
              <svg
                className='w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 hover:scale-110'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <rect x='1' y='3' width='15' height='13' />
                <polygon points='16,8 20,8 23,11 23,16 16,16' />
                <circle cx='5.5' cy='18.5' r='2.5' />
                <circle cx='18.5' cy='18.5' r='2.5' />
              </svg>
            </button>

            {/* Cart */}
            <Link
              to='/cart'
              className={`${iconColor} p-1.5 md:p-2 rounded-lg transition-all duration-300 relative ${hoverBg} hover:scale-105`}
            >
              <svg
                className='w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 hover:scale-110'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z' />
                <line x1='3' y1='6' x2='21' y2='6' />
                <path d='m16 10a4 4 0 01-8 0' />
              </svg>
            </Link>

            {/* User Profile */}
            {session ? (
              <div className='flex items-center space-x-2 md:space-x-4'>
                <Link
                  to='/dashboard'
                  className={`${iconColor} p-1.5 md:p-2 rounded-lg transition-all duration-300 ${hoverBg} hover:scale-105`}
                >
                  <svg
                    className='w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 hover:scale-110'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2' />
                    <circle cx='12' cy='7' r='4' />
                  </svg>
                </Link>
                <button
                  onClick={signOut}
                  className={`${iconColor} text-xs px-2 md:px-3 py-1 rounded-md transition-all duration-300 ${hoverBg} hover:scale-105 hidden sm:block`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to='/login'
                className={`${iconColor} p-1.5 md:p-2 rounded-lg transition-all duration-300 ${hoverBg} hover:scale-105`}
              >
                <svg
                  className='w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 hover:scale-110'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2' />
                  <circle cx='12' cy='7' r='4' />
                </svg>
              </Link>
            )}

            {/* Mobile Menu Button - Visible only on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${iconColor} p-1.5 rounded-lg transition-all duration-300 ${hoverBg} hover:scale-105 lg:hidden`}
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Dropdown */}
        {isMobileMenuOpen && (
          <div className='lg:hidden mt-4 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20'>
            <div className='flex flex-col space-y-4'>
              <Link
                to='/catalog'
                onClick={() => setIsMobileMenuOpen(false)}
                className={`nav-link ${textColor} text-sm font-medium tracking-wide py-2`}
              >
                SHOP
                <span className='nav-underline'></span>
              </Link>
              <Link
                to='/catalog'
                onClick={() => setIsMobileMenuOpen(false)}
                className={`nav-link ${textColor} text-sm font-medium tracking-wide py-2`}
              >
                BUILDS
                <span className='nav-underline'></span>
              </Link>
              <Link
                to='/about'
                onClick={() => setIsMobileMenuOpen(false)}
                className={`nav-link ${textColor} text-sm font-medium tracking-wide py-2`}
              >
                ABOUT
                <span className='nav-underline'></span>
              </Link>
              {session && (
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${textColor} text-sm font-medium tracking-wide transition-all duration-300 py-2 text-left`}
                >
                  LOGOUT
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
