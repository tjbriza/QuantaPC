export default function Background({ children }) {
  return (
    <div className="unified-home-background">
      {/* Top glow and fade */}
      <div className="unified-top-accent"></div>
      <div className="unified-hero-boost"></div>
      <div className="unified-fade"></div>

      {/* Blurred circles */}
      <div className="unified-circle blue c1"></div>
      <div className="unified-circle darkblue c2"></div>
      <div className="unified-circle blue c3"></div>
      <div className="unified-circle darkblue c4"></div>
      <div className="unified-circle blue c5"></div>
      <div className="unified-circle darkblue c6"></div>
      <div className="unified-circle blue c7"></div>
      <div className="unified-circle darkblue c8"></div>
      <div className="unified-circle blue c9"></div>
      <div className="unified-circle darkblue c10"></div>
      {/* Mid-field circles to enrich content area */}
      <div className="unified-circle midblue c11"></div>
      <div className="unified-circle darkblue c12"></div>
      <div className="unified-circle midblue c13"></div>
      <div className="unified-circle blue c14"></div>
      <div className="unified-circle darkblue c15"></div>
      {/* Extra top circles for stronger dark presence */}
      <div className="unified-circle darkblue c16"></div>
      <div className="unified-circle darkblue c17"></div>
      <div className="unified-circle midblue c18"></div>
      <div className="unified-circle darkblue c19"></div>
      <div className="unified-circle blue c20"></div>

      
      {/* Content */}
      <div className="unified-content">
        {children}
      </div>
      
      {/* Bottom mirrored glow near Footer */}
      <div className="unified-bottom-accent"></div>
      <div className="unified-footer-boost"></div>
      
    </div>

    
  );
}