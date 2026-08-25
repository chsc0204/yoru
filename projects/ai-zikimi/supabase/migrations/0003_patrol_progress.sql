-- ============================================================
-- 아이지킴이 (AI-Zikimi) 추가 스키마
-- STEP: 지그재그 순찰 진행 상태(줄 번호/완주 횟수) + 사람·동물 감지 플래그
-- ============================================================

alter table robot_status
  add column if not exists current_row_index int,
  add column if not exists patrol_count int not null default 0;

comment on column robot_status.current_row_index is '지그재그 순찰 중 현재 몇 번째 줄을 지나는지 (0부터 시작)';
comment on column robot_status.patrol_count is '지그재그 패턴을 출발점->도착점까지 완주한 누적 횟수 (일자별 리셋 없음)';

alter table ai_analysis
  add column if not exists person_detected boolean not null default false;

comment on column ai_analysis.person_detected is 'Gemini 체크리스트의 낯선 사람/동물 감지(stranger_or_animal) 결과';

create index if not exists idx_ai_analysis_person_detected on ai_analysis(person_detected);
