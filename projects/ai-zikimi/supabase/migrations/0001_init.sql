-- ============================================================
-- 아이지킴이 (AI-Zikimi) Supabase 스키마
-- STEP 2: 테이블 + 체크포인트 경로 시각화 구조
-- ============================================================

-- 확장 (uuid 생성용)
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. checkpoints: 순찰 경로의 고정 지점 (마스터 데이터)
--    ex) 현관 -> 책상/침대 -> 주방 (3~4개)
--    웹 대시보드에서 평면도 위에 순서대로 점을 찍어 표시하기 위한 좌표 포함
-- ------------------------------------------------------------
create table if not exists checkpoints (
  id uuid primary key default gen_random_uuid(),
  name text not null,                -- 예: '현관', '책상', '주방'
  order_index int not null unique,   -- 순찰 순서 (1,2,3,4...)
  pos_x numeric not null,            -- 평면도 기준 상대 좌표 (0~100, %)
  pos_y numeric not null,            -- 평면도 기준 상대 좌표 (0~100, %)
  created_at timestamptz not null default now()
);

comment on table checkpoints is '순찰 체크포인트 마스터 목록 (좌표는 원룸 평면도 위 상대 위치 %)';

-- ------------------------------------------------------------
-- 2. robot_status: 로봇의 현재 상태 (단일 row 로 운영 권장)
-- ------------------------------------------------------------
create table if not exists robot_status (
  id uuid primary key default gen_random_uuid(),
  state text not null default '정지' check (state in ('순찰중', '정지', '이동중', '장애물회피중')),
  current_checkpoint_id uuid references checkpoints(id),
  next_checkpoint_id uuid references checkpoints(id),
  last_updated timestamptz not null default now()
);

comment on table robot_status is '로봇 현재 상태. 실시간 갱신 대상 (Realtime 구독)';

-- ------------------------------------------------------------
-- 3. camera_logs: 촬영 이미지 로그
--    event_id / sequence_in_event: 위험 감지 시 이벤트 버스트 캡처(전/후) 묶음용
-- ------------------------------------------------------------
create table if not exists camera_logs (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,                 -- Supabase Storage 경로
  checkpoint_id uuid references checkpoints(id),
  event_id uuid,                           -- null = 평소 정기 촬영, 값 있음 = 이벤트(위험감지) 묶음
  sequence_in_event int,                   -- 0=최초 감지, 1~n=후속 촬영
  captured_at timestamptz not null default now()
);

comment on table camera_logs is '촬영 로그. event_id로 위험 감지 전후 사진을 그룹핑';
create index if not exists idx_camera_logs_event on camera_logs(event_id);
create index if not exists idx_camera_logs_captured_at on camera_logs(captured_at desc);

-- ------------------------------------------------------------
-- 4. ai_analysis: Gemini 분석 결과
-- ------------------------------------------------------------
create table if not exists ai_analysis (
  id uuid primary key default gen_random_uuid(),
  camera_log_id uuid not null references camera_logs(id) on delete cascade,
  summary text not null,
  risk_level text not null check (risk_level in ('안전', '주의', '위험')),
  risk_reason text,
  created_at timestamptz not null default now()
);

comment on table ai_analysis is 'Gemini 체크리스트 분석 결과 (문열림/쓰러짐/침입/화재)';
create index if not exists idx_ai_analysis_risk on ai_analysis(risk_level);
create index if not exists idx_ai_analysis_created_at on ai_analysis(created_at desc);

-- ------------------------------------------------------------
-- 5. movement_logs: 이동/경로 기록 (경로 시각화의 핵심 데이터)
--    체크포인트 도착 순서대로 쌓이므로, 이 로그를 시간순 정렬하면
--    "로봇이 지나온 경로"를 웹에서 선으로 그릴 수 있음
-- ------------------------------------------------------------
create table if not exists movement_logs (
  id uuid primary key default gen_random_uuid(),
  checkpoint_id uuid not null references checkpoints(id),
  obstacle_avoided boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table movement_logs is '체크포인트 도착 기록. 시간순 정렬 시 순찰 경로(이동 이력) 재구성 가능';
create index if not exists idx_movement_logs_created_at on movement_logs(created_at desc);

-- ------------------------------------------------------------
-- 초기 데이터 예시 (체크포인트 3~4개, 원룸 예시)
-- 실제 순찰 시연 공간에 맞춰 좌표는 조정해서 사용
-- ------------------------------------------------------------
insert into checkpoints (name, order_index, pos_x, pos_y) values
  ('현관', 1, 10, 85),
  ('책상', 2, 70, 20),
  ('침대', 3, 20, 20),
  ('주방', 4, 80, 80)
on conflict (order_index) do nothing;

-- robot_status 초기 1 row (단일 로봇 기준)
insert into robot_status (state, current_checkpoint_id, next_checkpoint_id)
select '정지', c1.id, c2.id
from checkpoints c1, checkpoints c2
where c1.order_index = 1 and c2.order_index = 2
on conflict do nothing;

-- ------------------------------------------------------------
-- Realtime 활성화 (웹 대시보드 자동 갱신 대상)
-- ------------------------------------------------------------
alter publication supabase_realtime add table robot_status;
alter publication supabase_realtime add table camera_logs;
alter publication supabase_realtime add table ai_analysis;
alter publication supabase_realtime add table movement_logs;

-- ------------------------------------------------------------
-- RLS (Row Level Security)
-- 이 프로젝트는 로그인/인증 없는 관찰 전용 대시보드이므로
-- 우선 읽기는 전체 허용, 쓰기는 서버(FastAPI, service_role key)만 허용
-- ------------------------------------------------------------
alter table checkpoints enable row level security;
alter table robot_status enable row level security;
alter table camera_logs enable row level security;
alter table ai_analysis enable row level security;
alter table movement_logs enable row level security;

create policy "public read checkpoints" on checkpoints for select using (true);
create policy "public read robot_status" on robot_status for select using (true);
create policy "public read camera_logs" on camera_logs for select using (true);
create policy "public read ai_analysis" on ai_analysis for select using (true);
create policy "public read movement_logs" on movement_logs for select using (true);

-- 쓰기(insert/update)는 service_role key로만 (FastAPI 서버 전용) → 별도 정책 불필요
-- service_role은 RLS를 우회하므로 위 read 정책만으로 충분
