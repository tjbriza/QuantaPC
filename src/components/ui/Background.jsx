import { useState } from 'react';

export default function background({ children }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className='relative h-screen overflow-hidden'
      style={{
        backgroundColor: '#EEEEEE',
        backgroundImage: 'url(/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Main Content Container */}
      <div className='relative z-10 h-full flex items-center'>{children}</div>
    </div>
  );
}
