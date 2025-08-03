import { useState } from 'react';
import Navigation from './components/ui/Navigation';
import Hero from './components/ui/Hero.jsx';
import HomeContent from './components/ui/HomeContent';
import CompanyLogos from './components/ui/CompanyLogos';
import BentoBox from './components/ui/BentoBox';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className='min-h-screen bg-black'>
      <Hero />
      <HomeContent />
      <CompanyLogos />
      <BentoBox />
    </div>
  );
}

export default App;
