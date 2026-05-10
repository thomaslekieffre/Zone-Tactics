-- PIN optionnel sur les partages, compteur de vues, lecture publique uniquement si pas de PIN.
-- RPC SECURITY DEFINER pour débloquer les tactiques protégées sans exposer la ligne tactics aux anon.

alter table public.shares
  add column if not exists pin_hash text,
  add column if not exists view_count bigint not null default 0;

comment on column public.shares.pin_hash is 'SHA-256 hex de zt_share_pin:<slug>:<pin> (voir hashSharePin côté app). Null = lien ouvert.';

-- Ancienne policy : toute tactique avec un share était lisible en anon.
drop policy if exists "tactics_public_via_share" on public.tactics;
create policy "tactics_public_via_share"
  on public.tactics for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.shares s
      where s.tactic_id = tactics.id
        and s.pin_hash is null
    )
  );

-- Audio : même règle — pas d’accès anon si seuls des liens à PIN existent.
drop policy if exists "audio_public_via_share" on storage.objects;
create policy "audio_public_via_share"
  on storage.objects for select
  to anon, authenticated
  using (
    bucket_id = 'audio-comments'
    and exists (
      select 1
      from public.shares s
      join public.tactics t on t.id = s.tactic_id
      where (storage.foldername(name))[2] = t.id::text
        and s.pin_hash is null
    )
  );

create or replace function public.get_shared_tactic_data(p_slug text, p_pin text default null)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  sh public.shares%rowtype;
  tact public.tactics%rowtype;
  expected_hash text;
  ok boolean;
begin
  if p_slug is null or length(trim(p_slug)) = 0 then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  select * into sh from public.shares where slug = trim(p_slug);
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  select * into tact from public.tactics where id = sh.tactic_id;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  -- Lien sans PIN : tout lecteur anon peut voir (compteur + données).
  if sh.pin_hash is null then
    update public.shares
      set view_count = view_count + 1
      where id = sh.id;

    return jsonb_build_object(
      'ok', true,
      'locked', false,
      'id', tact.id,
      'name', tact.name,
      'data', tact.data,
      'view_count', (select view_count from public.shares where id = sh.id)
    );
  end if;

  -- PIN requis : sans code valide, pas de données tactique.
  if p_pin is null or length(trim(p_pin)) < 4 then
    return jsonb_build_object('ok', true, 'locked', true);
  end if;

  expected_hash := encode(
    extensions.digest('zt_share_pin:' || sh.slug || ':' || trim(p_pin), 'sha256'),
    'hex'
  );
  ok := (sh.pin_hash = expected_hash);

  if not ok then
    return jsonb_build_object('ok', true, 'locked', true, 'bad_pin', true);
  end if;

  update public.shares
    set view_count = view_count + 1
    where id = sh.id;

  return jsonb_build_object(
    'ok', true,
    'locked', false,
    'id', tact.id,
    'name', tact.name,
    'data', tact.data,
    'view_count', (select view_count from public.shares where id = sh.id)
  );
end;
$$;

grant execute on function public.get_shared_tactic_data(text, text) to anon, authenticated;
