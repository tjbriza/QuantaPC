export default function ProductFilter() {
  return (
    <div className="absolute left-45 top-28 w-64 h-full p-6 overflow-y-auto z-10" style={{ fontFamily: 'DM Sans', fontSize: '1rem' }}>
      <div className="space-y-2">
        {/* Collection Section */}
        <div>
          <h3 className="font-bold text-lg mb-2 text-black cursor-default">COLLECTION</h3>
          <div className="space-y-1">
            <button className="text-left cursor-pointer hover:text-blue-600 transition-colors block text-black">
              New Arrival
            </button>
          </div>
        </div>

        {/* Gaming Section */}
        <div>
          <h3 className="font-bold text-lg mb-2 text-black cursor-default">GAMING</h3>
          <div className="space-y-1">
            <button className="text-left cursor-pointer hover:text-blue-600 transition-colors block text-black">
              Prebuilds
            </button>
            <button className="text-left cursor-pointer hover:text-blue-600 transition-colors block text-black">
              Top Custom Builds
            </button>
          </div>
        </div>

        {/* Office Section */}
        <div>
          <h3 className="font-bold text-lg mb-2 text-black cursor-default">OFFICE</h3>
          <div className="space-y-1">
            <button className="text-left cursor-pointer hover:text-blue-600 transition-colors block text-black">
              Prebuilds
            </button>
            <button className="text-left cursor-pointer hover:text-blue-600 transition-colors block text-black">
              Top Custom Builds
            </button>
          </div>
        </div>

        {/* Price Range Section */}
        <div>
          <h3 className="font-bold text-lg text-black mb-2 cursor-default">PRICE RANGE</h3>
          <div className="space-y-2">
            <div>
              <label className="text-black text-sm mb-1 block">Minimum</label>
              <input 
                type="text" 
                placeholder="999999" 
                className="w-32 px-3 py-2 border border-black rounded-full text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="text-black text-sm mb-1 block">Maximum</label>
              <input 
                type="text" 
                placeholder="999999" 
                className="w-32 px-3 py-2 border border-black rounded-full text-sm focus:outline-none focus:border-black"
              />
            </div>
            {/* Price Range Slider */}
            <div className="pt-2">
              <input 
                type="range" 
                min="0" 
                max="100000" 
                className="w-32 range-slider cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
