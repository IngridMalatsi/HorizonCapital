create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  business_name text check (business_name is null or char_length(business_name) <= 120),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (business_name) on table public.profiles to authenticated;

create policy "Users can read their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.create_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, business_name)
  values (
    new.id,
    nullif(btrim(coalesce(new.raw_user_meta_data ->> 'business_name', '')), '')
  );
  return new;
end;
$$;

revoke all on function public.create_profile_for_auth_user() from public, anon, authenticated;

create trigger create_profile_after_signup
  after insert on auth.users
  for each row execute function public.create_profile_for_auth_user();
