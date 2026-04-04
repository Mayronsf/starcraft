import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { session, loading, updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('As duas senhas não coincidem.');
      return;
    }

    setBusy(true);
    try {
      const { error: err } = await updatePassword(password);
      if (err) {
        setError(err.message);
        return;
      }
      navigate('/', { replace: true });
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-deep-black via-[#111112] to-dark-gray flex items-center justify-center text-parchment/50 text-sm font-body px-4 text-center">
        Validando o link do e-mail…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-deep-black via-[#111112] to-dark-gray text-parchment flex flex-col items-center justify-center px-4">
        <div className="max-w-md rounded-lg border border-ancient-gold/50 bg-deep-black/90 p-8 text-center shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <h1 className="font-title text-lg tracking-[0.15em] text-ancient-gold mb-3">LINK INVÁLIDO OU EXPIRADO</h1>
          <p className="font-body text-sm text-parchment/70 mb-6">
            Peça um novo link na tela de login, em &quot;Esqueci minha senha&quot;.
          </p>
          <Link
            to="/"
            className="inline-flex rounded py-3 px-6 font-title text-xs tracking-[0.15em] text-deep-black bg-[#4a4428] hover:bg-[#5c5434] transition-colors"
          >
            Voltar ao login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-deep-black via-[#111112] to-dark-gray text-parchment flex flex-col">
      <header className="border-b border-white/10 px-4 py-8 text-center">
        <p className="font-title text-ancient-gold tracking-[0.2em] text-base md:text-lg">Nova senha</p>
        <p className="mt-2 font-body text-xs text-parchment/50 max-w-sm mx-auto">
          Escolha uma senha segura para a sua conta.
        </p>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="w-full max-w-md rounded-lg border border-ancient-gold/50 bg-deep-black/90 p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] space-y-4"
        >
          <label className="block">
            <span className="font-body text-[10px] uppercase tracking-[0.15em] text-parchment/45">
              Nova senha
            </span>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              className="mt-1.5 w-full rounded border border-stone-gray/35 bg-deep-black px-3 py-2 font-body text-sm text-parchment focus:border-ancient-gold/55 focus:outline-none"
              placeholder="••••••••"
            />
          </label>
          <label className="block">
            <span className="font-body text-[10px] uppercase tracking-[0.15em] text-parchment/45">
              Confirmar
            </span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(ev) => setConfirm(ev.target.value)}
              className="mt-1.5 w-full rounded border border-stone-gray/35 bg-deep-black px-3 py-2 font-body text-sm text-parchment focus:border-ancient-gold/55 focus:outline-none"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="font-body text-xs text-blood-red/90" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded py-3 font-title text-xs tracking-[0.2em] text-deep-black bg-[#4a4428] hover:bg-[#5c5434] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? 'SALVANDO…' : 'SALVAR NOVA SENHA'}
          </button>
        </form>
      </main>
    </div>
  );
}
