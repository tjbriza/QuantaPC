import { useState } from 'react';

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className='relative h-screen overflow-hidden' style={{ backgroundColor: '#EEEEEE', backgroundImage: 'url(/src/assets/images/background.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* Main Content Container */}
      <div className='relative z-10 h-full flex items-center'>
        <div className='max-w-6xl mx-auto px-8 w-full'>
          <div className='flex items-center justify-between h-full'>
            {/* Left Side - Content */}
            <div className='space-y-4 pt-20 w-full max-w-2xl'>
              {/* Main Headline */}
              <div className='flex items-start'>
                <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight antialiased'>
                  LOREM IPSUM DOLOR SIT AMET
                </h1>
              </div>

              {/* Subheadline with emphasized keywords */}
              <div className='flex items-start'>
                <h2 className='text-xl md:text-2xl text-white antialiased'>
                  CONSECTETUR ADIPISCING ELIT.{' '}
                  <span className='text-white font-bold text-xl md:text-2xl antialiased'>
                    LOREM IPSUM
                  </span>
                </h2>
              </div>

              {/* Paragraph */}
              <div className='flex items-start pt-2'>
                <p className='text-black text-base leading-relaxed max-w-lg antialiased'>
                  Lorem ipsum dolor sit amet consectetur adipiscing elit. Nemo
                  sit quam praesentium incidunt dolore, odio quis iure cum
                  soluta voluptatem voluptatem! Laboriosam nihil, a doloresque
                  est repellendus ab aut maxime?
                </p>
              </div>

              {/* CTA Button */}
              <div className='pt-4'>
                <button
                  className='group text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl antialiased'
                  style={{
                    backgroundColor: '#282E41',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#3A4458';
                    setIsHovered(true);
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#282E41';
                    setIsHovered(false);
                  }}
                >
                  <span className='flex items-center space-x-2'>
                    <span>Explore now</span>
                    <svg
                      className='w-5 h-5 group-hover:translate-x-1 transition-transform duration-300'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 8l4 4m0 0l-4 4m4-4H3'
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {/* Right Side - Carousel Placeholder */}
            <div className='flex justify-center items-center pt-20'>
              <div className='text-white text-xl'>Carousel Here</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
