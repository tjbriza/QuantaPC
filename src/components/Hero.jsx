import { useState } from 'react';

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative h-screen overflow-hidden bg-gray-900">
      {/* Modern Blurred Circles Background */}
      <div className={`absolute inset-0 ${isHovered ? 'animation-paused' : ''}`}>
        {/* Large circle - top left - floating pattern */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-500/50 to-purple-600/40 rounded-full blur-3xl circle-animation" 
             style={{ animation: 'float 8s ease-in-out infinite' }}></div>
        
        {/* Medium circle - top right - orbital pattern */}
        <div className="absolute -top-16 -right-24 w-80 h-80 bg-gradient-to-bl from-cyan-400/45 to-blue-500/35 rounded-full blur-3xl circle-animation" 
             style={{ animation: 'orbit 15s linear infinite' }}></div>
        
        {/* Large circle - bottom right - wave pattern */}
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-tl from-purple-500/40 to-pink-500/30 rounded-full blur-3xl circle-animation" 
             style={{ animation: 'wave 12s ease-in-out infinite' }}></div>
        
        {/* Medium circle - bottom left - sway pattern */}
        <div className="absolute -bottom-20 -left-28 w-72 h-72 bg-gradient-to-tr from-indigo-500/45 to-cyan-400/35 rounded-full blur-3xl circle-animation" 
             style={{ animation: 'sway 10s ease-in-out infinite' }}></div>
        
        {/* Small accent circles - drift pattern */}
        <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-gradient-to-r from-emerald-400/40 to-teal-500/30 rounded-full blur-2xl circle-animation" 
             style={{ animation: 'drift 18s linear infinite' }}></div>
        
        {/* Floating circle - orbital pattern (delayed) */}
        <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-gradient-to-l from-violet-400/50 to-purple-500/35 rounded-full blur-2xl circle-animation" 
             style={{ animation: 'orbit 20s linear infinite', animationDelay: '5s' }}></div>
        
        {/* Small floating circles - wave pattern (delayed) */}
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-rose-400/45 to-pink-500/30 rounded-full blur-xl circle-animation" 
             style={{ animation: 'wave 14s ease-in-out infinite', animationDelay: '3s' }}></div>
        
        {/* Tiny accent circle - float pattern (delayed) */}
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-bl from-amber-400/40 to-orange-500/25 rounded-full blur-xl circle-animation" 
             style={{ animation: 'float 16s ease-in-out infinite', animationDelay: '7s' }}></div>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-6xl mx-auto px-8 w-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Left Side - Content */}
            <div className="space-y-6 pt-20 w-full max-w-3xl">
              {/* Main Headline */}
              <div className="h-32 flex items-start">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight antialiased">
                  LOREM IPSUM DOLOR SIT AMET
                </h1>
              </div>
              
              {/* Subheadline with emphasized keywords */}
              <div className="h-20 flex items-start">
                <h2 className="text-2xl md:text-3xl text-white antialiased">
                  CONSECTETUR ADIPISCING ELIT.{' '}
                  <span className="text-white font-bold text-3xl md:text-4xl antialiased">LOREM IPSUM</span>
                </h2>
              </div>
              
              {/* Paragraph */}
              <div className="h-24 flex items-start">
                <p className="text-white/70 text-lg leading-relaxed max-w-lg antialiased">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit. Nemo sit quam praesentium incidunt dolore, odio quis iure cum soluta voluptatem voluptatem! Laboriosam nihil, a doloresque est repellendus ab aut maxime?
                </p>
              </div>
              
              {/* CTA Button */}
              <div className="pt-4">
                <button 
                  className="group text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl antialiased"
                  style={{ 
                    backgroundColor: "#272E41",
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#3A4458";
                    setIsHovered(true);
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#272E41";
                    setIsHovered(false);
                  }}
                >
                  <span className="flex items-center space-x-2">
                    <span>Explore now</span>
                    <svg 
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {/* Right Side - Carousel Placeholder */}
            <div className="flex justify-center items-center pt-20">
              <div className="text-white text-xl">
                Carousel Here
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
