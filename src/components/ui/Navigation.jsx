import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import ProfileWindow from "./ProfileWindow";
import "../../components.css";

export default function Navigation() {
  const { session } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileWindowOpen, setIsProfileWindowOpen] = useState(false);

  const profileButtonRef = useRef(null);
  const profileWindowRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile window when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileWindowRef.current &&
        !profileWindowRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setIsProfileWindowOpen(false);
      }
    };

    if (isProfileWindowOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileWindowOpen]);

  // Check if we're on homepage
  const isHomepage = location.pathname === "/";

  // Dynamic classes based on scroll position and page
  const textColor =
    isHomepage && !isScrolled
      ? "text-white/90 hover:text-white"
      : "text-black/90 hover:text-black";
  const iconColor =
    isHomepage && !isScrolled
      ? "text-white/80 hover:text-white"
      : "text-black/80 hover:text-black";

  const handleProfileClick = () => {
    setIsProfileWindowOpen(!isProfileWindowOpen);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-2 md:p-4">
      <nav className="relative mx-auto bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20 max-w-[90rem] shadow-[0_0_25px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
          {/* Left Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link
              to="/catalog"
              className={`${textColor} text-sm font-medium tracking-wide relative inline-block transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full`}
            >
              PRODUCTS
            </Link>
            <Link
              to="/catalog"
              className={`${textColor} text-sm font-medium tracking-wide relative inline-block transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full`}
            >
              RENT
            </Link>
            <Link
              to="/catalog"
              className={`${textColor} text-sm font-medium tracking-wide relative inline-block transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full`}
            >
              SERVICES
            </Link>
            <Link
              to="/about"
              className={`${textColor} text-sm font-medium tracking-wide relative inline-block transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full`}
            >
              ABOUT
            </Link>
          </div>

          {/* Center Brand - Absolutely Centered */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link
              to="/"
              className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 hover:scale-105`}
            >
              <div className="relative flex items-center justify-center">
                {/* White logo */}
                <img
                  src="/images/logo.png"
                  alt="Quanta PC"
                  className={`h-6 md:h-8 w-auto transition-opacity duration-500 ease-in-out ${
                    isHomepage && !isScrolled ? "opacity-100" : "opacity-0"
                  }`}
                />
                {/* Black logo */}
                <img
                  src="/images/logoblack.png"
                  alt="Quanta PC"
                  className={`h-6 md:h-8 w-auto absolute top-0 left-0 transition-opacity duration-500 ease-in-out ${
                    isHomepage && !isScrolled ? "opacity-0" : "opacity-100"
                  }`}
                />
              </div>
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-3 md:space-x-6">
            {/* Search */}
            <button
              className={`${iconColor} p-1.5 md:p-2 rounded-lg transition-all duration-300 hover:scale-105`}
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className={`${iconColor} p-1.5 md:p-2 rounded-lg transition-all duration-300 relative hover:scale-105`}
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="m16 10a4 4 0 01-8 0" />
              </svg>
            </Link>

            {/* User Profile */}
            {session ? (
              <button
                ref={profileButtonRef}
                onClick={handleProfileClick}
                className={`${iconColor} p-1.5 md:p-2 rounded-lg transition-all duration-300 hover:scale-105`}
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            ) : (
              <Link
                to="/login"
                className={`${iconColor} p-1.5 md:p-2 rounded-lg transition-all duration-300 hover:scale-105`}
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${iconColor} p-1.5 rounded-lg transition-all duration-300 hover:scale-105 lg:hidden`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
            <div className="flex flex-col space-y-4">
              <Link
                to="/catalog"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${textColor} text-sm font-medium tracking-wide py-2 relative inline-block transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full`}
              >
                SHOP
              </Link>
              <Link
                to="/catalog"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${textColor} text-sm font-medium tracking-wide py-2 relative inline-block transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full`}
              >
                BUILDS
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${textColor} text-sm font-medium tracking-wide py-2 relative inline-block transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full`}
              >
                ABOUT
              </Link>
              {session && (
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${textColor} text-sm font-medium tracking-wide py-2 relative inline-block transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full`}
                >
                  DASHBOARD
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Profile Window */}
        {isProfileWindowOpen && (
          <div
            ref={profileWindowRef}
            className="absolute right-4 top-full mt-2 z-50"
          >
            <ProfileWindow
              isOpen={isProfileWindowOpen}
              onClose={() => setIsProfileWindowOpen(false)}
            />
          </div>
        )}
      </nav>
    </div>
  );
}
