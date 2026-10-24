create extension if not exists pgcrypto with schema extensions;

create table public.audit_events (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default clock_timestamp(),
  actor_id uuid,
  action text not null,
  table_name text not null,
  record_id uuid not null,
  metadata jsonb not null default '{}'::jsonb,
  previous_hash text,
  entry_hash text not null
);

alter table public.audit_events enable row level security;
revoke all on table public.audit_events from public, anon, authenticated, service_role;
revoke all on sequence public.audit_events_id_seq from public, anon, authenticated, service_role;

create or replace function public.chain_audit_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  prior_hash text;
  canonical_entry jsonb;
begin
  perform pg_catalog.pg_advisory_xact_lock(721045, 1);

  select entry_hash
    into prior_hash
    from public.audit_events
    order by id desc
    limit 1;

  new.previous_hash := prior_hash;
  canonical_entry := jsonb_build_object(
    'id', new.id,
    'occurred_at', pg_catalog.to_char(
      new.occurred_at at time zone 'UTC',
      'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'
    ),
    'actor_id', new.actor_id,
    'action', new.action,
    'table_name', new.table_name,
    'record_id', new.record_id,
    'metadata', new.metadata
  );
  new.entry_hash := pg_catalog.encode(
    extensions.digest(
      coalesce(prior_hash, '') || '|' || canonical_entry::text,
      'sha256'
    ),
    'hex'
  );

  return new;
end;
$$;

create trigger chain_audit_event_before_insert
  before insert on public.audit_events
  for each row execute function public.chain_audit_event();

create or replace function public.reject_audit_event_mutation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  raise exception 'Audit events are append-only';
end;
$$;

create trigger reject_audit_event_update_or_delete
  before update or delete on public.audit_events
  for each row execute function public.reject_audit_event_mutation();

create or replace function public.verify_audit_event_chain()
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  audit_event record;
  prior_hash text;
  expected_hash text;
  canonical_entry jsonb;
begin
  for audit_event in
    select id, occurred_at, actor_id, action, table_name, record_id, metadata,
      previous_hash, entry_hash
    from public.audit_events
    order by id
  loop
    canonical_entry := jsonb_build_object(
      'id', audit_event.id,
      'occurred_at', pg_catalog.to_char(
        audit_event.occurred_at at time zone 'UTC',
        'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'
      ),
      'actor_id', audit_event.actor_id,
      'action', audit_event.action,
      'table_name', audit_event.table_name,
      'record_id', audit_event.record_id,
      'metadata', audit_event.metadata
    );
    expected_hash := pg_catalog.encode(
      extensions.digest(
        coalesce(prior_hash, '') || '|' || canonical_entry::text,
        'sha256'
      ),
      'hex'
    );

    if audit_event.previous_hash is distinct from prior_hash
      or audit_event.entry_hash is distinct from expected_hash then
      return false;
    end if;

    prior_hash := audit_event.entry_hash;
  end loop;

  return true;
end;
$$;

revoke all on function public.chain_audit_event() from public, anon, authenticated, service_role;
revoke all on function public.reject_audit_event_mutation() from public, anon, authenticated, service_role;
revoke all on function public.verify_audit_event_chain() from public, anon, authenticated;
grant execute on function public.verify_audit_event_chain() to service_role;

create or replace function public.audit_profile_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  changed_fields text[];
  profile_id uuid;
  audit_action text;
begin
  if tg_op = 'INSERT' then
    profile_id := new.id;
    audit_action := 'profile.created';
    changed_fields := array['business_name'];
  elsif tg_op = 'UPDATE' then
    if new.business_name is not distinct from old.business_name then
      return new;
    end if;
    profile_id := new.id;
    audit_action := 'profile.business_name_updated';
    changed_fields := array['business_name'];
  else
    profile_id := old.id;
    audit_action := 'profile.deleted';
    changed_fields := array['business_name'];
  end if;

  insert into public.audit_events (
    actor_id,
    action,
    table_name,
    record_id,
    metadata
  )
  values (
    coalesce(auth.uid(), profile_id),
    audit_action,
    'profiles',
    profile_id,
    jsonb_build_object('changed_fields', changed_fields)
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function public.audit_profile_change() from public, anon, authenticated, service_role;

create trigger audit_profile_insert
  after insert on public.profiles
  for each row execute function public.audit_profile_change();

create trigger audit_profile_update
  after update on public.profiles
  for each row execute function public.audit_profile_change();

create trigger audit_profile_delete
  before delete on public.profiles
  for each row execute function public.audit_profile_change();
