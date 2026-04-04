import { Outlet, Link, useLocation } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { ArrowLeft, Home, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGuest } from '../../contexts/GuestContext';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

function profileNick(user: User): string | null {
  const m = user.user_metadata as Record<string, unknown> | undefined;
  if (!m) return null;
  const raw = m.nick ?? m.display_name;
  if (typeof raw !== 'string') return null;
  const s = raw.trim();
  return s.length > 0 ? s : null;
}

export default function WikiLayout() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isGuest, leaveGuest } = useGuest();
  const wikiNick = user ? profileNick(user) : null;
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
          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
            {!isWikiHome ? (
              <Link
                to="/wiki"
                className="inline-flex items-center gap-2 text-parchment/85 hover:text-ancient-gold transition-colors"
              >
                <Home className="w-4 h-4 shrink-0 opacity-90" aria-hidden />
                Página principal da wiki
              </Link>
            ) : (
              <span className="text-parchment/45 text-xs md:text-sm">Navegação estilo MediaWiki</span>
            )}
            {isSupabaseConfigured() && !authLoading && (
              <div className="flex items-center gap-2 border-l border-white/15 pl-4">
                {user ? (
                  <>
                    <div className="flex flex-col items-end max-w-[min(200px,42vw)] sm:max-w-[200px] text-right leading-tight">
                      {wikiNick && (
                        <span className="font-title text-[11px] sm:text-xs tracking-[0.12em] text-ancient-gold truncate w-full">
                          {wikiNick}
                        </span>
                      )}
                      <span
                        className={`truncate w-full text-[10px] sm:text-[11px] ${
                          wikiNick ? 'text-parchment/45 mt-0.5' : 'text-xs text-parchment/55'
                        }`}
                      >
                        {user.email}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => void signOut()}
                      className="inline-flex items-center gap-1.5 rounded border border-stone-gray/45 px-2.5 py-1 text-xs text-parchment/80 hover:border-ancient-gold/45 hover:text-ancient-gold transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 shrink-0 opacity-90" aria-hidden />
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    {isGuest && (
                      <span className="text-xs text-parchment/50 hidden sm:inline">Visitante</span>
                    )}
                    <button
                      type="button"
                      onClick={() => leaveGuest()}
                      className="inline-flex items-center gap-1.5 rounded border border-stone-gray/45 px-2.5 py-1 text-xs text-parchment/80 hover:border-ancient-gold/45 hover:text-ancient-gold transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5 shrink-0 opacity-90" aria-hidden />
                      Fazer login
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
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
