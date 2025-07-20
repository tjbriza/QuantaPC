import { useState } from 'react';
import Navigation from './components/ui/Navigation';
import Hero from './components/Hero';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className='min-h-screen bg-black'>
      <Navigation />
      <Hero />
    </div>
  );
}

export default App;
