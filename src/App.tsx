import { useEffect, useState } from 'react';
import Particles from './components/Particles';
import HeroSection from './components/HeroSection';
import GenesisSection from './components/GenesisSection';
import TheFirstSection from './components/TheFirstSection';
import TheWorldSection from './components/TheWorldSection';
import DimensionsSection from './components/DimensionsSection';
import FourPathsSection from './components/FourPathsSection';
import ProphecySection from './components/ProphecySection';
import ServerPluginsSection from './components/ServerPluginsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import RulesModal from './components/RulesModal';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [enableParallax, setEnableParallax] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setEnableParallax(mq.matches && !prefersReducedMotion);
      setIsMobile(mobileQuery.matches);
    };
    update();
    mq.addEventListener('change', update);
    mobileQuery.addEventListener('change', update);
    return () => {
      mq.removeEventListener('change', update);
      mobileQuery.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (!enableParallax) return;

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableParallax]);

  return (
    <div className="relative bg-deep-black overflow-x-hidden">
      <Particles color="#c9a84c" count={isMobile ? 18 : 40} type="embers" />

      <div style={enableParallax ? { transform: `translateY(${scrollY * 0.5}px)` } : undefined}>
        <HeroSection />
      </div>

      <GenesisSection />
      <TheFirstSection />
      <TheWorldSection />
      <DimensionsSection />
      <FourPathsSection />
      <ProphecySection />
      <ServerPluginsSection />
      <CTASection />
      <Footer onOpenRules={() => setRulesOpen(true)} />
      <RulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}

export default App;
