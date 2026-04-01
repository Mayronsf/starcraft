import { Outlet, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function WikiLayout() {
  const { pathname } = useLocation();
  const normalized = pathname.replace(/\/$/, '');
  const isWikiHome = normalized === '/wiki';
  const isFichas = normalized === '/wiki/fichas';

  return (
    <div
      className={
        isFichas
          ? 'min-h-screen bg-gradient-to-b from-deep-black via-[#111112] to-dark-gray text-parchment'
          : 'min-h-screen bg-[#eaecf0] text-[#202122]'
      }
    >
      <header className="sticky top-0 z-30 border-b border-black/10 bg-deep-black text-parchment shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-sm font-body">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-parchment/85 hover:text-ancient-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 opacity-90" aria-hidden />
            Voltar ao site
          </Link>
          {!isWikiHome ? (
            <Link
              to="/wiki"
              className="inline-flex items-center gap-2 text-parchment/85 hover:text-ancient-gold transition-colors"
            >
              <Home className="w-4 h-4 shrink-0 opacity-90" aria-hidden />
              Página principal da Wiki
            </Link>
          ) : (
            <span className="text-parchment/45 text-xs md:text-sm">Navegação estilo MediaWiki</span>
          )}
        </div>
        <p className="text-center font-title text-ancient-gold text-sm md:text-base tracking-wide py-2 border-t border-white/10">
          StarCraft — A Gênese · Wiki
        </p>
      </header>

      <main
        className={
          isFichas
            ? 'w-full px-0 py-0'
            : 'max-w-5xl mx-auto px-3 sm:px-4 py-6 md:py-8'
        }
      >
        <div
          className={
            isFichas
              ? 'border-0 bg-transparent shadow-none'
              : 'wiki-sheet rounded border border-[#a7d7f9] bg-white shadow-[0_1px_3px_rgba(0,0,0,.08)] px-4 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10'
          }
        >
          <Outlet />
        </div>
      </main>

      <footer
        className={`max-w-5xl mx-auto px-4 pb-8 text-center text-xs font-body ${
          isFichas ? 'text-parchment/45' : 'text-[#72777d]'
        }`}
      >
        Conteúdo da wiki é mantido pela equipe do servidor. Estilo inspirado em wikis{' '}
        <a
          href="https://anarkcraft.miraheze.org/wiki/P%C3%A1gina_principal"
          className="text-[#3366cc] hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Anarkcraft
        </a>
        .
      </footer>
    </div>
  );
}
