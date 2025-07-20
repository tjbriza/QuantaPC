import { useState, useEffect } from 'react';

import background1 from '../assets/images/background1.png';
import background2 from '../assets/images/background2.jpg';
import background3 from '../assets/images/background3.png';
import carousel1 from '../assets/images/carousel1.png';
import carousel2 from '../assets/images/carousel2.png';

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: 1,
      background: background1,
      carousel: carousel1,
      title: "LOREM IPSUM DOLOR SIT AMET",
      subtitle: "CONSECTETUR ADIPISCING ELIT.",
      highlight: "LOREM IPSUM",
      description: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Nemo sit quam praesentium incidunt dolore, odio quis iure cum soluta voluptatem voluptatem! Laboriosam nihil, a doloresque est repellendus ab aut maxime?",
      ctaColor: "#272E41",
      ctaHoverColor: "#3A4458"
    },
    {
      id: 2,
      background: background2,
      carousel: carousel2,
      title: "LOREM IPSUM DOLOR SIT AMET",
      subtitle: "SED DO EIUSMOD TEMPOR.",
      highlight: "DOLOR SIT",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      ctaColor: "#728FA8",
      ctaHoverColor: "#8BA5BE"
    },
    {
      id: 3,
      background: background3,
      carousel: carousel1, // Using carousel1 as placeholder
      title: "LOREM IPSUM DOLOR SIT AMET",
      subtitle: "EXCEPTEUR SINT OCCAECAT.",
      highlight: "CUPIDATAT NON",
      description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      ctaColor: "#766E6C",
      ctaHoverColor: "#8A7F7D"
    }
  ];

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[activeSlide];

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Dynamic Background without blur effect */}
      <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.background})` }}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            {/* Pure black gradient from middle to bottom - modified to preserve original colors */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" 
                 style={{ background: 'linear-gradient(to top, rgb(0,0,0) 0%, rgb(0,0,0) 15%, rgba(0,0,0,0.9) 25%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.3) 45%, transparent 60%)' }} />
          </div>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
            
            {/* Left Side - Content */}
            <div className="space-y-6 pt-32">
              {/* Main Headline */}
              <div className="h-32 flex items-start">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight antialiased">
                  {currentSlide.title}
                </h1>
              </div>
              
              {/* Subheadline with emphasized keywords */}
              <div className="h-20 flex items-start">
                <h2 className="text-2xl md:text-3xl text-white antialiased">
                  {currentSlide.subtitle}{' '}
                  <span className="text-white font-bold text-3xl md:text-4xl antialiased">{currentSlide.highlight}</span>
                </h2>
              </div>
              
              {/* Paragraph */}
              <div className="h-24 flex items-start">
                <p className="text-white/70 text-lg leading-relaxed max-w-lg antialiased">
                  {currentSlide.description}
                </p>
              </div>
              
              {/* CTA Button */}
              <div className="pt-4">
                <button 
                  className="group text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl antialiased"
                  style={{ 
                    backgroundColor: currentSlide.ctaColor,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = currentSlide.ctaHoverColor}
                  onMouseLeave={(e) => e.target.style.backgroundColor = currentSlide.ctaColor}
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

            {/* Right Side - Placeholder */}
            <div className="flex justify-center items-center pt-32">
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
