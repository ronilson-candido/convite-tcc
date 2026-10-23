create extension if not exists pgcrypto with schema extensions;

create table if not exists public.rsvps (
  id uuid primary key default extensions.gen_random_uuid(),
  full_name text not null check (char_length(btrim(full_name)) between 2 and 120),
  relationship text check (
    relationship is null or relationship in (
      'Amigo(a)',
      'Familiar',
      'Professor(a)',
      'Colega de curso',
      'Outro'
    )
  ),
  submission_key uuid not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rsvps_created_at_idx on public.rsvps (created_at desc);
alter table public.rsvps enable row level security;
revoke all on table public.rsvps from anon, authenticated;
grant all on table public.rsvps to service_role;

create table if not exists public.rsvp_rate_limits (
  fingerprint text not null,
  window_start timestamptz not null,
  request_count integer not null default 1 check (request_count > 0),
  primary key (fingerprint, window_start)
);

alter table public.rsvp_rate_limits enable row level security;
revoke all on table public.rsvp_rate_limits from public, anon, authenticated;
grant all on table public.rsvp_rate_limits to service_role;

create or replace function public.consume_rsvp_rate_limit(p_fingerprint text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_window_start timestamptz := date_trunc('hour', now());
  v_request_count integer;
begin
  insert into public.rsvp_rate_limits (fingerprint, window_start, request_count)
  values (p_fingerprint, v_window_start, 1)
  on conflict (fingerprint, window_start)
  do update set request_count = public.rsvp_rate_limits.request_count + 1
  returning request_count into v_request_count;

  return v_request_count <= 10;
end;
$$;

revoke all on function public.consume_rsvp_rate_limit(text) from public, anon, authenticated;
grant execute on function public.consume_rsvp_rate_limit(text) to service_role;

create or replace function public.set_rsvp_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger rsvps_set_updated_at
before update on public.rsvps
for each row execute function public.set_rsvp_updated_at();

comment on table public.rsvps is 'Confirmações privadas da defesa; acesso exclusivamente pelo servidor autorizado.';
comment on column public.rsvps.submission_key is 'Chave aleatória de idempotência do formulário; não contém dados pessoais.';
