import { Link } from 'react-router-dom';
import { MonitorCog, Store, PcCase, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import '../../../components.css';

export default function BentoBox() {
  return (
    <div className='w-full py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-16 xl:px-[215px]'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 max-w-none w-full'>
        {/* SHOP - Large card on the left */}
        <Link
          to='/catalog'
          className='group rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 transition-all duration-300 hover:scale-[1.02] border border-gray-200/50'
          style={{
            height: 'auto',
            minHeight: '20rem',
            backgroundColor: '#EEEEEE',
            boxShadow:
              '0 0 25px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          }}
        >
          <motion.div
            className='flex flex-col h-full relative'
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className='flex flex-col items-start mb-4'>
              <div className='bg-[#282E41] p-3 rounded-lg mb-4'>
                <Store size={38} className='text-white' />
              </div>
              <h2 className='text-[#282E41] text-[2.375rem] font-bold font-heading leading-tight mb-4'>
                SHOP
              </h2>
              <p className='text-black font-dm-sans text-[1.25rem] leading-relaxed max-w-[70%] mb-6'>
                Explore our collection of high-<br />
                performance PCs, and handpicked<br />
                components. Build your dream<br />
                setup with ease.
              </p>
            </div>

            {/* Fixed positioned image on the right - hidden on mobile */}
            <div className='hidden lg:block absolute -top-8 right-0 -mr-10.5 w-[25rem] h-[44rem] overflow-hidden'>
              <img
                src='/images/bento1.png'
                alt='PC Image'
                className='w-full h-full object-contain rounded-2xl'
              />
            </div>

            {/* Feature list at bottom left - constrained width to avoid image overlap */}
            <div className='mt-auto max-w-full lg:max-w-[70%]'>
              <ul className='space-y-3'>
                <li className='flex items-center gap-3'>
                  <Check size={20} className='text-[#282E41] flex-shrink-0' />
                  <span className='text-black font-dm-sans text-[1.25rem]'>100% Affordable</span>
                </li>
                <li className='flex items-center gap-3'>
                  <Check size={20} className='text-[#282E41] flex-shrink-0' />
                  <span className='text-black font-dm-sans text-[1.25rem]'>Built with Premium Parts</span>
                </li>
                <li className='flex items-center gap-3'>
                  <Check size={20} className='text-[#282E41] flex-shrink-0' />
                  <span className='text-black font-dm-sans text-[1.25rem]'>Ready for Gaming, Work, or Creation</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </Link>

        {/* Right column with two stacked cards */}
        <div className='flex flex-col h-full'>
          {/* SERVICES - Top right card */}
          <Link
            to='/services'
            className='group block rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 transition-all duration-300 hover:scale-[1.02] border border-gray-200/50 flex-1'
            style={{
              height: 'auto',
              minHeight: '20rem',
              backgroundColor: '#EEEEEE',
              boxShadow:
                '0 0 25px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            }}
          >
            <motion.div
              className='relative h-full'
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className='flex flex-col items-start mb-4 relative z-10 max-w-full lg:max-w-[60%]'>
                <div className='bg-[#282E41] p-3 rounded-lg mb-4'>
                  <PcCase size={38} className='text-white' />
                </div>
                <h2 className='text-[#282E41] text-[2.375rem] font-bold font-heading leading-tight mb-4'>
                  SERVICES
                </h2>
                <p className='text-black font-dm-sans text-[1.25rem] leading-relaxed'>
                  Check out our trusted PC services expert consultations,
                  upgrades, and repairs to keep your
                  system running <br/>at its best.
                </p>
              </div>

              {/* Fixed positioned image on the right */}
              <div className='absolute -top-8 -right-10 -mr-8 w-80 h-80 hidden lg:block'>
                <img
                  src='/images/bento2.png'
                  alt='Build PC Image'
                  className='w-full h-full object-contain'
                />
              </div>
            </motion.div>
          </Link>

          {/* Spacing between cards */}
          <div className='h-4 md:h-6 lg:h-8'></div>

          {/* CUSTOM PC BUILDER - Bottom right card */}
          <Link
            to='/custom-pc'
            className='group block rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 transition-all duration-300 hover:scale-[1.02] border border-gray-200/50 flex-1'
            style={{
              height: 'auto',
              minHeight: '20rem',
              backgroundColor: '#EEEEEE',
              boxShadow:
                '0 0 25px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            }}
          >
            <motion.div
              className='relative h-full'
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className='flex flex-col items-start mb-4 max-w-full lg:max-w-[60%]'>
                <div className='bg-[#282E41] p-3 rounded-lg mb-4'>
                  <MonitorCog size={38} className='text-white' />
                </div>
                <h2 className='text-[#282E41] text-[2.375rem] font-bold font-heading leading-tight mb-4'>
                  CUSTOM PC BUILDER
                </h2>
                <p className='text-black font-dm-sans text-[1.25rem] leading-relaxed'>
                  Build your dream rig from the ground up.
                  Choose the perfect components<br />
                  for gaming, content creation, or<br />
                  everyday use.
                </p>
              </div>

              {/* bento3.png image on the right */}
              <div className='absolute top-0 -right-6 w-64 h-64 hidden lg:block'>
                <img
                  src='/images/bento3.png'
                  alt='Custom PC Builder'
                  className='w-full h-full object-contain'
                />
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
