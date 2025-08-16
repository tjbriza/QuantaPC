import { useState, useEffect } from "react";

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
    newPositions.unshift(newPositions.pop());
    update(newPositions);
  };

  const prev = () => {
    const newPositions = [...positions];
    newPositions.push(newPositions.shift());
    update(newPositions);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 3000);

    return () => clearInterval(interval); 
  }, [positions]);

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
      </div>
    </div>
  );
}
