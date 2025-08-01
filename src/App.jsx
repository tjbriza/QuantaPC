import { useState } from 'react';
import Navigation from './components/ui/Navigation';
import Hero from './components/ui/Hero.jsx';
import HomeContent from './components/ui/HomeContent';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className='min-h-screen bg-black'>
      <Hero />
      <HomeContent />
    </div>
  );
}

export default App;
