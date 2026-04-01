-- Executar no Supabase: SQL Editor → New query → Run
-- Ajusta políticas depois se quiseres restringir quem cria/apaga (auth, service role, etc.)

create extension if not exists "pgcrypto";

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  classe text not null,
  descricao text not null default '—',
  skin_path text,
  created_at timestamptz not null default now()
);

create index if not exists characters_created_at_idx on public.characters (created_at desc);

alter table public.characters enable row level security;

-- MVP: site público — qualquer um lê, cria e apaga (aceita spam; endurece quando tiveres auth)
create policy "characters_select_all" on public.characters for select using (true);
create policy "characters_insert_all" on public.characters for insert with check (true);
create policy "characters_delete_all" on public.characters for delete using (true);

-- Bucket de skins (público para leitura via URL no viewer 3D)
insert into storage.buckets (id, name, public)
values ('skins', 'skins', true)
on conflict (id) do nothing;

create policy "skins_read" on storage.objects for select using (bucket_id = 'skins');
create policy "skins_insert" on storage.objects for insert with check (bucket_id = 'skins');
create policy "skins_update" on storage.objects for update using (bucket_id = 'skins');
create policy "skins_delete" on storage.objects for delete using (bucket_id = 'skins');
