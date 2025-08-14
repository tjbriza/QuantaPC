export default function Background({ children }) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Radial Gradient Backgrounds: separate layers to allow blending */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Top gradient */}
  <div className="absolute inset-0 bg-radial-top" />
        {/* Bottom gradient */}
  <div className="absolute inset-0 bg-radial-bottom" />
      </div>

      {/* Blurred circles*/}
      <div className="bg-circles-layer">
        <div className="bg-circle bg-circle-1" />
        <div className="bg-circle bg-circle-2" />
        <div className="bg-circle bg-circle-3" />
        <div className="bg-circle bg-circle-4" />
        <div className="bg-circle bg-circle-5" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}