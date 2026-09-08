-- Halden studio schema. Per-user rows always carry user_id / coach_user_id as TEXT.
--
-- FOREIGN KEYs to "user"("id") are intentionally omitted: the dev fallback user
-- ("dev-user") has no row in "user" — it is a synthetic identity returned when
-- auth is disabled (VITE_AUTH_ENABLED=false). Adding FKs would break the preview.
-- In production, Better Auth owns the "user" table and CASCADE deletes are handled
-- at the auth layer. All per-user queries are scoped server-side by authMiddleware.

create table if not exists profiles (
  user_id text primary key,
  display_name text,
  email text,
  timezone text not null default 'America/Los_Angeles',
  program_slug text not null default 'foundation',
  week_number int not null default 4,
  seeded boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists goals (
  id text primary key,
  user_id text not null,
  title text not null,
  detail text,
  progress int not null default 0,
  sort_order int not null default 0
);
create index if not exists goals_user_id_idx on goals (user_id);

create table if not exists habits (
  id text primary key,
  user_id text not null,
  name text not null,
  cue text,
  target_days int not null default 7,
  sort_order int not null default 0
);
create index if not exists habits_user_id_idx on habits (user_id);

create table if not exists habit_logs (
  id text primary key,
  user_id text not null,
  habit_id text not null,
  day date not null
);
create unique index if not exists habit_logs_habit_day_idx on habit_logs (habit_id, day);
create index if not exists habit_logs_user_day_idx on habit_logs (user_id, day);

create table if not exists plan_items (
  id text primary key,
  user_id text not null,
  weekday text not null,
  title text not null,
  detail text,
  done boolean not null default false,
  sort_order int not null default 0
);
create index if not exists plan_items_user_id_idx on plan_items (user_id);

create table if not exists checkins (
  id text primary key,
  user_id text not null,
  week_label text not null,
  energy int,
  sleep int,
  mood int,
  wins text,
  challenges text,
  questions text,
  coach_reply text,
  status text not null default 'submitted',
  created_at timestamptz not null default now()
);
create index if not exists checkins_user_id_idx on checkins (user_id);

create table if not exists appointments (
  id text primary key,
  user_id text not null,
  service_slug text not null,
  service_name text not null,
  starts_at timestamptz not null,
  duration_min int not null default 45,
  status text not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists appointments_user_id_idx on appointments (user_id);

create table if not exists messages (
  id text primary key,
  user_id text not null,
  author text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_user_id_idx on messages (user_id);

create table if not exists assessments (
  id text primary key,
  user_id text not null,
  answers text not null,
  recommended_slug text,
  summary text,
  created_at timestamptz not null default now()
);
create index if not exists assessments_user_id_idx on assessments (user_id);

create table if not exists studio_clients (
  id text primary key,
  coach_user_id text not null,
  name text not null,
  role_label text,
  program_slug text,
  status text not null default 'active',
  week_number int not null default 1,
  energy int not null default 6,
  sleep int not null default 6,
  consistency int not null default 6,
  last_checkin text,
  focus text,
  note text,
  at_risk boolean not null default false
);
create index if not exists studio_clients_coach_idx on studio_clients (coach_user_id);

create table if not exists studio_checkins (
  id text primary key,
  coach_user_id text not null,
  client_id text not null,
  week_label text,
  energy int,
  sleep int,
  body text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
create index if not exists studio_checkins_coach_idx on studio_checkins (coach_user_id);

create table if not exists resource_favs (
  user_id text not null,
  slug text not null,
  primary key (user_id, slug)
);

create table if not exists notifications (
  id text primary key,
  user_id text not null,
  title text not null,
  body text,
  href text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_id_idx on notifications (user_id);
