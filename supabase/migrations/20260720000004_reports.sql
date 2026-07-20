-- Reports: structured citizen issue reports produced by the n8n AI pipeline
-- from Telegram / web chat messages. This is the MVP's central data loop.
create sequence public.report_reference_seq start 1;

create or replace function public.generate_report_reference()
returns text
language sql
as $$
  select 'AC-' || lpad(nextval('public.report_reference_seq')::text, 6, '0');
$$;

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique default public.generate_report_reference(),
  constituent_id uuid references public.constituents (id) on delete set null,
  citizen_name text,
  phone text,
  telegram_user_id text,
  message text not null,
  summary text,
  category text,
  subcategory text,
  priority public.priority_level not null default 'medium',
  status public.report_status not null default 'new',
  department text,
  lga text,
  ward text,
  community text,
  latitude double precision,
  longitude double precision,
  language text,
  sentiment public.sentiment_type,
  source_channel public.source_channel not null default 'other',
  n8n_execution_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reports_status_idx on public.reports (status);
create index reports_priority_idx on public.reports (priority);
create index reports_category_idx on public.reports (category);
create index reports_lga_idx on public.reports (lga);
create index reports_ward_idx on public.reports (ward);
create index reports_community_idx on public.reports (community);
create index reports_sentiment_idx on public.reports (sentiment);
create index reports_created_at_idx on public.reports (created_at desc);
create index reports_constituent_id_idx on public.reports (constituent_id);

create trigger set_updated_at
  before update on public.reports
  for each row execute function public.set_updated_at();

-- RLS is enabled with no permissive policies: the app has no end-user Supabase
-- Auth session, so every read/write goes through server-side code (Server
-- Components, Server Actions, Route Handlers) using the Supabase service role
-- key, which bypasses RLS. This blocks any direct anon/browser access to the
-- table by default.
alter table public.reports enable row level security;
