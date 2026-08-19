# J-MUSE

J-POP 음악을 발견하고, 다른 사용자와 추천/질문을 주고받는 커뮤니티형 음악 웹앱입니다.

## 소개

J-MUSE는 단순한 음악 정보 사이트가 아니라, 사용자가 직접 추천글과 질문을 올리고 다른 사용자가 답변하며, 좋아요와 조회수를 통해 인기 콘텐츠가 만들어지는 **J-POP 추천 커뮤니티**입니다. Spotify/YouTube Music류의 다크 테마 음악 플랫폼 UI에서 영감을 받았지만, 보라·핑크·블루 그라디언트를 중심으로 한 독자적인 브랜드 톤으로 디자인했습니다.

## 주요 기능

- **회원가입 / 로그인 / 로그아웃** — Supabase Auth(이메일·비밀번호) 사용, 가입 시 트리거로 프로필 자동 생성
- **게시글 CRUD** — 음악 추천 / 질문 / 아티스트 추천 / 앨범 추천 / 플레이리스트 추천 / 자유 이야기 카테고리, 음악 연결, 조회수, 좋아요
- **답변(댓글) CRUD** — 게시글 상세에서 실시간으로 답변 작성/삭제
- **좋아요** — 게시글 / 답변 / 음악에 대해 토글형 좋아요 (중복 방지, DB unique 제약 + 트리거로 카운트 자동 관리)
- **통합 검색** — 곡 / 아티스트 / 앨범 / 게시글을 한 번에 검색
- **음악 탐색** — 최신 발매, 인기곡, 인기 아티스트, 인기 앨범
- **아티스트 / 곡 / 앨범 상세 페이지** — 인기곡 TOP5, 최신곡, 관련 커뮤니티 게시글까지 음악과 커뮤니티를 연결
- **하단 고정 뮤직 플레이어** — 재생/일시정지/이전/다음/좋아요/진행바, preview_url이 없으면 데모 재생 모드로 동작
- **라이브러리** — 좋아요한 음악, 내 게시글, 내 답변, 플레이리스트, 최근 본 항목(localStorage)
- **플레이리스트** — 생성/이름변경/삭제, 곡 추가/삭제
- **전역 Toast, Skeleton UI, Empty/Error 상태** — 모든 데이터 흐름에 실제 로딩/에러/빈 상태 처리

## 기술 스택

- **React 19 + Vite** (JavaScript)
- **React Router v7** — 클라이언트 라우팅
- **Zustand** — 인증 / 플레이어 / 토스트 전역 상태
- **Tailwind CSS v4** — 디자인 시스템 (CSS 변수 기반 다크 테마)
- **Supabase** (`@supabase/supabase-js`) — Auth, Postgres DB, RLS, RPC
- **lucide-react** — 아이콘

## 프로젝트 구조

```
src/
├── components/
│   ├── layout/     # Sidebar, TopBar, MobileNav, Layout
│   ├── common/     # Button, Toast, Skeleton, EmptyState, ErrorState, LikeButton ...
│   ├── music/      # SongCard, ArtistCard, AlbumCard, MusicPlayer, MusicSearchPicker
│   └── community/  # PostCard, AnswerItem, PostForm, CategoryTabs, SortTabs
├── pages/          # Home, Community, PostDetail, WritePost, EditPost, MusicDiscovery,
│                   # ArtistDetail, SongDetail, AlbumDetail, Search, Library, PlaylistDetail,
│                   # Login, Signup, NotFound
├── services/       # supabaseClient, auth, posts, answers, songs, artists, albums,
│                   # likes, playlists, search, mockData (fallback)
├── store/          # useAuthStore, usePlayerStore, useToastStore (Zustand)
├── hooks/          # useDebounce, useLike
└── utils/          # constants, formatters, recentlyViewed

supabase/
├── schema.sql      # 테이블, 인덱스, 함수, 트리거
├── policies.sql    # Row Level Security 정책
└── seed.sql        # 개발용 시드 데이터
```

## Supabase 구조

| 테이블 | 설명 |
|---|---|
| `profiles` | 사용자 프로필 (auth.users와 1:1, 가입 시 트리거로 자동 생성) |
| `artists` | 아티스트 카탈로그 |
| `albums` | 앨범 카탈로그 (artists 참조) |
| `songs` | 곡 카탈로그 (artists, albums 참조, like_count 포함) |
| `posts` | 커뮤니티 게시글 (카테고리, 연결된 곡, 조회수/좋아요/답변수) |
| `answers` | 게시글 답변 |
| `likes` | 폴리모픽 좋아요 (`target_type`: post/answer/song, user당 unique) |
| `playlists` / `playlist_songs` | 사용자 플레이리스트 및 수록곡 |

