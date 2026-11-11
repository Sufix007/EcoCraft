-- Run once in your Supabase project's SQL Editor.
-- Supabase Authentication email/password must be enabled.
create table if not exists public.ecocraft_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 40),
  created_at timestamptz not null default now()
);

create table if not exists public.completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id text not null,
  count integer not null check (count between 1 and 100),
  notes text not null default '' check (char_length(notes) <= 300),
  photo_path text,
  created_at timestamptz not null default now()
);
create index if not exists completions_user_created_idx on public.completions(user_id, created_at desc);

alter table public.ecocraft_profiles enable row level security;
alter table public.completions enable row level security;

-- Profile names are exposed only through leaderboard RPC, not direct table reads.
drop policy if exists "Owner can view profile" on public.ecocraft_profiles;
create policy "Owner can view profile" on public.ecocraft_profiles for select to authenticated using (id = (select auth.uid()));

drop policy if exists "Owner can read completions" on public.completions;
create policy "Owner can read completions" on public.completions for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "Owner can create completions" on public.completions;
create policy "Owner can create completions" on public.completions for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "Owner can delete completions" on public.completions;
create policy "Owner can delete completions" on public.completions for delete to authenticated using (user_id = (select auth.uid()));

create or replace function public.ecocraft_register_profile()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.ecocraft_profiles (id, display_name)
  values (new.id, left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), 'Eco Creator'), 40))
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists ecocraft_after_user_created on auth.users;
create trigger ecocraft_after_user_created after insert on auth.users
for each row execute function public.ecocraft_register_profile();

-- Backfill for accounts that already exist in this project's Auth user table.
insert into public.ecocraft_profiles(id,display_name)
select id, left(coalesce(nullif(trim(raw_user_meta_data ->> 'display_name'), ''), 'Eco Creator'),40)
from auth.users on conflict (id) do nothing;

-- Authenticated users can request the public scoreboard, not other users' journals.
create or replace function public.ecocraft_leaderboard()
returns table(user_id uuid, display_name text, items_reused bigint, projects_completed bigint)
language sql stable security definer set search_path = ''
as $$
  select p.id as user_id, p.display_name,
    coalesce(sum(c.count),0)::bigint as items_reused,
    count(c.id)::bigint as projects_completed
  from public.ecocraft_profiles p
  left join public.completions c on c.user_id = p.id
  group by p.id,p.display_name
  order by items_reused desc, projects_completed desc, p.display_name asc
  limit 100;
$$;
revoke all on function public.ecocraft_leaderboard() from public, anon;
grant execute on function public.ecocraft_leaderboard() to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-photos', 'project-photos', false, 2000000, array['image/jpeg'])
on conflict (id) do update set public = false, file_size_limit = 2000000, allowed_mime_types = array['image/jpeg'];

drop policy if exists "Upload own project photos" on storage.objects;
create policy "Upload own project photos" on storage.objects for insert to authenticated
with check (bucket_id = 'project-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Read own project photos" on storage.objects;
create policy "Read own project photos" on storage.objects for select to authenticated
using (bucket_id = 'project-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Delete own project photos" on storage.objects;
create policy "Delete own project photos" on storage.objects for delete to authenticated
using (bucket_id = 'project-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
