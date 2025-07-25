import { useState } from 'react';
import Navigation from './components/ui/Navigation';
import Hero from './components/Hero';
import Content from './components/Content';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className='min-h-screen bg-black'>
      <Navigation />
      <Hero />
      <Content />
    </div>
  );
}

export default App;