> `posts.user_id` / `answers.user_id` / `likes.user_id` / `playlists.user_id`는 `auth.users(id)`가 아닌 **`public.profiles(id)`**를 참조합니다. `profiles.id`가 이미 `auth.users(id)`의 FK이므로 무결성은 그대로 유지되면서, PostgREST가 `posts.select('*, profiles(*)')` 같은 관계 임베딩을 지원할 수 있습니다 (auth 스키마는 API에 직접 노출되지 않기 때문).

핵심 함수/트리거:
- `handle_new_user` — 회원가입 시 `profiles` 행 자동 생성
- `handle_answer_count` / `handle_like_count` — 답변/좋아요 증감 시 `posts.answer_count`, `posts/answers/songs.like_count` 자동 갱신
- `increment_post_view(post_id)` — 조회수 증가 RPC (익명 사용자도 호출 가능하도록 `anon`에 EXECUTE 권한 부여)

## 데이터베이스 설정 방법

1. [supabase.com](https://supabase.com)에서 새 프로젝트 생성
2. Supabase 대시보드 → **SQL Editor**에서 아래 순서로 실행
   1. `supabase/schema.sql`
   2. `supabase/policies.sql`
   3. (선택, 개발용) `supabase/seed.sql` — 테스트 계정 10명(비밀번호 `password123`), 아티스트 12, 앨범 12, 곡 33, 게시글 16, 답변 22, 플레이리스트 6, 좋아요 데이터 삽입
3. Project Settings → API에서 **Project URL**과 **anon public key** 확인

`seed.sql`은 `auth.users`에 직접 INSERT하므로 반드시 Supabase SQL Editor(관리자 권한)에서 실행해야 하며, **개발 환경 전용**입니다. 프로덕션 DB에는 실행하지 마세요.

## 환경변수 설정

`.env.example`을 복사해 `.env`를 만들고 값을 채워주세요.

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

`service_role` 키는 절대 프론트엔드/`.env`에 넣지 않습니다. `.env`는 `.gitignore`에 포함되어 있습니다.

환경변수가 설정되지 않은 상태로 실행하면 앱은 자동으로 **mock 데이터 모드**로 동작하여 UI를 미리 확인할 수 있습니다(글쓰기/좋아요 등 쓰기 기능은 Supabase 연결이 필요합니다).

## 실행 방법

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

## API / 데이터 출처

- 별도의 백엔드 서버 없이 **Supabase(Postgres)를 단일 데이터 소스**로 사용합니다. Spotify 등 외부 음악 API는 클라이언트 보안 자격 증명(client secret) 없이는 안전하게 호출할 수 없어 연동하지 않았고, 대신 실제 J-POP 아티스트/곡 메타데이터(이름, 발매일, 장르 등 사실 정보)를 `seed.sql`에 담아 Supabase에 저장했습니다.
- 곡/아티스트/앨범 아트워크는 [picsum.photos](https://picsum.photos)의 시드 기반 플레이스홀더 이미지, 아바타는 [pravatar.cc](https://i.pravatar.cc)를 사용합니다. 저작권이 있는 오디오는 포함하지 않았으며, 뮤직 플레이어는 실제 미리듣기 URL이 없을 경우 **데모 재생 모드**(진행바 시뮬레이션)로 동작합니다.
- 데이터 접근은 `src/services/*.js`로 완전히 분리되어 있어(`songs.js`, `artists.js`, `albums.js` 등), 추후 실제 음악 API 키를 발급받으면 해당 서비스 함수 내부만 교체하면 됩니다. Supabase 환경변수가 없을 때는 `services/mockData.js`의 정적 데이터로 자동 폴백합니다.

## 배포 방법

Vercel / Netlify 등 정적 호스팅에 배포 가능합니다 (Vite SPA).

1. 빌드 커맨드: `npm run build`, 출력 디렉터리: `dist`
2. 환경변수(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)를 호스팅 플랫폼에 등록
3. SPA 라우팅을 위해 모든 경로를 `index.html`로 리다이렉트하는 rewrite 규칙 필요
   - Vercel: `vercel.json`에 `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
   - Netlify: `_redirects`에 `/*  /index.html  200`
4. Supabase 프로젝트의 Authentication → URL Configuration에 배포 도메인을 Site URL / Redirect URL로 등록

## 향후 개선사항

- 실제 음악 스트리밍/미리듣기 API(Spotify 등) 연동 — 서버리스 함수를 통한 토큰 발급으로 client secret 보호 필요
- 게시글/댓글 페이지네이션의 커서 기반 처리 및 무한 스크롤
- 알림(내 게시글에 답변이 달렸을 때 등) 기능
- 이미지 업로드(프로필/게시글 첨부) — Supabase Storage 연동
- 플레이리스트 공개/공유 기능 (현재는 RLS로 본인만 조회 가능)
- 전문(full-text) 검색 고도화 (현재는 `ilike` 기반, `schema.sql`에 GIN 인덱스는 이미 준비됨)
- 다크/라이트 테마 토글
