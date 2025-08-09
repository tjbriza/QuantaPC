import { Link } from 'react-router-dom';
import '../../components.css';

export default function BentoBox() {
  return (
    <div className='w-full py-24 px-4 md:px-8 lg:px-16 xl:px-[215px]'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-none w-full'>
        {/* SHOP - Large card on the left */}
        <Link
          to='/catalog'
          className='group rounded-3xl p-10 transition-all duration-300 hover:scale-[1.02] border border-gray-200/50'
          style={{
            height: '46.375rem',
            backgroundColor: '#EEEEEE',
            boxShadow:
              '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className='space-y-6'>
            <div>
              <h2 className='text-[#282E41] text-4xl font-bold mb-4 font-heading'>
                SHOP
              </h2>
              <p className='text-black font-dm-sans text-lg leading-relaxed'>
                Explore our collection of high-performance PCs and handpicked
                components. Build your dream setup with ease.
              </p>
            </div>

            <div className='flex justify-center pt-8'>
              <div className='w-80 h-80 rounded-2xl flex items-center justify-center ml-35'>
                <img
                  src='/images/bento1.png'
                  alt='PC Image'
                  className='w-full h-full object-contain rounded-2xl scale-125 mb-8  '
                />
              </div>
            </div>
          </div>
        </Link>

        {/* Right column with two stacked cards */}
        <div className='flex flex-col h-full'>
          {/* BUILDS - Top right card */}
          <Link
            to='/catalog'
            className='group block rounded-3xl p-10 transition-all duration-300 hover:scale-[1.02] border border-gray-200/50 flex-1'
            style={{
              height: '46.375rem',
              backgroundColor: '#EEEEEE',
              boxShadow:
                '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            }}
          >
            <h2 className='text-[#282E41] text-4xl font-bold mb-4 font-heading'>
              BUILDS
            </h2>
            <p className='text-black font-dm-sans text-lg leading-relaxed'>
              Check out our latest Prebuilt PCs. Get inspiration or request a
              similar setup tailored for gaming, editing, or work. Each build is
              carefully optimized for performance and reliability.
            </p>
          </Link>

          {/* Spacing between cards */}
          <div className='h-8'></div>

          {/* CUSTOM PC BUILDER - Bottom right card */}
          <Link
            to='/catalog'
            className='group block rounded-3xl p-10 transition-all duration-300 hover:scale-[1.02] border border-gray-200/50 flex-1'
            style={{
              height: '46.375rem',
              backgroundColor: '#EEEEEE',
              boxShadow:
                '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            }}
          >
            <h2 className='text-[#282E41] text-4xl font-bold mb-4 font-heading'>
              CUSTOM PC BUILDER
            </h2>
            <p className='text-black font-dm-sans text-lg leading-relaxed'>
              Build your dream rig from the ground up. Choose the perfect
              components for gaming, content creation, or everyday use—tailored
              to your budget and performance needs. Every build is
              custom-crafted.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
