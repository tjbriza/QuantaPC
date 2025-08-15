 
import Hero from './components/ui/Home/Hero.jsx';
import HomeContent from './components/ui/Home/HomeContent';
import CompanyLogos from './components/ui/Home/CompanyLogos';
import BentoBox from './components/ui/Home/BentoBox';

function App() {
  return (
    <div className='min-h-screen'>
      <Hero />
      <HomeContent />
      <CompanyLogos />
      <BentoBox />
    </div>
  );
}

export default App;
