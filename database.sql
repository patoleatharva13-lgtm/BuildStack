-- BuildStack database schema
-- Run this in the Supabase SQL editor (SQL > New query).

-- PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "profiles_self_read" on public.profiles for select using (auth.uid() = id);
create policy "profiles_self_update" on public.profiles for update using (auth.uid() = id);
create policy "profiles_self_insert" on public.profiles for insert with check (auth.uid() = id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''));
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- PROJECTS
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  category text,
  tech_stack text[],
  status text default 'active',
  priority text default 'medium',
  color text default 'blue',
  created_at timestamptz default now()
);
alter table public.projects enable row level security;
create policy "projects_owner_all" on public.projects for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- MILESTONES (roadmap)
create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  deadline date,
  status text default 'planned',
  progress int default 0,
  priority text default 'medium',
  created_at timestamptz default now()
);
alter table public.milestones enable row level security;
create policy "milestones_owner_all" on public.milestones for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- FEATURES
create table if not exists public.features (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  priority text default 'medium',
  deadline date,
  assignee text,
  tags text[],
  status text default 'pending',
  created_at timestamptz default now()
);
alter table public.features enable row level security;
create policy "features_owner_all" on public.features for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- BUGS
create table if not exists public.bugs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  steps text,
  expected text,
  actual text,
  severity text default 'medium',
  status text default 'open',
  assignee text,
  created_at timestamptz default now()
);
alter table public.bugs enable row level security;
create policy "bugs_owner_all" on public.bugs for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- RELEASES
create table if not exists public.releases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  version text not null,
  released_on date default current_date,
  notes text,
  created_at timestamptz default now()
);
alter table public.releases enable row level security;
create policy "releases_owner_all" on public.releases for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- DOCS
create table if not exists public.docs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  section text default 'notes',
  title text not null,
  content text,
  created_at timestamptz default now()
);
alter table public.docs enable row level security;
create policy "docs_owner_all" on public.docs for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- TEAM MEMBERS
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text,
  email text not null,
  role text default 'developer',
  status text default 'invited',
  created_at timestamptz default now()
);
alter table public.team_members enable row level security;
create policy "team_owner_all" on public.team_members for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
