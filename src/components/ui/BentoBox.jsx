import { Link } from 'react-router-dom';

export default function BentoBox() {
  return (
    <div
      className='w-full min-h-screen'
      style={{
        backgroundColor: '#EEEEEE',
        backgroundImage: 'url(/images/background1.png)',
        backgroundSize: 'cover',
        backgroundPosition: '50% 35%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className='w-full py-24 px-4 md:px-8 lg:px-16 xl:px-[171px]'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto'>
          {/* SHOP - Large card on the left */}
          <Link
            to='/catalog'
            className='group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200/50'
          >
            <div className='space-y-6'>
              <div>
                <h2 className='text-4xl font-bold mb-4 font-heading' style={{ color: '#282E41' }}>
                  SHOP
                </h2>
                <p className='text-lg leading-relaxed' style={{ color: '#000000', fontFamily: 'DM Sans, sans-serif' }}>
                  Explore our collection of high-performance PCs and handpicked
                  components. Build your dream setup with ease.
                </p>
              </div>

              <div className='flex justify-center pt-8'>
                <div className='w-80 h-80 rounded-2xl flex items-center justify-center ml-35'>
                  <img
                    src='/images/bentoimage.png'
                    alt='Gaming PC Setup'
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
              className='group block bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200/50 flex-1'
            >
              <h2 className='text-4xl font-bold mb-4 font-heading' style={{ color: '#282E41' }}>
                BUILDS
              </h2>
              <p className='text-lg leading-relaxed' style={{ color: '#000000', fontFamily: 'DM Sans, sans-serif' }}>
                Check out our latest Prebuilt PCs. Get inspiration or request a similar
                setup tailored for gaming, editing, or work. Each build is carefully
                optimized for performance and reliability.
              </p>
            </Link>

            {/* Spacing between cards */}
            <div className='h-8'></div>

            {/* CUSTOM PC BUILDER - Bottom right card */}
            <Link
              to='/catalog'
              className='group block bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200/50 flex-1'
            >
              <h2 className='text-4xl font-bold mb-4 font-heading' style={{ color: '#282E41' }}>
                CUSTOM PC BUILDER
              </h2>
              <p className='text-lg leading-relaxed' style={{ color: '#000000', fontFamily: 'DM Sans, sans-serif' }}>
                Build your dream rig from the ground up. Choose the perfect
                components for gaming, content creation, or everyday use—tailored to
                your budget and performance needs. Every build is custom-crafted.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}