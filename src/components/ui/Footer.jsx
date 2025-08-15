import { Link } from 'react-router-dom';
import '../../components.css';

export default function Footer() {
  return (
    <div className="py-12 relative hidden md:block">
      <div className="px-2 md:px-4 relative z-10">
        <div className="mx-auto max-w-[90rem] min-h-[327px] rounded-2xl overflow-hidden relative font-dm-sans bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_0_25px_rgba(0,0,0,0.3)] flex items-center">
          <div className="flex items-center justify-between w-full px-8 lg:px-16 py-10 lg:py-12
                          max-md:flex-col max-md:px-5 max-md:py-8 max-md:gap-8 max-md:text-center
                          md:max-lg:px-10 md:max-lg:gap-10
                          gap-12 lg:gap-20">
            {/* Logo and Copyright */}
            <div className="flex flex-col gap-4 max-md:items-center">
              <img
                src='/images/footerlogo.png'
                alt='Footer Logo'
                className="w-[420px] h-[150px] object-contain
                          max-md:w-[280px] max-md:h-[100px]
                          md:max-lg:w-[360px] md:max-lg:h-[130px]"
              />
              <p className="text-black text-[15px] m-0">
                © 2025. All rights reserved.
              </p>
            </div>

            {/* Links Grid */}
            <div className="flex gap-12 lg:gap-20 
                           max-md:flex-col max-md:gap-6 max-md:w-full
                           md:max-lg:gap-10">
              {/* Quick Links */}
              <div className="flex flex-col gap-4 max-md:items-center max-md:text-center">
                <h3 className="text-black text-xl font-bold m-0">
                  Quick Links
                </h3>
              <div className="flex flex-col gap-2">
                  <a href='/catalog' className="text-black no-underline relative inline-block transition-all duration-300 hover:scale-105 text-base font-normal tracking-wide pb-1 overflow-hidden w-fit after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full">
                    Products
                  </a>
                  <a href='/about' className="text-black no-underline relative inline-block transition-all duration-300 hover:scale-105 text-base font-normal tracking-wide pb-1 overflow-hidden w-fit after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full">
                    About Us
                  </a>
                  <a href='/services' className="text-black no-underline relative inline-block transition-all duration-300 hover:scale-105 text-base font-normal tracking-wide pb-1 overflow-hidden w-fit after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full">
                    Services
                  </a>
                  <a href='/builder' className="text-black no-underline relative inline-block transition-all duration-300 hover:scale-105 text-base font-normal tracking-wide pb-1 overflow-hidden w-fit after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full">
                    Custom PC Builder
                  </a>
                </div>
              </div>

              {/* Additional Links */}
              <div className="flex flex-col gap-4 max-md:items-center max-md:text-center">
                {/* Invisible spacer to align with Products */}
                <div className="text-xl font-bold opacity-0 pointer-events-none">
                  Spacer
                </div>
                <div className="flex flex-col gap-2">
                  <a href='/team' className="text-black no-underline relative inline-block transition-all duration-300 hover:scale-105 text-base font-normal tracking-wide pb-1 overflow-hidden w-fit after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full">
                    Our Team
                  </a>
                  <a href='/custom-builds' className="text-black no-underline relative inline-block transition-all duration-300 hover:scale-105 text-base font-normal tracking-wide pb-1 overflow-hidden w-fit after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full">
                    Custom builds
                  </a>
                </div>
              </div>

              {/* Sign Up */}
            <div className="flex flex-col gap-4 max-md:items-center max-md:text-center">
                <h3 className="text-black text-xl font-semibold m-0">
                  Remain Updated
                </h3>
                <Link
                  to='/signup'
                  className="bg-[#282E41] hover:bg-gray-800 hover:scale-105 text-white px-6 py-2 rounded-full font-bold text-xl transition-all duration-300 no-underline inline-block text-center"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
