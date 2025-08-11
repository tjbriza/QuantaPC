 
import Hero from './components/ui/Home/Hero.jsx';
import HomeContent from './components/ui/Home/HomeContent';
import CompanyLogos from './components/ui/Home/CompanyLogos';
import BentoBox from './components/ui/Home/BentoBox';
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
