-- ============================================================
-- J-MUSE Row Level Security Policies
-- Run after schema.sql
-- ============================================================

alter table public.profiles enable row level security;
alter table public.artists enable row level security;
alter table public.albums enable row level security;
alter table public.songs enable row level security;
alter table public.posts enable row level security;
alter table public.answers enable row level security;
alter table public.likes enable row level security;
alter table public.playlists enable row level security;
alter table public.playlist_songs enable row level security;

-- ------------------------------------------------------------
-- profiles
-- ------------------------------------------------------------
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ------------------------------------------------------------
-- artists / albums / songs: public read-only catalog data
-- (writes are performed by admins via the Supabase dashboard / service role)
-- ------------------------------------------------------------
drop policy if exists "artists_select_all" on public.artists;
create policy "artists_select_all" on public.artists for select using (true);

drop policy if exists "albums_select_all" on public.albums;
create policy "albums_select_all" on public.albums for select using (true);

drop policy if exists "songs_select_all" on public.songs;
create policy "songs_select_all" on public.songs for select using (true);

-- ------------------------------------------------------------
-- posts
-- ------------------------------------------------------------
drop policy if exists "posts_select_all" on public.posts;
create policy "posts_select_all"
  on public.posts for select
  using (true);

drop policy if exists "posts_insert_own" on public.posts;
create policy "posts_insert_own"
  on public.posts for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "posts_update_own" on public.posts;
create policy "posts_update_own"
  on public.posts for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "posts_delete_own" on public.posts;
create policy "posts_delete_own"
  on public.posts for delete
  to authenticated
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- answers
-- ------------------------------------------------------------
drop policy if exists "answers_select_all" on public.answers;
create policy "answers_select_all"
  on public.answers for select
  using (true);

drop policy if exists "answers_insert_own" on public.answers;
create policy "answers_insert_own"
  on public.answers for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "answers_update_own" on public.answers;
create policy "answers_update_own"
  on public.answers for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "answers_delete_own" on public.answers;
create policy "answers_delete_own"
  on public.answers for delete
  to authenticated
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- likes
-- ------------------------------------------------------------
drop policy if exists "likes_select_all" on public.likes;
create policy "likes_select_all"
  on public.likes for select
  using (true);

drop policy if exists "likes_insert_own" on public.likes;
create policy "likes_insert_own"
  on public.likes for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "likes_delete_own" on public.likes;
create policy "likes_delete_own"
  on public.likes for delete
  to authenticated
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- playlists
-- ------------------------------------------------------------
drop policy if exists "playlists_select_own" on public.playlists;
create policy "playlists_select_own"
  on public.playlists for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "playlists_insert_own" on public.playlists;
create policy "playlists_insert_own"
  on public.playlists for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "playlists_update_own" on public.playlists;
create policy "playlists_update_own"
  on public.playlists for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "playlists_delete_own" on public.playlists;
create policy "playlists_delete_own"
  on public.playlists for delete
  to authenticated
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- playlist_songs (ownership derived from parent playlist)
-- ------------------------------------------------------------
drop policy if exists "playlist_songs_select_own" on public.playlist_songs;
create policy "playlist_songs_select_own"
  on public.playlist_songs for select
  to authenticated
  using (
    exists (
      select 1 from public.playlists p
      where p.id = playlist_songs.playlist_id and p.user_id = auth.uid()
    )
  );

drop policy if exists "playlist_songs_insert_own" on public.playlist_songs;
create policy "playlist_songs_insert_own"
  on public.playlist_songs for insert
  to authenticated
  with check (
    exists (
      select 1 from public.playlists p
      where p.id = playlist_songs.playlist_id and p.user_id = auth.uid()
    )
  );

drop policy if exists "playlist_songs_delete_own" on public.playlist_songs;
create policy "playlist_songs_delete_own"
  on public.playlist_songs for delete
  to authenticated
  using (
    exists (
      select 1 from public.playlists p
      where p.id = playlist_songs.playlist_id and p.user_id = auth.uid()
    )
  );
