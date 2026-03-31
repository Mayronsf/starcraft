import { useEffect, useState } from 'react';
import Particles from './components/Particles';
import HeroSection from './components/HeroSection';
import GenesisSection from './components/GenesisSection';
import TheFirstSection from './components/TheFirstSection';
import TheWorldSection from './components/TheWorldSection';
import DimensionsSection from './components/DimensionsSection';
import FourPathsSection from './components/FourPathsSection';
import ProphecySection from './components/ProphecySection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import RulesModal from './components/RulesModal';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [rulesOpen, setRulesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative bg-deep-black overflow-x-hidden">
      <Particles color="#c9a84c" count={40} type="embers" />

      <div style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
        <HeroSection />
      </div>

      <GenesisSection />
      <TheFirstSection />
      <TheWorldSection />
      <DimensionsSection />
      <FourPathsSection />
      <ProphecySection />
      <CTASection />
      <Footer onOpenRules={() => setRulesOpen(true)} />
      <RulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}

export default App;
