 
import Hero from './components/ui/Hero.jsx';
import HomeContent from './components/ui/HomeContent';
import CompanyLogos from './components/ui/CompanyLogos';
import BentoBox from './components/ui/BentoBox';
import Background from './components/ui/Background';
import Footer from './components/ui/Footer';

function App() {
  return (
    <Background>
      <div className='min-h-screen'>
        <Hero />
        <HomeContent />
        <CompanyLogos />
        <BentoBox />
        <Footer />
      </div>
    </Background>
  );
}

export default App;
