# 아이지킴이 (AI-Zikimi)

원룸을 지그재그로 순찰하며 촬영한 사진을 Gemini로 분석해 위험 상황(문 열림/낙상/침입/화재)을
감지하고, 실시간 웹 대시보드로 알려주는 AI 순찰 로봇 시스템입니다. 2인 팀 프로젝트로 진행 중입니다.

## 소개

집에 사람이 없는 시간에도 로봇이 대신 원룸을 순찰하면서, 60초 간격으로 사진을 찍어 서버로
보냅니다. 서버는 사진을 Gemini에 보내 "문이 열려 있는지 / 바닥에 쓰러진 물체가 있는지 /
사람이나 동물이 있는지 / 화재 위험이 있는지" 4가지 체크리스트를 판정하고, 위험(주의/위험)이
감지되면 로봇이 같은 자리에서 추가로 3장을 더 찍어(버스트 촬영) 상황을 더 정확히 기록합니다.
모든 촬영/분석 결과는 Supabase에 저장되고, 웹 대시보드에서 Realtime으로 즉시 확인할 수 있습니다.

## 사용 기술

- **하드웨어**: ESP32-S3 Sense(카메라) → Raspberry Pi(이동 제어/센서/통신)
- **백엔드**: FastAPI (Python) — 이미지 수신, Gemini 분석 오케스트레이션, Supabase 연동
- **AI**: Google Gemini API (`gemini-3.5-flash-lite`) — 구조화 출력(JSON Schema)으로 체크리스트 판정
- **DB / Storage / Realtime**: Supabase (PostgreSQL + Row Level Security + Storage + Realtime 구독)
- **프론트엔드**: Next.js (App Router) + TypeScript + Tailwind CSS + Recharts
- **원격 테스트**: Cloudflare Tunnel — 로컬 서버를 임시 공개 URL로 노출해 하드웨어 담당(B)과 통신 테스트

## 시스템 구조

```
ESP32-S3 Sense (카메라)
        │ 촬영
        ▼
Raspberry Pi (이동 제어 / 센서 / 통신)
        │ HTTP POST (multipart/form-data)
        ▼
FastAPI 서버 ── Gemini API (이미지 분석, 구조화 JSON 출력)
        │
        ├─→ Supabase Storage (원본 이미지 저장)
        └─→ Supabase Postgres (camera_logs / ai_analysis / robot_status 등)
                    │ Realtime 구독
                    ▼
          Next.js 웹 대시보드 (실시간 순찰 현황 / 위험 알림 / 히스토리)
```

## 현재 진행 상황

| STEP | 내용 | 상태 |
|---|---|---|
| 1 | 웹 대시보드 뼈대 (Next.js, 레이아웃/네비게이션) | ✅ 완료 |
| 2 | Supabase 스키마 설계 (checkpoints/robot_status/camera_logs/ai_analysis 등) | ✅ 완료 |
| 3 | Storage 이미지 업로드 연동 | ✅ 완료 |
| 4 | Gemini 이미지 분석 연동 (체크리스트 4항목 + 구조화 출력) | ✅ 완료 |
| 5 | FastAPI 이미지 수신 API (`POST /api/v1/images`) | ✅ 완료 |
| 6 | 전체 파이프라인 연결 (촬영 → 분석 → 저장 → 대시보드 표시) | ✅ 완료 |
| 6.5 | 이벤트 버스트 촬영 (위험 감지 시 전/후 추가 촬영 3장) | ✅ 완료 |
| 7 | Supabase Realtime 자동 갱신 (대시보드 실시간 반영) | ✅ 완료 |
| 여유 작업 | 순찰 경로 시각화(체크포인트 좌표 기반 지도), 설정 화면(민감도/알림) 서버 연동 | ✅ 완료 |
| 8 | 하드웨어(ESP32-S3 Sense + Raspberry Pi) 통합 | ⏳ 대기 중 (하드웨어 배송 지연) |

