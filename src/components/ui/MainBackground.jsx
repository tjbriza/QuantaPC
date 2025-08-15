export default function MainBackground({ children }) {
  return (
    <div className="w-full relative overflow-hidden" style={{ minHeight: '100vh', backgroundColor: '#EEEEEE' }}>
      {/* Linear Gradient Backgrounds: subtle blue lines over light gray base */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Top gradient - subtle blue line from top */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(103, 152, 205, 0.3) 0%, rgba(103, 152, 205, 0.1) 30%, transparent 60%)'
        }} />
        {/* Bottom gradient - very subtle blue line from bottom */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(103, 152, 205, 0.2) 0%, rgba(103, 152, 205, 0.05) 40%, transparent 70%)'
        }} />
      </div>

      {/* Foreground content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
