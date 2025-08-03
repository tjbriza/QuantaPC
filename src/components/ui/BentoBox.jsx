import { Link } from 'react-router-dom';

export default function BentoBox() {
  return (
    <div
      className='w-full min-h-screen'
      style={{
        backgroundColor: '#EEEEEE',
        backgroundImage: 'url(/images/background1.png)',
        backgroundSize: 'cover',
        backgroundPosition: '50% 75%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className='w-full py-24 px-4 md:px-8 lg:px-16 xl:px-[171px]'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto'>
          {/* SHOP - Large card on the left */}
          <Link
            to='/catalog'
            className='group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200/50'
          >
            <div className='space-y-6'>
              <div>
                <h2 className='text-4xl font-bold text-gray-800 mb-4 font-heading'>
                  SHOP
                </h2>
                <p className='text-gray-600 text-lg leading-relaxed'>
                  Explore our collection of high-performance PCs and handpicked
                  components. Build your dream setup with ease.
                </p>
              </div>
              
              <div className='flex justify-center pt-8'>
                <div className='w-80 h-80 bg-gray-300 rounded-2xl flex items-center justify-center'>
                  <img
                    src='https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=400'
                    alt='Gaming PC Setup'
                    className='w-full h-full object-cover rounded-2xl'
                  />
                </div>
              </div>
            </div>
          </Link>

          {/* Right column with two stacked cards */}
          <div className='space-y-8'>
            {/* BUILDS - Top right card */}
            <Link
              to='/catalog'
              className='group block bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200/50'
            >
              <h2 className='text-4xl font-bold text-gray-800 mb-4 font-heading'>
                BUILDS
              </h2>
              <p className='text-gray-600 text-lg leading-relaxed'>
                Check out our latest Prebuilt PCs. Get inspiration or request a similar
                setup tailored for gaming, editing, or work.
              </p>
            </Link>

            {/* CUSTOM PC BUILDER - Bottom right card */}
            <Link
              to='/catalog'
              className='group block bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200/50'
            >
              <h2 className='text-4xl font-bold text-gray-800 mb-4 font-heading'>
                CUSTOM PC BUILDER
              </h2>
              <p className='text-gray-600 text-lg leading-relaxed'>
                Build your dream rig from the ground up. Choose the perfect
                components for gaming, content creation, or everyday use—tailored to
                your budget and performance needs.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}