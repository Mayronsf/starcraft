import { getSupabase } from './supabaseClient';

type SupabaseErr = {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
  statusCode?: string;
};

function raiseDbError(error: unknown): void {
  if (error == null) return;
  if (typeof error !== 'object' || !('message' in error) || typeof (error as { message: unknown }).message !== 'string') {
    throw new Error(String(error));
  }
  const e = error as SupabaseErr;
  const parts = [e.message];
  if (e.hint) parts.push(e.hint);
  if (e.details && e.details !== e.message) parts.push(e.details);
  let msg = parts.join(' · ');
  if (e.code === '42703' || /user_id|does not exist|Could not find/i.test(e.message)) {
    msg +=
      ' Se for um banco antigo, o app tenta modo compatível. Para dono da ficha e segurança, rode supabase/migrate_characters_auth.sql no SQL Editor.';
  }
  if (
    e.code === '42501' ||
    /row-level security|new row violates|permission denied|not authorized/i.test(e.message)
  ) {
    msg +=
      ' Verifique se está logado e as políticas RLS (migrate_characters_auth.sql).';
  }
  if (/bucket|storage|object/i.test(e.message) && /denied|policy|403|Unauthorized/i.test(e.message)) {
    msg +=
      ' Storage: confirme políticas do bucket skins (migrate_characters_auth.sql).';
  }
  throw new Error(msg);
}

export type CharacterRow = {
  id: string;
  nome: string;
  classe: string;
  descricao: string;
  skin_path: string | null;
  /** Dono da ficha (null = legado ou sem coluna user_id no banco) */
  user_id: string | null;
  created_at?: string;
};

const BUCKET = 'skins';

/** Limpa cache se migrar o banco sem recarregar o bundle (ex.: testes). */
export function resetCharactersSchemaCache(): void {
  userIdColumnPromise = null;
}

let userIdColumnPromise: Promise<boolean> | null = null;

/**
 * true = coluna user_id existe (schema com auth).
 * false = só schema antigo (schema_characters.sql sem migrate).
 */
async function tableHasUserIdColumn(): Promise<boolean> {
  if (userIdColumnPromise) return userIdColumnPromise;
  userIdColumnPromise = (async () => {
    const supabase = getSupabase();
    const { error } = await supabase.from('characters').select('user_id').limit(1);
    if (!error) return true;
    const m = error.message || '';
    if (/user_id|schema cache|does not exist|column/i.test(m)) return false;
    raiseDbError(error);
    return true;
  })();
  return userIdColumnPromise;
}

function normalizeRow(row: Record<string, unknown>): CharacterRow {
  return {
    id: String(row.id),
    nome: String(row.nome),
    classe: String(row.classe),
    descricao: String(row.descricao ?? '—'),
    skin_path: row.skin_path == null || row.skin_path === '' ? null : String(row.skin_path),
    user_id: row.user_id == null || row.user_id === '' ? null : String(row.user_id),
    created_at: row.created_at == null ? undefined : String(row.created_at),
  };
}

export function getSkinPublicUrl(skinPath: string | null | undefined): string | undefined {
  if (!skinPath) return undefined;
  const { data } = getSupabase().storage.from(BUCKET).getPublicUrl(skinPath);
  return data.publicUrl;
}

export async function fetchCharacters(): Promise<CharacterRow[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('characters').select('*').order('created_at', { ascending: false });

  raiseDbError(error);
  return (data ?? []).map((r) => normalizeRow(r as Record<string, unknown>));
}

export async function insertCharacter(params: {
  id: string;
  userId: string;
  nome: string;
  classe: string;
  descricao: string;
  skinFile: File | null;
}): Promise<void> {
  const supabase = getSupabase();
  const hasUserId = await tableHasUserIdColumn();

  let skinPath: string | null = null;

  if (params.skinFile) {
    if (hasUserId) {
      skinPath = `${params.userId}/${params.id}.png`;
      let { error: upErr } = await supabase.storage.from(BUCKET).upload(skinPath, params.skinFile, {
        contentType: params.skinFile.type || 'image/png',
        upsert: false,
      });
      if (upErr) {
        skinPath = `${params.id}.png`;
        const { error: upFlat } = await supabase.storage.from(BUCKET).upload(skinPath, params.skinFile, {
          contentType: params.skinFile.type || 'image/png',
          upsert: false,
        });
        raiseDbError(upFlat);
      }
    } else {
      skinPath = `${params.id}.png`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(skinPath, params.skinFile, {
        contentType: params.skinFile.type || 'image/png',
        upsert: false,
      });
      raiseDbError(upErr);
    }
  }

  if (hasUserId) {
    const { error } = await supabase.from('characters').insert({
      id: params.id,
      user_id: params.userId,
      nome: params.nome,
      classe: params.classe,
      descricao: params.descricao || '—',
      skin_path: skinPath,
    });
    if (error) {
      if (skinPath) await supabase.storage.from(BUCKET).remove([skinPath]);
      raiseDbError(error);
    }
    return;
  }

  const { error: errLegacy } = await supabase.from('characters').insert({
    id: params.id,
    nome: params.nome,
    classe: params.classe,
    descricao: params.descricao || '—',
    skin_path: skinPath,
  });
  if (errLegacy) {
    if (skinPath) await supabase.storage.from(BUCKET).remove([skinPath]);
    raiseDbError(errLegacy);
  }
}

export async function deleteCharacter(id: string, skinPath: string | null): Promise<void> {
  const supabase = getSupabase();
  if (skinPath) {
    await supabase.storage.from(BUCKET).remove([skinPath]);
  }
  const { error } = await supabase.from('characters').delete().eq('id', id);
  raiseDbError(error);
}
