import { useState } from 'react';
import Background from './Background';
export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Background>
      {/* Main Content Container */}
      <div className='w-full px-4 md:px-8 lg:px-16 xl:px-[171px]'>
        <div className='flex flex-col lg:flex-row items-center justify-between h-full'>
          {/* Left Side - Content */}
          <div className='space-y-4 pt-8 md:pt-12 lg:pt-20 w-full max-w-2xl mx-auto lg:mx-0 text-center lg:text-left'>
            {/* Main Headline */}
            <div className='flex items-start justify-center lg:justify-start'>
              <h1 className='font-bold leading-tight antialiased font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl' style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
                <span className='text-[#282E41]'>Choose </span>
                <span className='text-white'>your best</span>
                <br />
                <span className='text-[#282E41]'>Builds</span>
              </h1>
            </div>

            {/* Subheadline with emphasized keywords */}
            <div className='flex items-start justify-center lg:justify-start'>
              <h2 className='text-[#282E41] antialiased font-bold font-heading text-lg md:text-xl lg:text-2xl xl:text-3xl' style={{ fontSize: 'clamp(1.125rem, 3vw, 2.375rem)' }}>
                Where technology meets convenience
              </h2>
            </div>

            {/* Paragraph */}
            <div className='flex items-start justify-center lg:justify-start pt-2'>
              <p className='text-black text-base md:text-lg lg:text-xl leading-relaxed max-w-lg antialiased'>
                Looking for power, style, and performance in one setup?
                Customize your perfect PC with top-grade parts — whether for
                gaming, content creation, or everyday tasks.
              </p>
            </div>

            {/* CTA Button */}
            <div className='pt-4 flex justify-center lg:justify-start'>
              <button
                className='group text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl antialiased'
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
                <span className='font-dm-sans text-center w-full text-sm md:text-base'>
                  Explore now
                </span>
              </button>
            </div>
          </div>

          {/* Right Side - Carousel Placeholder */}
          <div className='flex justify-center items-center pt-8 lg:pt-20 w-full lg:w-auto'>
            <div className='text-white text-lg md:text-xl'>Carousel Here</div>
          </div>
        </div>
      </div>
    </Background>
  );
}
