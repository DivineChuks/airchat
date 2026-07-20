-- Constituents: citizens / potential voters who have interacted via Telegram or web chat.
create table public.constituents (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  phone text,
  telegram_user_id text,
  lga text,
  ward text,
  community text,
  language text,
  opt_in_campaign_broadcasts boolean not null default false,
  opt_in_issue_updates boolean not null default true,
  source_channel public.source_channel not null default 'other',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index constituents_telegram_user_id_key
  on public.constituents (telegram_user_id)
  where telegram_user_id is not null;

create index constituents_phone_idx on public.constituents (phone);
create index constituents_lga_idx on public.constituents (lga);
create index constituents_ward_idx on public.constituents (ward);

create trigger set_updated_at
  before update on public.constituents
  for each row execute function public.set_updated_at();

-- RLS is enabled with no permissive policies: the app has no end-user Supabase
-- Auth session, so every read/write goes through server-side code (Server
-- Components, Server Actions, Route Handlers) using the Supabase service role
-- key, which bypasses RLS. This blocks any direct anon/browser access to the
-- table by default.
alter table public.constituents enable row level security;
