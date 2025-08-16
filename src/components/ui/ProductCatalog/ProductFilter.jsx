export default function ProductFilter() {
  return (
    <div className="w-full h-fit overflow-y-auto z-10" style={{ fontFamily: 'DM Sans', fontSize: '1.25rem', position: 'sticky', top: '14.5rem', marginLeft: '-28px' }}>
      <div className="space-y-1.5 lg:space-y-2 xl:space-y-2.5">
        {/* Collection Section */}
        <div>
          <h3 className="font-bold text-sm lg:text-base xl:text-lg mb-1.5 lg:mb-2 text-black cursor-default">COLLECTION</h3>
          <div className="space-y-0.5 lg:space-y-1">
            <button className="text-left cursor-pointer text-black text-xs lg:text-sm xl:text-base relative block transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full">
              New Arrival
            </button>
          </div>
        </div>

        {/* Gaming Section */}
        <div>
          <h3 className="font-bold text-sm lg:text-base xl:text-lg mb-1.5 lg:mb-2 text-black cursor-default">GAMING</h3>
          <div className="space-y-0.5 lg:space-y-1">
            <button className="text-left cursor-pointer text-black text-xs lg:text-sm xl:text-base relative block transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full">
              Prebuilts
            </button>
            <button className="text-left cursor-pointer text-black text-xs lg:text-sm xl:text-base relative block transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full">
              Top Custom Builds
            </button>
          </div>
        </div>

        {/* Budget Section */}
        <div>
          <h3 className="font-bold text-sm lg:text-base xl:text-lg mb-1.5 lg:mb-2 text-black cursor-default">BUDGET</h3>
          <div className="space-y-0.5 lg:space-y-1">
            <button className="text-left cursor-pointer text-black text-xs lg:text-sm xl:text-base relative block transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full">
              Prebuilts
            </button>
            <button className="text-left cursor-pointer text-black text-xs lg:text-sm xl:text-base relative block transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 hover:after:w-full">
              Top Custom Builds
            </button>
            
          </div>
        </div>

        {/* Price Range Section */}
        <div>
          <h3 className="font-bold text-sm lg:text-base xl:text-lg text-black mb-1.5 lg:mb-2 cursor-default">PRICE RANGE</h3>
          <div className="space-y-1.5 lg:space-y-2">
            <div>
              <label className="text-black text-xs lg:text-sm mb-1 block">Minimum</label>
              <input 
                type="text" 
                placeholder="999999" 
                className="w-full max-w-[120px] lg:max-w-[140px] xl:max-w-[160px] px-2 lg:px-3 py-1.5 lg:py-2 border border-black rounded-full text-xs lg:text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="text-black text-xs lg:text-sm mb-1 block">Maximum</label>
              <input 
                type="text" 
                placeholder="999999" 
                className="w-full max-w-[120px] lg:max-w-[140px] xl:max-w-[160px] px-2 lg:px-3 py-1.5 lg:py-2 border border-black rounded-full text-xs lg:text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
