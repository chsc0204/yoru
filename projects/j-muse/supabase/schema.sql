-- ============================================================
-- J-MUSE Supabase Schema
-- Postgres extensions, tables, indexes, functions & triggers
-- Run this file first, then policies.sql, then (optionally) seed.sql
-- ============================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ------------------------------------------------------------
-- Enums
-- ------------------------------------------------------------
do $$ begin
  create type post_category as enum (
    'recommendation', -- 음악 추천
    'question',       -- 질문
    'artist',         -- 아티스트 추천
    'album',          -- 앨범 추천
    'playlist',       -- 플레이리스트 추천
    'free'            -- 자유 이야기
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type like_target as enum ('post', 'answer', 'song');
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------
-- profiles: 1:1 extension of auth.users
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null unique,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- artists
-- ------------------------------------------------------------
create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  description text,
  popularity int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_artists_popularity on public.artists (popularity desc);
create index if not exists idx_artists_name on public.artists using gin (to_tsvector('simple', name));

-- ------------------------------------------------------------
-- albums
-- ------------------------------------------------------------
create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist_id uuid references public.artists (id) on delete set null,
  artwork_url text,
  release_date date,
  created_at timestamptz not null default now()
);

create index if not exists idx_albums_artist on public.albums (artist_id);
create index if not exists idx_albums_release on public.albums (release_date desc);

-- ------------------------------------------------------------
-- songs
-- ------------------------------------------------------------
create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist_id uuid references public.artists (id) on delete set null,
  album_id uuid references public.albums (id) on delete set null,
  artwork_url text,
  preview_url text,
  release_date date,
  genre text,
  popularity int not null default 0,
  like_count int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_songs_artist on public.songs (artist_id);
create index if not exists idx_songs_album on public.songs (album_id);
create index if not exists idx_songs_popularity on public.songs (popularity desc);
create index if not exists idx_songs_release on public.songs (release_date desc);
create index if not exists idx_songs_title on public.songs using gin (to_tsvector('simple', title));

-- ------------------------------------------------------------
-- posts
-- ------------------------------------------------------------
-- NOTE: user_id columns below reference public.profiles(id) rather than
-- auth.users(id) directly. profiles.id is itself a FK to auth.users(id)
-- (see handle_new_user trigger), so this still guarantees a valid user
-- while also letting PostgREST embed `profiles` directly on these tables
-- (e.g. posts.select('*, profiles(*)')) since auth.users is not exposed
-- to the API schema.
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  category post_category not null default 'free',
  title text not null check (char_length(title) between 1 and 200),
  content text not null check (char_length(content) between 1 and 8000),
  music_id uuid references public.songs (id) on delete set null,
  view_count int not null default 0,
  like_count int not null default 0,
  answer_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_posts_created on public.posts (created_at desc);
create index if not exists idx_posts_category on public.posts (category);
create index if not exists idx_posts_user on public.posts (user_id);
create index if not exists idx_posts_music on public.posts (music_id);
create index if not exists idx_posts_like_count on public.posts (like_count desc);
create index if not exists idx_posts_title_content on public.posts using gin (to_tsvector('simple', title || ' ' || content));

-- ------------------------------------------------------------
-- answers
-- ------------------------------------------------------------
create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  content text not null check (char_length(content) between 1 and 4000),
  like_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_answers_post on public.answers (post_id);
create index if not exists idx_answers_user on public.answers (user_id);
create index if not exists idx_answers_created on public.answers (created_at desc);

-- ------------------------------------------------------------
-- likes (polymorphic: post / answer / song)
-- ------------------------------------------------------------
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  target_type like_target not null,
  target_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);

create index if not exists idx_likes_target on public.likes (target_type, target_id);
create index if not exists idx_likes_user on public.likes (user_id);

-- ------------------------------------------------------------
-- playlists
-- ------------------------------------------------------------
create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  description text,
  created_at timestamptz not null default now()
);

create index if not exists idx_playlists_user on public.playlists (user_id);

-- ------------------------------------------------------------
-- playlist_songs (join table)
-- ------------------------------------------------------------
create table if not exists public.playlist_songs (
  playlist_id uuid not null references public.playlists (id) on delete cascade,
  song_id uuid not null references public.songs (id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (playlist_id, song_id)
);

create index if not exists idx_playlist_songs_song on public.playlist_songs (song_id);

-- ============================================================
-- Functions & Triggers
-- ============================================================

-- updated_at auto-touch
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger trg_posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

create or replace trigger trg_answers_updated_at
  before update on public.answers
  for each row execute function public.set_updated_at();

-- auto-create profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nickname, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nickname', 'user_' || substr(new.id::text, 1, 8)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- answer_count maintenance on posts
create or replace function public.handle_answer_count()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.posts set answer_count = answer_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.posts set answer_count = greatest(answer_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end;
$$;

create or replace trigger trg_answers_count
  after insert or delete on public.answers
  for each row execute function public.handle_answer_count();

-- like_count maintenance (dispatches to posts / answers / songs)
create or replace function public.handle_like_count()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  t_type like_target;
  t_id uuid;
  delta int;
begin
  if tg_op = 'INSERT' then
    t_type := new.target_type; t_id := new.target_id; delta := 1;
  else
    t_type := old.target_type; t_id := old.target_id; delta := -1;
  end if;

  if t_type = 'post' then
    update public.posts set like_count = greatest(like_count + delta, 0) where id = t_id;
  elsif t_type = 'answer' then
    update public.answers set like_count = greatest(like_count + delta, 0) where id = t_id;
  elsif t_type = 'song' then
    update public.songs set like_count = greatest(like_count + delta, 0) where id = t_id;
  end if;

  return null;
end;
$$;

create or replace trigger trg_likes_count
  after insert or delete on public.likes
  for each row execute function public.handle_like_count();

-- increment a post's view_count (call via rpc so it works for anonymous visitors too)
create or replace function public.increment_post_view(p_post_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.posts set view_count = view_count + 1 where id = p_post_id;
end;
$$;

grant execute on function public.increment_post_view(uuid) to anon, authenticated;
