import { useState } from "react";

export default function Carousel() {
  const images = [
    "/images/carousel2.png",
    "/images/carousel1.png",
    "/images/carousel3.png",
  ];

  const [positions, setPositions] = useState(["left", "center", "right"]);

  const update = (newPositions) => {
    setPositions([...newPositions]);
  };

  const next = () => {
    const newPositions = [...positions];
    newPositions.unshift(newPositions.pop()); // rotate right
    update(newPositions);
  };

  const prev = () => {
    const newPositions = [...positions];
    newPositions.push(newPositions.shift()); // rotate left
    update(newPositions);
  };

  const positionClasses = {
    center: "translate-x-0 scale-125 opacity-100 z-30",
    left: "-translate-x-56 scale-90 -rotate-y-12 opacity-60 z-20",
    right: "translate-x-56 scale-90 rotate-y-12 opacity-60 z-20",
    hidden: "opacity-0 pointer-events-none",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-[600px] h-[400px] flex items-center justify-center perspective-[1000px]">
                 {images.map((src, i) => (
           <img
             key={i}
             src={src}
             className={`absolute w-[400px] h-[300px] rounded-2xl object-contain transition-all duration-700 ease-in-out ${positionClasses[positions[i]]}`}
             alt={`slide-${i}`}
           />
         ))}

        {/* Controls */}
        <div className="absolute -bottom-14 flex gap-4">
                     <button
             onClick={prev}
             className="px-4 py-2 rounded-xl bg-[#282E41] text-white hover:bg-[#3A4458] transition"
           >
             Prev
           </button>
           <button
             onClick={next}
             className="px-4 py-2 rounded-xl bg-[#282E41] text-white hover:bg-[#3A4458] transition"
           >
             Next
           </button>
        </div>
      </div>
    </div>
  );
}
