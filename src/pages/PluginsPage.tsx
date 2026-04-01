import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Particles from '../components/Particles';
import ServerPluginsSection from '../components/ServerPluginsSection';

export default function PluginsPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mobileQuery.matches);
    update();
    mobileQuery.addEventListener('change', update);
    return () => mobileQuery.removeEventListener('change', update);
  }, []);

  return (
    <div className="relative min-h-screen bg-deep-black overflow-x-hidden">
      <Particles color="#c9a84c" count={isMobile ? 18 : 40} type="embers" />

      <header className="relative z-20 border-b border-ancient-gold/15 bg-deep-black/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-body text-sm text-parchment/80 hover:text-ancient-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
            Voltar ao início
          </Link>
          <span className="font-title text-ancient-gold/90 text-sm md:text-base tracking-wide">
            StarCraft — A Gênese
          </span>
        </div>
      </header>

      <main className="relative z-10">
        <ServerPluginsSection variant="page" />
      </main>
    </div>
  );
}
