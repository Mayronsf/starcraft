-- Executar no Supabase: SQL Editor (após já teres corrido schema_characters.sql).
-- Objetivo: cada ficha pertence a um utilizador autenticado; só o dono insere/apaga.
-- No dashboard: Authentication → Providers → Email (ativar).

-- 1) Dono da ficha
alter table public.characters
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists characters_user_id_idx on public.characters (user_id);

-- 2) Políticas da tabela characters
drop policy if exists "characters_select_all" on public.characters;
drop policy if exists "characters_insert_all" on public.characters;
drop policy if exists "characters_delete_all" on public.characters;
drop policy if exists "characters_insert_own" on public.characters;
drop policy if exists "characters_delete_own" on public.characters;

create policy "characters_select_all" on public.characters for select using (true);

create policy "characters_insert_own" on public.characters
  for insert
  with check (auth.uid() is not null and user_id = auth.uid());

create policy "characters_delete_own" on public.characters
  for delete
  using (auth.uid() is not null and user_id = auth.uid());

-- 3) Storage: skins — novos ficheiros em {user_id}/{nome}.png; leitura pública mantém-se
drop policy if exists "skins_read" on storage.objects;
drop policy if exists "skins_insert" on storage.objects;
drop policy if exists "skins_update" on storage.objects;
drop policy if exists "skins_delete" on storage.objects;

create policy "skins_read" on storage.objects for select using (bucket_id = 'skins');

create policy "skins_insert_own" on storage.objects
  for insert
  with check (
    bucket_id = 'skins'
    and auth.role() = 'authenticated'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "skins_update_own" on storage.objects
  for update
  using (
    bucket_id = 'skins'
    and auth.role() = 'authenticated'
    and split_part(name, '/', 1) = auth.uid()::text
  );

-- Apagar: pasta do utilizador OU ficheiro ligado a uma ficha sua (compat. com skins antigas na raiz)
create policy "skins_delete_own" on storage.objects
  for delete
  using (
    bucket_id = 'skins'
    and auth.role() = 'authenticated'
    and (
      split_part(name, '/', 1) = auth.uid()::text
      or exists (
        select 1
        from public.characters c
        where c.skin_path = name
          and c.user_id = auth.uid()
      )
    )
  );
