-- Extensions
create extension if not exists "pgcrypto";

-- Shared updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Enums
-- Additional enums for volunteers, broadcasts, chat, and events will be added
-- in later migrations when those features are built.
create type public.source_channel as enum ('telegram', 'web_chat', 'referral', 'event', 'import', 'other');

create type public.priority_level as enum ('low', 'medium', 'high', 'critical');

create type public.sentiment_type as enum ('positive', 'neutral', 'negative');

create type public.report_status as enum ('new', 'assigned', 'in_progress', 'resolved', 'closed');
