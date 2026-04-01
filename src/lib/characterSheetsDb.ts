import { getSupabase } from './supabaseClient';

export type CharacterRow = {
  id: string;
  nome: string;
  classe: string;
  descricao: string;
  skin_path: string | null;
  created_at?: string;
};

const BUCKET = 'skins';

export function getSkinPublicUrl(skinPath: string | null | undefined): string | undefined {
  if (!skinPath) return undefined;
  const { data } = getSupabase().storage.from(BUCKET).getPublicUrl(skinPath);
  return data.publicUrl;
}

export async function fetchCharacters(): Promise<CharacterRow[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('characters')
    .select('id, nome, classe, descricao, skin_path, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as CharacterRow[];
}

export async function insertCharacter(params: {
  id: string;
  nome: string;
  classe: string;
  descricao: string;
  skinFile: File | null;
}): Promise<void> {
  const supabase = getSupabase();
  let skinPath: string | null = null;

  if (params.skinFile) {
    skinPath = `${params.id}.png`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(skinPath, params.skinFile, {
      contentType: params.skinFile.type || 'image/png',
      upsert: false,
    });
    if (upErr) throw upErr;
  }

  const { error } = await supabase.from('characters').insert({
    id: params.id,
    nome: params.nome,
    classe: params.classe,
    descricao: params.descricao || '—',
    skin_path: skinPath,
  });

  if (error) {
    if (skinPath) {
      await supabase.storage.from(BUCKET).remove([skinPath]);
    }
    throw error;
  }
}

export async function deleteCharacter(id: string, skinPath: string | null): Promise<void> {
  const supabase = getSupabase();
  if (skinPath) {
    await supabase.storage.from(BUCKET).remove([skinPath]);
  }
  const { error } = await supabase.from('characters').delete().eq('id', id);
  if (error) throw error;
}
