import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navigation() {
  const { session, signOut } = useAuth();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <nav className="max-w-6xl mx-auto bg-white/10 rounded-2xl">
        <div className="flex items-center justify-between px-8 py-4">
          
          {/* Left Navigation */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/shop"
              className="text-white/90 hover:text-white text-sm font-medium tracking-wide transition-all duration-300 relative group hover:scale-105"
            >
              SHOP
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link 
              to="/builds"
              className="text-white/90 hover:text-white text-sm font-medium tracking-wide transition-all duration-300 relative group hover:scale-105"
            >
              BUILDS
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link 
              to="/about"
              className="text-white/90 hover:text-white text-sm font-medium tracking-wide transition-all duration-300 relative group hover:scale-105"
            >
              ABOUT
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
          </div>

          {/* Center Brand */}
          <Link 
            to="/" 
            className="flex items-center p-2 rounded-lg transition-all duration-300 hover:bg-white/10"
          >
            <img 
              src="/images/logo.png" 
              alt="Quanta PC" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            
            {/* Search */}
            <button className="text-white/80 hover:text-white p-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-105">
              <svg className="w-5 h-5 transition-transform duration-300 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Delivery */}
            <button className="text-white/80 hover:text-white p-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-105">
              <svg className="w-5 h-5 transition-transform duration-300 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="1" y="3" width="15" height="13"/>
                <polygon points="16,8 20,8 23,11 23,16 16,16"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </button>

            {/* Cart */}
            <button className="text-white/80 hover:text-white p-2 rounded-lg transition-all duration-300 relative hover:bg-white/10 hover:scale-105">
              <svg className="w-5 h-5 transition-transform duration-300 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="m16 10a4 4 0 01-8 0"/>
              </svg>
            </button>

            {/* User Profile */}
            {session ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard"
                  className="text-white/80 hover:text-white p-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-105"
                >
                  <svg className="w-5 h-5 transition-transform duration-300 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </Link>
                <button 
                  onClick={signOut}
                  className="text-white/80 hover:text-white text-xs px-3 py-1 rounded-md transition-all duration-300 hover:bg-white/10 hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="text-white/80 hover:text-white p-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-105"
              >
                <svg className="w-5 h-5 transition-transform duration-300 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
