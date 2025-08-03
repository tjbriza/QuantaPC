import '../../components.css';

export default function CompanyLogos() {

    {/*Images on marquee*/}
  const logos = [
    { src: '/images/feature1.png', alt: 'AMD', h: 'h-16 sm:h-20 lg:h-24' },
    { src: '/images/feature2.png', alt: 'Acer', h: 'h-14 sm:h-16 lg:h-20' },
    { src: '/images/feature3.png', alt: 'Intel', h: 'h-14 sm:h-16 lg:h-20' },
    { src: '/images/feature4.png', alt: 'NVIDIA', h: 'h-16 sm:h-20 lg:h-24' },
    { src: '/images/feature5.png', alt: 'HP', h: 'h-14 sm:h-16 lg:h-20' },
  ];

  return (
    <div className="bg-[#EEEEEE] py-8 sm:py-12 lg:py-16 px-4">
      <p className="text-center text-black mb-6 sm:mb-8 lg:mb-12 text-sm sm:text-base lg:text-lg font-semibold uppercase tracking-wider font-heading">
        FEATURING THESE COMPANIES
      </p>

      <div className="flex justify-center">
        <div className="relative overflow-hidden w-full max-w-3xl sm:max-w-4xl lg:max-w-6xl">
          <div className="flex w-max animate-marquee will-change-transform">
            {[...logos, ...logos].map((logo, i) => (
              <img
                key={i}
                src={logo.src}
                alt={logo.alt}
                className={`${logo.h} mx-6 sm:mx-8 lg:mx-12 object-contain grayscale hover:grayscale-0 transition-all duration-300 rounded`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
