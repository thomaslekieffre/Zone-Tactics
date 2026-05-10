-- =========================================================
-- Zone Tactics - Initial schema
-- Auth, profiles, tactics, shares, subscriptions, audio storage
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_self_or_admin"
  on public.profiles for select
  to authenticated
  using (
    id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

create policy "profiles_update_self"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Trigger : create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- tactics ----------
create table if not exists public.tactics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tactics_user_updated_idx
  on public.tactics (user_id, updated_at desc);

alter table public.tactics enable row level security;

create policy "tactics_owner_select"
  on public.tactics for select
  to authenticated
  using (user_id = auth.uid());

create policy "tactics_owner_insert"
  on public.tactics for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "tactics_owner_update"
  on public.tactics for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "tactics_owner_delete"
  on public.tactics for delete
  to authenticated
  using (user_id = auth.uid());

-- ---------- shares ----------
create table if not exists public.shares (
  id uuid primary key default gen_random_uuid(),
  tactic_id uuid not null references public.tactics(id) on delete cascade,
  slug text unique not null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists shares_tactic_idx on public.shares (tactic_id);

alter table public.shares enable row level security;

create policy "shares_public_select"
  on public.shares for select
  to anon, authenticated
  using (true);

create policy "shares_owner_insert"
  on public.shares for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "shares_owner_delete"
  on public.shares for delete
  to authenticated
  using (created_by = auth.uid());

-- Public read on tactics through a valid share
create policy "tactics_public_via_share"
  on public.tactics for select
  to anon, authenticated
  using (exists (select 1 from public.shares s where s.tactic_id = tactics.id));

-- ---------- subscriptions ----------
create table if not exists public.subscriptions (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text not null default 'inactive',
  price_id text,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_owner_select"
  on public.subscriptions for select
  to authenticated
  using (user_id = auth.uid());

-- INSERT/UPDATE/DELETE only via service_role (Stripe webhook). No policy = denied.

-- ---------- updated_at triggers ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tactics_touch_updated_at on public.tactics;
create trigger tactics_touch_updated_at
  before update on public.tactics
  for each row execute function public.touch_updated_at();

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ---------- storage : audio-comments bucket ----------
insert into storage.buckets (id, name, public)
values ('audio-comments', 'audio-comments', false)
on conflict (id) do nothing;

-- Path convention: {user_id}/{tactic_id}/{sequence_id}.webm
-- Read = owner OR anyone if the tactic has at least one share
-- Write = owner only

drop policy if exists "audio_owner_read" on storage.objects;
create policy "audio_owner_read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'audio-comments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

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
    )
  );

drop policy if exists "audio_owner_insert" on storage.objects;
create policy "audio_owner_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'audio-comments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "audio_owner_update" on storage.objects;
create policy "audio_owner_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'audio-comments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "audio_owner_delete" on storage.objects;
create policy "audio_owner_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'audio-comments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
