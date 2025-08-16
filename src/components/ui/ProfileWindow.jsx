import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  House, 
  Wallet, 
  MapPin, 
  Truck, 
  Settings, 
  LogOut 
} from 'lucide-react';

export default function ProfileWindow({ isOpen, onClose }) {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: profileData } = useSupabaseRead('profiles', {
    filter: { id: session?.user.id },
    single: true,
  });
  const [showLogoutNotification, setShowLogoutNotification] = useState(false);

  if (!isOpen || !session) return null;

  const handleLogout = () => {
    setShowLogoutNotification(true);
    setTimeout(() => {
      signOut();
      onClose();
      setShowLogoutNotification(false);
      navigate('/login');
    }, 1000);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const user = session.user;
  const firstName =
    profileData?.name_first ||
    user.user_metadata?.first_name ||
    user.email?.split('@')[0] ||
    'User';
  const lastName = profileData?.name_last || user.user_metadata?.last_name || '';
  const email = user.email || '';
  const profilePicture =
    profileData?.avatar_url ||
    user.user_metadata?.avatar_url ||
    `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=0ea5e9&color=fff`;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ 
              duration: 0.2, 
              ease: "easeOut" 
            }}
            className="bg-[#EEEEEE] rounded-b-lg shadow-lg min-w-[240px] p-0 overflow-hidden border-t-[4px] border-[#282E41]"
            onClick={handleModalClick}
          >
      {/* User Profile Section */}
      <div className="p-3 border-b border-gray-300 bg-white">
        <div className="flex items-center space-x-2">
          <img
            src={profilePicture}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
          />
          <div className="flex-1">
            <div className="font-semibold text-black text-[1.25rem] font-['DM_Sans']">
              {firstName} {lastName}
            </div>
            <div className="text-gray-600 text-[1rem] font-['DM_Sans'] truncate">
              {email}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="py-1 bg-[#EEEEEE]">
        <Link
          to="/dashboard"
          onClick={onClose}
          className="flex items-center px-3 py-2 hover:bg-gray-200 transition-colors duration-200 text-black"
        >
          <House className="w-5 h-5 mr-2" />
          <span className="text-[1.1rem] font-['DM_Sans']">Dashboard</span>
        </Link>

        <Link
          to="/dashboard/orders"
          onClick={onClose}
          className="flex items-center px-3 py-2 hover:bg-gray-200 transition-colors duration-200 text-black"
        >
          <Wallet className="w-5 h-5 mr-2" />
          <span className="text-[1.1rem] font-['DM_Sans']">My Orders</span>
        </Link>

        <Link
          to="/dashboard/addresses"
          onClick={onClose}
          className="flex items-center px-3 py-2 hover:bg-gray-200 transition-colors duration-200 text-black"
        >
          <MapPin className="w-5 h-5 mr-2" />
          <span className="text-[1.1rem] font-['DM_Sans']">My Addresses</span>
        </Link>

        <Link
          to="/dashboard/orders"
          onClick={onClose}
          className="flex items-center px-3 py-2 hover:bg-gray-200 transition-colors duration-200 text-black"
        >
          <Truck className="w-5 h-5 mr-2" />
          <span className="text-[1.1rem] font-['DM_Sans']">Track Order</span>
        </Link>

        <button
          className="flex items-center w-full px-3 py-2 hover:bg-gray-200 transition-colors duration-200 text-black"
          disabled
        >
          <Settings className="w-5 h-5 mr-2" />
          <span className="text-[1.1rem] font-['DM_Sans']">Profile Settings</span>
        </button>

        <div className="border-t border-gray-300 mt-1 pt-1">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 hover:bg-gray-200 transition-colors duration-200 text-red-600"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span className="text-[1.1rem] font-['DM_Sans']">Logout</span>
          </button>
        </div>
      </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Notification */}
      <AnimatePresence>
        {showLogoutNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] bg-[#EEEEEE] text-black px-4 py-2 rounded-lg shadow-lg font-['DM_Sans'] text-sm border border-gray-300"
          >
            Logged out successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
