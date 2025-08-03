import { Link } from 'react-router-dom';
import '../../components.css';

export default function Footer() {
  return (
    <div className="bg-[#EEEEEE] py-12">
      <div className="px-5">
        <div className="footer-card w-full min-h-[327px] h-auto rounded-3xl overflow-hidden relative font-dm-sans">
          <div className="absolute inset-0 flex items-center justify-between px-[171px] 
                          max-md:flex-col max-md:px-5 max-md:py-10 max-md:gap-8 max-md:text-center
                          md:max-lg:px-15 md:max-lg:gap-5
                          lg:gap-20">
            {/* Logo and Copyright */}
            <div className="flex flex-col gap-4 max-md:items-center">
              <img
                src='/images/footerlogo.png'
                alt='Footer Logo'
                className="w-[506px] h-[180px] object-contain
                          max-md:w-[300px] max-md:h-[108px]
                          md:max-lg:w-[380px] md:max-lg:h-[135px]"
              />
              <p className="text-black text-[15px] m-0">
                © 2025. All rights reserved.
              </p>
            </div>

            {/* Links Grid */}
            <div className="flex gap-20 
                           max-md:flex-col max-md:gap-6 max-md:w-full
                           md:max-lg:gap-10">
              {/* Quick Links */}
              <div className="flex flex-col gap-4 max-md:items-center max-md:text-center">
                <h3 className="text-black text-xl font-bold m-0">
                  Quick Links
                </h3>
                <div className="flex flex-col gap-2">
                  <a href='/catalog' className="footer-link text-black no-underline relative inline-block transition-all duration-300 hover:scale-105 text-base font-normal tracking-wide pb-1 overflow-hidden w-fit">
                    Products
                  </a>
                  <a href='/about' className="footer-link text-black no-underline relative inline-block transition-all duration-300 hover:scale-105 text-base font-normal tracking-wide pb-1 overflow-hidden w-fit">
                    About Us
                  </a>
                  <a href='/services' className="footer-link text-black no-underline relative inline-block transition-all duration-300 hover:scale-105 text-base font-normal tracking-wide pb-1 overflow-hidden w-fit">
                    Services
                  </a>
                  <a href='/builder' className="footer-link text-black no-underline relative inline-block transition-all duration-300 hover:scale-105 text-base font-normal tracking-wide pb-1 overflow-hidden w-fit">
                    Custom PC Builder
                  </a>
                </div>
              </div>

              {/* Additional Links */}
              <div className="flex flex-col gap-2 max-md:items-center max-md:text-center">
                <a href='/team' className="footer-link text-black no-underline relative inline-block transition-all duration-300 hover:scale-105 text-base font-normal tracking-wide pb-1 overflow-hidden w-fit">
                  Our Team
                </a>
                <a href='/custom-builds' className="footer-link text-black no-underline relative inline-block transition-all duration-300 hover:scale-105 text-base font-normal tracking-wide pb-1 overflow-hidden w-fit">
                  Custom builds
                </a>
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