소프트웨어 파이프라인(카메라 입력을 제외한 전 구간)은 목업 이미지와 Cloudflare Tunnel을 통한
원격 테스트로 이미 동작을 검증했고, 실제 하드웨어가 도착하는 대로 STEP 8을 진행할 예정입니다.

## 팀 역할 분담

- **A (본인)**: 웹 대시보드(Next.js), FastAPI 서버, Gemini 연동, Supabase 데이터 설계/운영
- **B**: 하드웨어 담당 — 이동 제어 / 센서 / 카메라 / 통신 4단계로 세분화해서 진행
  - 원래 3인 체제로 계획했으나 하드웨어 배송 지연으로 역할을 재조정해 2인(A/B) 체제로 확정

## 이 폴더에 들어있는 것

전체 소스코드(서버/웹/하드웨어 제어 코드)는 아직 진행 중인 별도 작업 저장소에서 관리하고 있고,
여기에는 프로젝트를 소개하는 핵심 산출물만 정리해뒀습니다.

```
ai-zikimi/
├── README.md                              — 이 문서
├── 아이지킴이_기획서_v4.pdf                 — 기획서 (최신 버전)
├── docs/
│   └── api-contract.md                    — 하드웨어(B) ↔ 서버 이미지 수신 API 명세
└── supabase/
    └── migrations/                        — DB 스키마 변경 이력 (0001~0004)
        ├── 0001_init.sql                  — checkpoints/robot_status/camera_logs/ai_analysis 등 초기 테이블
        ├── 0002_settings.sql              — 민감도/알림 설정 테이블
        ├── 0003_patrol_progress.sql       — 지그재그 순찰 진행 상태 + 사람·동물 감지 플래그
        └── 0004_rename_person_detected.sql — 필드명 명확화 (person_detected → stranger_or_animal_detected)
```

## 개발 중 발견하고 해결한 버그

- **`event_id` 형식 미검증으로 인한 500 에러**: 버스트 촬영 중 잘못된 `event_id`가 들어오면
  서버가 처리하지 못해 500을 내려주던 것을, uuid 형식 검증을 추가해 `400 Bad Request` + 명확한
  에러 메시지로 개선
- **`stranger_or_animal_detected` 필드명 오매핑**: Gemini는 "사람 또는 동물"을 구분 없이 하나의
  값으로 판단하는데, DB/API 필드명이 `person_detected`로 되어 있어 "사람만 감지"하는 것처럼
  오해를 일으킴 — DB 컬럼/API 응답/웹 화면까지 일관되게 `stranger_or_animal_detected`로 이름을
  명확히 함
- **"낯선지 익숙한지" 판단 프롬프트 개선**: 아이가 노는 사진은 `false`, 성인이 일하는 사진은
  `true`로 나오는 등 판단이 일관되지 않아, "이 공간은 무인 상태가 정상이므로 낯선지 여부와
  무관하게 사람/동물이 있으면 무조건 감지로 판단"하도록 프롬프트를 구체화
- **Gemini 무료 티어 쿼터 소진**: 초기 사용 모델의 무료 티어 일일 요청 한도가 20건에 불과해
  테스트 중 금방 소진되는 것을 발견 — 실제 API 호출/공식 자료로 검증한 뒤 `gemini-3.5-flash-lite`
  (RPM 15 / RPD 500)로 전환

## 테스트

- Gemini 체크리스트 4항목(문 열림 / 바닥 이상 / 사람·동물 / 화재 위험)을 실제 이미지로 개별
  테스트해 판정 정확도 확인
- Cloudflare Tunnel로 로컬 FastAPI/Next.js 서버를 임시 공개 URL로 노출해, 하드웨어 담당(B)이
  원격에서 실제 엔드포인트를 호출해보는 통합 테스트 진행

## 향후 계획

- ESP32-S3 Sense + Raspberry Pi 하드웨어 도착 후 STEP 8(실기기 통합) 진행
- Gemini 요청 쿼터(RPD 500) 내에서 순찰 주기를 어떻게 운영할지 정책 확정 (현재 60초 주기 기준
  하루 최대 운영 가능 시간은 약 8시간 20분)
