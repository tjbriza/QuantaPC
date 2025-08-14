import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
    },
  });

  return (
    <motion.section
      initial="hidden"
      animate="show"
      className="relative h-screen overflow-hidden flex items-center"
    >
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-[171px]">
        <div className="flex flex-col lg:flex-row items-center justify-between h-full w-full">
        
        {/* Left Side - Content */}
        <div className="space-y-4 w-full lg:w-1/2 max-w-2xl mx-auto lg:mx-0 lg:ml-11 text-center lg:text-left">
          
          {/* Main Headline */}
          <motion.div variants={fadeUp(0.05)} className="flex items-start justify-center lg:justify-start">
            <h1 className="hero-main-title font-bold leading-tight antialiased font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              <span className="text-[#282E41]">Choose </span>
              <span className="text-white">your best</span>
              <br />
              <span className="text-[#282E41]">Builds</span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.div variants={fadeUp(0.15)} className="flex items-start justify-center lg:justify-start">
            <h2 className="hero-subtitle text-[#282E41] antialiased font-bold font-heading text-lg md:text-xl lg:text-2xl xl:text-3xl">
              Where technology meets convenience
            </h2>
          </motion.div>

          {/* Paragraph */}
          <motion.div variants={fadeUp(0.3)} className="flex items-start justify-center lg:justify-start pt-2">
            <p className="text-black text-base md:text-lg lg:text-xl leading-relaxed max-w-lg antialiased">
              Looking for power, style, and performance in one setup?
              Customize your perfect PC with top-grade parts — whether for
              gaming, content creation, or everyday tasks.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={fadeUp(0.45)} className="pt-4 flex justify-center lg:justify-start">
            <Link to="/catalog">
              <button className="bg-[#282E41] hover:bg-[#3A4458] hover:scale-105 transition-all duration-300 group text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold shadow-lg hover:shadow-xl antialiased">
                <span className="font-dm-sans text-center w-full text-sm md:text-base">
                  Explore now
                </span>
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Right Side - Carousel Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="flex justify-center items-start w-full lg:w-1/2"
        >
          <motion.div
            className="border-2 border-white/30 rounded-lg w-80 md:w-96 lg:w-[500px] xl:w-[550px] h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px] flex items-center justify-center"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="text-white text-lg md:text-xl">Carousel Here</div>
          </motion.div>
        </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
