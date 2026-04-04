import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGuest } from '../contexts/GuestContext';
import { isSupabaseConfigured } from '../lib/supabaseClient';

const SIGNUP_TOAST_MS = 10_000;

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') === 'cadastro' ? 'cadastro' : 'entrar';
  const recuperar = searchParams.get('recuperar') === '1';
  const navigate = useNavigate();
  const { signIn, signUp, sendPasswordResetEmail, user, loading: authLoading } = useAuth();
  const { enterAsGuest } = useGuest();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nick, setNick] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [signupToast, setSignupToast] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/', { replace: true });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!signupToast) return;
    const t = window.setTimeout(() => setSignupToast(null), SIGNUP_TOAST_MS);
    return () => window.clearTimeout(t);
  }, [signupToast]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSignupToast(null);
    const em = email.trim();
    if (!em || !password) {
      setError('Preencha o e-mail e a senha.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (tab === 'cadastro') {
      if (password !== passwordConfirm) {
        setError('As senhas não coincidem.');
        return;
      }
      const nk = nick.trim();
      if (!nk) {
        setError('Informe o nick do personagem.');
        return;
      }
    }

    setBusy(true);
    try {
      if (tab === 'entrar') {
        const { error: err } = await signIn(em, password);
        if (err) {
          setError(err.message);
          return;
        }
        navigate('/', { replace: true });
      } else {
        const nk = nick.trim();
        const { error: err, sessionCreated } = await signUp(em, password, { nick: nk });
        if (err) {
          setError(err.message);
          return;
        }
        setPassword('');
        setPasswordConfirm('');
        setNick('');
        if (sessionCreated) {
          navigate('/', { replace: true });
          return;
        }
        setSignupToast(
          'Sua conta foi criada. Enviamos um link de confirmação para o seu e-mail — abra-o para ativar a conta e poder acessar o site.',
        );
      }
    } finally {
      setBusy(false);
    }
  };

  const handleEnviarRecuperacao = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const em = email.trim();
    if (!em) {
      setError('Informe seu e-mail.');
      return;
    }

    setBusy(true);
    try {
      const { error: err } = await sendPasswordResetEmail(em);
      if (err) {
        setError(err.message);
        return;
      }
      setInfo(
        'Se existir uma conta com este e-mail, você recebeu um link para redefinir a senha. Verifique a caixa de entrada e o spam.',
      );
    } finally {
      setBusy(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-deep-black via-[#111112] to-dark-gray flex items-center justify-center text-parchment/50 text-sm font-body">
        Carregando…
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-deep-black via-[#111112] to-dark-gray flex items-center justify-center text-parchment/50 text-sm font-body">
        Redirecionando…
      </div>
    );
  }

  if (recuperar) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-deep-black via-[#111112] to-dark-gray text-parchment flex flex-col">
        <header className="border-b border-white/10 px-4 py-8 text-center">
          <p className="font-title text-ancient-gold tracking-[0.2em] text-base md:text-lg">StarCraft — A Gênese</p>
          <p className="mt-2 font-body text-xs text-parchment/50 max-w-sm mx-auto">
            Recuperar senha
          </p>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-lg border border-ancient-gold/50 bg-deep-black/90 p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <button
              type="button"
              onClick={() => setSearchParams({ tab: 'entrar' })}
              className="mb-4 font-body text-xs text-parchment/55 hover:text-ancient-gold transition-colors"
            >
              ← Voltar ao login
            </button>
            <h1 className="font-title text-center text-lg tracking-[0.2em] text-ancient-gold mb-2">
              REDEFINIR SENHA
            </h1>
            <p className="text-center font-body text-xs text-parchment/50 mb-6">
              Enviaremos um link seguro para o seu e-mail (via Supabase, sem custo extra neste projeto).
            </p>

            {!isSupabaseConfigured() && (
              <p className="mb-4 rounded border border-blood-red/40 bg-blood-red/10 px-3 py-2 font-body text-xs text-blood-red/90">
                Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para usar a recuperação.
              </p>
            )}

            <form onSubmit={(e) => void handleEnviarRecuperacao(e)} className="space-y-4">
              <label className="block">
                <span className="font-body text-[10px] uppercase tracking-[0.15em] text-parchment/45">
                  E-mail da conta
                </span>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  className="mt-1.5 w-full rounded border border-stone-gray/35 bg-deep-black px-3 py-2 font-body text-sm text-parchment focus:border-ancient-gold/55 focus:outline-none"
                  placeholder="voce@email.com"
                />
              </label>

              {error && (
                <p className="font-body text-xs text-blood-red/90" role="alert">
                  {error}
                </p>
              )}
              {info && (
                <p className="font-body text-xs text-parchment/80" role="status">
                  {info}
                </p>
              )}

              <button
                type="submit"
                disabled={busy || !isSupabaseConfigured()}
                className="w-full rounded py-3 font-title text-xs tracking-[0.2em] text-deep-black bg-[#4a4428] hover:bg-[#5c5434] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy ? 'ENVIANDO…' : 'ENVIAR LINK POR E-MAIL'}
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-deep-black via-[#111112] to-dark-gray text-parchment flex flex-col relative">
      <AnimatePresence>
        {signupToast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-4 left-1/2 z-[200] w-[min(92vw,400px)] -translate-x-1/2"
          >
            <div className="flex items-start gap-3 rounded-lg border border-ancient-gold/55 bg-deep-black/95 px-4 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-md">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22, delay: 0.06 }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-600/45 bg-emerald-950/50"
              >
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.22, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-flex"
                >
                  <Check className="h-5 w-5 text-emerald-400" strokeWidth={2.5} aria-hidden />
                </motion.span>
              </motion.span>
              <div className="min-w-0 pt-0.5">
                <p className="font-title text-xs tracking-[0.12em] text-ancient-gold mb-1">CONTA CRIADA</p>
                <p className="font-body text-sm text-parchment/90 leading-snug">{signupToast}</p>
              </div>
              <button
                type="button"
                onClick={() => setSignupToast(null)}
                className="shrink-0 font-body text-xs text-parchment/45 hover:text-parchment/80"
                aria-label="Fechar aviso"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="border-b border-white/10 px-4 py-8 text-center">
        <p className="font-title text-ancient-gold tracking-[0.2em] text-base md:text-lg">StarCraft — A Gênese</p>
        <p className="mt-2 font-body text-xs text-parchment/50 max-w-sm mx-auto">
          Faça login, crie uma conta ou entre como visitante para acessar o site.
        </p>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-lg border border-ancient-gold/50 bg-deep-black/90 p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <h1 className="font-title text-center text-xl tracking-[0.2em] text-ancient-gold mb-2">
            CONTA
          </h1>
          <p className="text-center font-body text-xs text-parchment/50 mb-6">
            Com login você navega pelo site e gerencia suas fichas na wiki. Visitantes podem ver tudo, exceto criar personagens.
          </p>

          <div className="flex rounded-md border border-stone-gray/40 p-0.5 mb-6">
            <Link
              to="/entrar?tab=entrar"
              className={`flex-1 text-center py-2 text-xs font-body tracking-wide rounded ${
                tab === 'entrar'
                  ? 'bg-ancient-gold/20 text-ancient-gold border border-ancient-gold/40'
                  : 'text-parchment/60 hover:text-parchment/90'
              }`}
            >
              Entrar
            </Link>
            <Link
              to="/entrar?tab=cadastro"
              className={`flex-1 text-center py-2 text-xs font-body tracking-wide rounded ${
                tab === 'cadastro'
                  ? 'bg-ancient-gold/20 text-ancient-gold border border-ancient-gold/40'
                  : 'text-parchment/60 hover:text-parchment/90'
              }`}
            >
              Criar conta
            </Link>
          </div>

          {!isSupabaseConfigured() && (
            <p className="mb-4 rounded border border-blood-red/40 bg-blood-red/10 px-3 py-2 font-body text-xs text-blood-red/90">
              Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para usar o login.
            </p>
          )}

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <label className="block">
              <span className="font-body text-[10px] uppercase tracking-[0.15em] text-parchment/45">
                Email
              </span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                className="mt-1.5 w-full rounded border border-stone-gray/35 bg-deep-black px-3 py-2 font-body text-sm text-parchment focus:border-ancient-gold/55 focus:outline-none"
                placeholder="voce@email.com"
              />
            </label>
            <label className="block">
              <span className="font-body text-[10px] uppercase tracking-[0.15em] text-parchment/45">
                Senha
              </span>
              <input
                type="password"
                autoComplete={tab === 'entrar' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                className="mt-1.5 w-full rounded border border-stone-gray/35 bg-deep-black px-3 py-2 font-body text-sm text-parchment focus:border-ancient-gold/55 focus:outline-none"
                placeholder="••••••••"
              />
            </label>

            {tab === 'cadastro' && (
              <>
                <label className="block">
                  <span className="font-body text-[10px] uppercase tracking-[0.15em] text-parchment/45">
                    Confirmar senha
                  </span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={passwordConfirm}
                    onChange={(ev) => setPasswordConfirm(ev.target.value)}
                    className="mt-1.5 w-full rounded border border-stone-gray/35 bg-deep-black px-3 py-2 font-body text-sm text-parchment focus:border-ancient-gold/55 focus:outline-none"
                    placeholder="••••••••"
                  />
                </label>
                <label className="block">
                  <span className="font-body text-[10px] uppercase tracking-[0.15em] text-parchment/45">
                    Nick do personagem
                  </span>
                  <input
                    type="text"
                    autoComplete="nickname"
                    value={nick}
                    onChange={(ev) => setNick(ev.target.value)}
                    className="mt-1.5 w-full rounded border border-stone-gray/35 bg-deep-black px-3 py-2 font-body text-sm text-parchment focus:border-ancient-gold/55 focus:outline-none"
                    placeholder="Como você é chamado no jogo"
                    maxLength={40}
                  />
                  <span className="mt-1 block font-body text-[11px] text-parchment/35">
                    Fica salvo no seu perfil; você pode usar o mesmo nome nas fichas da wiki.
                  </span>
                </label>
              </>
            )}

            {tab === 'entrar' && (
              <div className="text-right -mt-1">
                <button
                  type="button"
                  onClick={() => setSearchParams({ tab: 'entrar', recuperar: '1' })}
                  className="font-body text-xs text-ancient-gold/85 underline-offset-2 hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
            )}

            {error && (
              <p className="font-body text-xs text-blood-red/90" role="alert">
                {error}
              </p>
            )}
            {info && (
              <p className="font-body text-xs text-parchment/80" role="status">
                {info}
              </p>
            )}

            <button
              type="submit"
              disabled={busy || !isSupabaseConfigured()}
              className="w-full rounded py-3 font-title text-xs tracking-[0.2em] text-deep-black bg-[#4a4428] hover:bg-[#5c5434] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? 'PROCESSANDO…' : tab === 'entrar' ? 'ENTRAR' : 'CRIAR CONTA'}
            </button>
            {tab === 'cadastro' && (
              <p className="text-center font-body text-[11px] text-parchment/40">
                Depois de criar a conta, confirme o e-mail antes de entrar (verifique o spam).
              </p>
            )}
          </form>

          <div className="mt-6 pt-6 border-t border-stone-gray/25">
            <p className="text-center font-body text-[11px] text-parchment/45 mb-3">
              Não quer criar conta agora?
            </p>
            <button
              type="button"
              onClick={() => enterAsGuest()}
              disabled={!isSupabaseConfigured()}
              className="w-full rounded py-2.5 font-body text-xs tracking-wide text-parchment/85 border border-stone-gray/45 hover:border-ancient-gold/50 hover:text-ancient-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Entrar como visitante
            </button>
            <p className="mt-2 text-center font-body text-[10px] text-parchment/35 leading-relaxed">
              Visitantes veem o site quase inteiro, mas não podem adicionar personagens nas fichas.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
