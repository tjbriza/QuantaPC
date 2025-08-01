export default function Content() {
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
        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-16 mb-32'>
          {/* Custom PC Builder Section */}
          <div className='p-8 flex flex-col items-center'>
            <div className='mb-8 w-full max-w-sm mx-auto'>
              <img
                src='/images/content1.png'
                alt='Custom PC Builder'
                className='w-full h-auto object-cover rounded-lg'
              />
            </div>
            <div className='w-full'>
              <h2 className='text-3xl font-bold text-black mb-6 border-b-2 border-black pb-3 text-center font-heading'>
                CUSTOM PC BUILDER
              </h2>
            </div>
            <div className='w-full'>
              <p className='text-black leading-relaxed text-center text-lg'>
                Get your dream rig built exactly how you want it. We offer
                tailored PC building services using top-tier components for
                gaming, editing, or everyday use.{' '}
              </p>
            </div>
          </div>

          {/* Personal Computers Section */}
          <div className='p-8 flex flex-col items-center'>
            <div className='mb-8 w-full max-w-lg'>
              <img
                src='/images/content2.png'
                alt='Personal Computers'
                className='w-full h-auto object-cover rounded-lg'
              />
            </div>
            <div className='w-full'>
              <h2 className='text-3xl font-bold text-black mb-6 border-b-2 border-black pb-3 text-center font-heading'>
                PERSONAL COMPUTERS
              </h2>
            </div>
            <div className='w-full'>
              <p className='text-black leading-relaxed text-center text-lg'>
                Explore our line of high-performance PCs for work, play, or
                both. Whether you need speed, power, or sleek design — we've got
                you covered.{' '}
              </p>
            </div>
          </div>

          {/* Talk To An Expert Section */}
          <div className='p-8 flex flex-col items-center'>
            <div className='mb-8 w-full'>
              <p className='text-black leading-relaxed mb-8 text-center text-lg'>
                We're here to help every step of the way. From inquiries to
                after-sales support, our dedicated team ensures a smooth and
                satisfying experience.{' '}
              </p>
            </div>
            <div className='w-full'>
              <h2 className='text-3xl font-bold text-black mb-6 border-t-2 border-black pt-3 text-center font-heading'>
                CUSTOMER SERVICE
              </h2>
            </div>
            <div className='mt-8 w-full max-w-sm mx-auto'>
              <img
                src='/images/content3.png'
                alt='Talk to an Expert'
                className='w-full h-auto object-cover rounded-lg'
              />
            </div>
          </div>
        </div>

        {/* Company Logos Section */}
        <div className='p-4'>
          <p className='text-center text-black mb-6 text-lg font-semibold uppercase tracking-wider font-heading'>
            FEATURING THESE COMPANIES
          </p>
          <div className='flex justify-center items-center space-x-12 flex-wrap gap-y-6'>
            <img
              src='/images/feature1.png'
              alt='AMD'
              className='h-24 object-contain grayscale hover:grayscale-0 transition-all duration-300 rounded'
            />
            <img
              src='/images/feature2.png'
              alt='Acer'
              className='h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300 rounded'
            />
            <img
              src='/images/feature3.png'
              alt='Intel'
              className='h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300 rounded'
            />
            <img
              src='/images/feature4.png'
              alt='NVIDIA'
              className='h-24 object-contain grayscale hover:grayscale-0 transition-all duration-300 rounded'
            />
            <img
              src='/images/feature5.png'
              alt='HP'
              className='h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300 rounded'
            />
          </div>
        </div>
      </div>
    </div>
  );
}