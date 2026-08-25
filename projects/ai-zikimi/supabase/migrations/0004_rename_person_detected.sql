-- ============================================================
-- 아이지킴이 (AI-Zikimi) 스키마 수정
-- STEP: person_detected 컬럼명을 stranger_or_animal_detected로 변경
--   (Gemini가 "낯선 사람 또는 동물"을 구분 없이 하나의 값으로 판단하는데
--    "person_detected"라는 이름이 사람만 감지하는 것처럼 오해를 일으켜 개명함.
--    사람/동물 구분 판단 자체는 현재 계획에 없음)
-- ============================================================

alter table ai_analysis
  rename column person_detected to stranger_or_animal_detected;

alter index if exists idx_ai_analysis_person_detected
  rename to idx_ai_analysis_stranger_or_animal_detected;

comment on column ai_analysis.stranger_or_animal_detected is 'Gemini 체크리스트의 낯선 사람/동물 감지(stranger_or_animal) 결과 (사람과 동물을 구분하지 않음)';
