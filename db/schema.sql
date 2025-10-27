create table if not exists events_raw (
  id bigserial primary key,
  event_type text not null,
  user_id text,
  session_id text,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  received_at timestamptz not null default now()
);

create index if not exists idx_events_raw_type_time on events_raw (event_type, occurred_at desc);
create index if not exists idx_events_raw_user_time on events_raw (user_id, occurred_at desc);

create table if not exists metrics_daily (
  metric_date date not null,
  metric_name text not null,
  metric_value numeric not null,
  primary key (metric_date, metric_name)
);
