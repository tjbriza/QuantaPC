export default function ProductFilter() {
  return (
    <div
      className="w-full h-fit overflow-y-auto z-10"
      style={{
        fontFamily: "DM Sans",
        fontSize: "1.25rem",
        position: "sticky",
        top: "14.5rem",
        marginLeft: "-28px",
      }}
    >
      <div className="space-y-1.5 lg:space-y-2 xl:space-y-2.5">
        {/* Collection Section */}
        <div>
          <h3 className="font-bold text-[1.5rem] mb-1.5 lg:mb-2 text-black cursor-default">
            COLLECTION
          </h3>
          <div className="space-y-0.5 lg:space-y-1">
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input type="checkbox" className="w-5 h-5 accent-blue-500" />
              <span className="text-black text-[1.25rem] relative block transition-all duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 group-hover:after:w-full">
                New Arrival
              </span>
            </label>
          </div>
        </div>

        {/* Gaming Section */}
        <div>
          <h3 className="font-bold text-[1.5rem] mb-1.5 lg:mb-2 text-black cursor-default">
            GAMING
          </h3>
          <div className="space-y-0.5 lg:space-y-1">
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input type="checkbox" className="w-5 h-5 accent-blue-500" />
              <span className="text-black text-[1.25rem] relative block transition-all duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 group-hover:after:w-full">
                Prebuilts
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input type="checkbox" className="w-5 h-5 accent-blue-500" />
              <span className="text-black text-[1.25rem] relative block transition-all duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 group-hover:after:w-full">
                Top Custom Builds
              </span>
            </label>
          </div>
        </div>

        {/* Budget Section */}
        <div>
          <h3 className="font-bold text-[1.5rem] mb-1.5 lg:mb-2 text-black cursor-default">
            BUDGET
          </h3>
          <div className="space-y-0.5 lg:space-y-1">
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input type="checkbox" className="w-5 h-5 accent-blue-500" />
              <span className="text-black text-[1.25rem] relative block transition-all duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 group-hover:after:w-full">
                Prebuilts
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input type="checkbox" className="w-5 h-5 accent-blue-500" />
              <span className="text-black text-[1.25rem] relative block transition-all duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 group-hover:after:w-full">
                Top Custom Builds
              </span>
            </label>
          </div>
        </div>

        {/* Price Range Section */}
        <div>
          <h3 className="font-bold text-[1.5rem] text-black mb-1.5 lg:mb-2 cursor-default">
            PRICE RANGE
          </h3>
          <div className="space-y-1.5 lg:space-y-2">
            <div>
              <label className="text-black text-[1.25rem] mb-1 block">
                Minimum
              </label>
              <input
                type="text"
                placeholder="999999"
                className="w-full max-w-[160px] px-3 py-2 border border-black rounded-full text-[1.25rem] focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="text-black text-[1.25rem] mb-1 block">
                Maximum
              </label>
              <input
                type="text"
                placeholder="999999"
                className="w-full max-w-[160px] px-3 py-2 border border-black rounded-full text-[1.25rem] focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
