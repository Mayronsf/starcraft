import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import {
  getEmailAuthRedirectUrl,
  getPasswordRecoveryRedirectUrl,
  getSupabase,
  isSupabaseConfigured,
} from '../lib/supabaseClient';

export type SignUpResult = {
  error: Error | null;
  /** Se true, o utilizador já ficou autenticado (confirmação por email desativada no Supabase). */
  sessionCreated: boolean;
};

export type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    options?: { nick?: string },
  ) => Promise<SignUpResult>;
  sendPasswordResetEmail: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(() => Boolean(isSupabaseConfigured()));

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      setUser(null);
      setSession(null);
      return;
    }

    const supabase = getSupabase();
    let cancelled = false;

    void supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (cancelled) return;
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase não está configurado.') };
    }
    const { error } = await getSupabase().auth.signInWithPassword({ email, password });
    return { error: error ? new Error(error.message) : null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, options?: { nick?: string }) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase não está configurado'), sessionCreated: false };
    }
    const nick = options?.nick?.trim();
    const { data, error } = await getSupabase().auth.signUp({
      email,
      password,
      options: {
        data: nick ? { nick, display_name: nick } : {},
        emailRedirectTo: getEmailAuthRedirectUrl(),
      },
    });
    if (error) {
      return { error: new Error(error.message), sessionCreated: false };
    }
    return { error: null, sessionCreated: Boolean(data.session) };
  }, []);

  const sendPasswordResetEmail = useCallback(async (email: string) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase não está configurado.') };
    }
    const redirectTo = getPasswordRecoveryRedirectUrl();
    const { error } = await getSupabase().auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });
    return { error: error ? new Error(error.message) : null };
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase não está configurado.') };
    }
    const { error } = await getSupabase().auth.updateUser({ password: newPassword });
    return { error: error ? new Error(error.message) : null };
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    await getSupabase().auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      signIn,
      signUp,
      sendPasswordResetEmail,
      updatePassword,
      signOut,
    }),
    [user, session, loading, signIn, signUp, sendPasswordResetEmail, updatePassword, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
}
