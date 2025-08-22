// src/components/ui/Toast/Toast.jsx
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ id, message, type, duration, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getToastStyles = () => {
    const baseStyles =
      'flex items-center p-4 rounded-lg shadow-lg border-l-4 min-w-80 max-w-96 transition-all duration-300 transform';
    const visibilityStyles =
      isVisible && !isExiting
        ? 'translate-x-0 opacity-100'
        : 'translate-x-full opacity-0';

    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-400 text-green-800 ${visibilityStyles}`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-400 text-red-800 ${visibilityStyles}`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-400 text-yellow-800 ${visibilityStyles}`;
      default:
        return `${baseStyles} bg-blue-50 border-blue-400 text-blue-800 ${visibilityStyles}`;
    }
  };

  const getIcon = () => {
    const iconProps = { className: 'w-5 h-5 mr-3 flex-shrink-0' };

    switch (type) {
      case 'success':
        return (
          <CheckCircle
            {...iconProps}
            className='w-5 h-5 mr-3 flex-shrink-0 text-green-600'
          />
        );
      case 'error':
        return (
          <XCircle
            {...iconProps}
            className='w-5 h-5 mr-3 flex-shrink-0 text-red-600'
          />
        );
      case 'warning':
        return (
          <AlertTriangle
            {...iconProps}
            className='w-5 h-5 mr-3 flex-shrink-0 text-yellow-600'
          />
        );
      default:
        return (
          <Info
            {...iconProps}
            className='w-5 h-5 mr-3 flex-shrink-0 text-blue-600'
          />
        );
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      default:
        return 'Info';
    }
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <div className='flex-1'>
        <div className='font-semibold text-sm'>{getTitle()}</div>
        <div className='text-sm opacity-90'>{message}</div>
      </div>
      <button
        onClick={handleClose}
        className='ml-3 text-gray-400 hover:text-gray-600 transition-colors'
      >
        <X className='w-4 h-4' />
      </button>
    </div>
  );
};

export default Toast;
