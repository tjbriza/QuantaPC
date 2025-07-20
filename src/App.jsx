import { useState } from 'react';
import Navigation from './components/ui/Navigation';
import Hero from './components/Hero';

function App() {
  const [count, setCount] = useState(0);

  return (
<<<<<<< HEAD
    <div className='min-h-screen bg-black'>
=======
    <div className="min-h-screen bg-black">
      <Navigation />
>>>>>>> d8bda08 (- added navbar design. routing is not yet complete.)
      <Hero />
    </div>
  );
}

export default App;
