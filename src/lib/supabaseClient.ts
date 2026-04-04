import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

/**
 * URL para onde o Supabase redireciona após o utilizador clicar no link do email de recuperação.
 * Adiciona o mesmo URL em Supabase → Authentication → URL Configuration → Redirect URLs.
 */
export function getPasswordRecoveryRedirectUrl(): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const path = `${base}/redefinir-palavra-passe`.replace(/\/+/g, '/');
  return `${window.location.origin}${path}`;
}

/**
 * URL para onde o Supabase redireciona após confirmar o e-mail (cadastro).
 * Usa o mesmo domínio da página atual (Vercel em produção, localhost em dev).
 * Inclua este URL (e variações) em Authentication → URL Configuration → Redirect URLs.
 */
export function getEmailAuthRedirectUrl(): string {
  const base = import.meta.env.BASE_URL || '/';
  try {
    return new URL(base, window.location.origin).href;
  } catch {
    return `${window.location.origin}/`;
  }
}

export function getSupabase(): SupabaseClient {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (ex.: Vercel → Environment Variables).');
  }
  if (!client) {
    client = createClient(url, key);
  }
  return client;
}
