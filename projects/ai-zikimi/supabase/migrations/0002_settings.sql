-- ============================================================
-- 아이지킴이 (AI-Zikimi) 추가 스키마
-- 여유 시간 작업: 설정(민감도/알림) 실제 연동
-- ============================================================

-- 단일 row로 운영. 민감도는 FastAPI가 Gemini 프롬프트에 반영하므로 서버가 읽을 수 있어야 하고,
-- 알림 on/off는 웹 대시보드 여러 탭/기기 간에도 동일하게 보이도록 DB에 저장한다 (localStorage 대신).
create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  sensitivity text not null default '보통' check (sensitivity in ('낮음', '보통', '높음')),
  notifications_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

comment on table settings is '순찰 민감도 / 알림 표시 여부 설정. 단일 row로 운영';

do $$
begin
  if not exists (select 1 from settings) then
    insert into settings (sensitivity, notifications_enabled) values ('보통', true);
  end if;
end $$;

alter publication supabase_realtime add table settings;

alter table settings enable row level security;

create policy "public read settings" on settings for select using (true);

-- 쓰기(update)는 service_role key로만 (FastAPI 서버 전용) → 별도 정책 불필요
