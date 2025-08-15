export default function ProductFilter() {
  return (
    <div className="sticky top-58 w-full h-fit p-4 lg:p-5 xl:p-6 ml-4 lg:ml-6 xl:ml-20 overflow-y-auto z-10" style={{ fontFamily: 'DM Sans', fontSize: '1rem' }}>
      <div className="space-y-1.5 lg:space-y-2 xl:space-y-2.5">
        {/* Collection Section */}
        <div>
          <h3 className="font-bold text-sm lg:text-base xl:text-lg mb-1.5 lg:mb-2 text-black cursor-default">COLLECTION</h3>
          <div className="space-y-0.5 lg:space-y-1">
            <button className="text-left cursor-pointer hover:text-blue-600 transition-colors block text-black text-xs lg:text-sm xl:text-base">
              New Arrival
            </button>
          </div>
        </div>

        {/* Gaming Section */}
        <div>
          <h3 className="font-bold text-sm lg:text-base xl:text-lg mb-1.5 lg:mb-2 text-black cursor-default">GAMING</h3>
          <div className="space-y-0.5 lg:space-y-1">
            <button className="text-left cursor-pointer hover:text-blue-600 transition-colors block text-black text-xs lg:text-sm xl:text-base">
              Prebuilts
            </button>
            <button className="text-left cursor-pointer hover:text-blue-600 transition-colors block text-black text-xs lg:text-sm xl:text-base">
              Top Custom Builds
            </button>
          </div>
        </div>

        {/* Budget Section */}
        <div>
          <h3 className="font-bold text-sm lg:text-base xl:text-lg mb-1.5 lg:mb-2 text-black cursor-default">BUDGET</h3>
          <div className="space-y-0.5 lg:space-y-1">
            <button className="text-left cursor-pointer hover:text-blue-600 transition-colors block text-black text-xs lg:text-sm xl:text-base">
              Prebuilts
            </button>
            <button className="text-left cursor-pointer hover:text-blue-600 transition-colors block text-black text-xs lg:text-sm xl:text-base">
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
            {/* Price Range Slider */}
            <div className="pt-1.5 lg:pt-2">
              <input 
                type="range" 
                min="0" 
                max="100000" 
                className="w-full max-w-[120px] lg:max-w-[140px] xl:max-w-[160px] range-slider cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
