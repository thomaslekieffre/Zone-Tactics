-- Permet à un utilisateur connecté de créer sa ligne profiles si elle manque
-- (ex. compte créé avant le trigger, ou migration depuis un autre auth).

create policy "profiles_insert_self"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());
