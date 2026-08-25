# 아이지킴이 이미지 수신 API 계약 (B담당 하드웨어 연동용)

라즈베리파이(B담당)가 촬영한 이미지를 서버로 보낼 때 사용하는 API 명세다. Storage 업로드, Gemini 분석,
DB 저장은 서버(A담당)가 전부 처리하므로 B는 아래 요청/응답 형식만 지키면 된다.

## 엔드포인트

```
POST http://<서버 주소>:8000/api/v1/images
```

- 개발 중(로컬 테스트): `http://localhost:8000/api/v1/images`
- 실제 배치(FastAPI를 라즈베리파이에서 구동): `http://<라즈베리파이 IP>:8000/api/v1/images`

> **Gemini 무료 티어 요청 한도 (2026-08-25 AI Studio 대시보드 확인)**
> 현재 `GEMINI_MODEL=gemini-3.5-flash-lite`, 무료 티어 한도는 **RPM 15 / RPD 500**.
> 60초 간격 평소 순찰만으로도 하루 1,440건 촬영이 나오므로, 하루 약 8시간 20분치 분량(500건)을 쓰고 나면
> 그날 남은 시간은 Gemini 호출이 전부 실패해 `risk_level: "주의"` 폴백 응답만 내려온다. B는 이걸 실제 위험
> 감지와 혼동하지 않도록 유의할 것.

## 평소 촬영 동작 (기본 순찰)

- **위험이 감지되지 않는 한, 60초 간격으로 알아서 촬영해서 이 엔드포인트로 보낸다.** `event_id`는 붙이지 않는다.
- 서버가 촬영 이미지를 분석한 뒤, 위험(주의/위험)이 감지되면 응답에 `event_id`와 `next_capture_interval_sec`을 내려준다.
  이때부터는 "평소 60초 주기"를 잠시 멈추고 버스트 후속 촬영 흐름으로 들어간다 (아래 참고).
- 응답의 `next_capture_interval_sec`이 `null`이면 버스트가 끝났거나 애초에 위험이 없었다는 뜻이므로,
  다시 평소 60초 주기로 복귀한다.

## 요청 (`multipart/form-data`)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `file` | 이미지 파일 (jpeg/png) | ✅ | 촬영 사진 |
| `checkpoint` | 텍스트 | ✅ | 체크포인트 **이름** (예: `"현관"`, `"책상"`, `"침대"`, `"주방"`) — uuid 아님, `checkpoints` 테이블에 등록된 이름 그대로 |
| `event_id` | uuid 텍스트 | 선택 | 이전 응답에서 받은 `event_id`. 평소 촬영 시엔 **생략**. 버스트 후속 촬영일 때만 포함 |

## 응답 (`application/json`)

| 필드 | 타입 | 설명 |
|---|---|---|
| `camera_log_id` | string (uuid) | 저장된 촬영 로그 id |
| `image_url` | string | Storage에 저장된 이미지 public URL |
| `checkpoint` | string | 요청에 보낸 체크포인트 이름 그대로 |
| `event_id` | string \| null | 위험 감지로 새로 발급된 이벤트 id. `null`이면 평소 촬영(위험 없음) |
| `sequence_in_event` | number \| null | `0`=최초 감지, `1`~`3`=후속 촬영 순번. `event_id`가 `null`이면 이 값도 `null` |
| `burst_remaining` | number | 남은 후속 촬영 수. `0`이면 버스트가 없거나 끝났다는 뜻 |
| `next_capture_interval_sec` | number \| null | 다음 촬영까지 대기할 시간(초, 8~10 사이). **`null`이면 평소 주기(60초)로 복귀** |
| `analysis` | object \| null | Gemini 분석 결과. `sequence_in_event`가 `2`,`3`일 때는 재분석하지 않으므로 `null` |
| `analysis.summary` | string | 상황 요약 |
| `analysis.risk_level` | `"안전"` \| `"주의"` \| `"위험"` | 위험도 |
| `analysis.risk_reason` | string \| null | 위험 판단 이유 (안전이면 `null`) |
| `analysis.stranger_or_animal_detected` | boolean | 낯선 사람 또는 동물 감지 여부. **사람과 동물을 구분하지 않는 값**이라 동물만 있어도 `true`가 될 수 있음 |

## 버스트(위험 감지 후속 촬영) 동작 흐름

1. 평소 촬영(`event_id` 없이 전송) → 응답의 `analysis.risk_level`이 `"주의"`/`"위험"`이면 서버가 `event_id`를 새로 발급해 응답에 담아준다.
2. `next_capture_interval_sec`(8~10초) 만큼 대기한 뒤, **같은 `event_id`** 를 붙여서 다시 이미지를 보낸다.
3. 서버가 자동으로 `sequence_in_event`를 계산해서 올려준다 (`1` → `2` → `3`). B는 순번을 직접 셀 필요 없음, 그냥 같은 `event_id`로 계속 보내면 된다.
4. `sequence_in_event`가 `1`일 때만 재분석(`analysis` 있음), `2`·`3`은 저장만 하고 `analysis: null`이 온다.
5. `burst_remaining`이 `0`이 되고 `next_capture_interval_sec`이 `null`로 오면 버스트가 끝난 것 — 평소 60초 주기 촬영으로 복귀한다.
6. 버스트가 끝난 `event_id`로 다시 보내면 `400` 에러가 난다 (아래 에러 케이스 참고). 정상 흐름에서는 발생하지 않아야 한다.

## 예시

### 1) 평소 촬영 (위험 없음)

```bash
curl -X POST http://localhost:8000/api/v1/images \
  -F "file=@capture.jpg;type=image/jpeg" \
  -F "checkpoint=현관"
```

```json
{
  "camera_log_id": "f6c13fd1-83aa-4f30-802b-ea18213aab7f",
  "image_url": "https://xxxx.supabase.co/storage/v1/object/public/camera-images/.../capture.jpg",
  "checkpoint": "현관",
  "event_id": null,
  "sequence_in_event": null,
  "burst_remaining": 0,
  "next_capture_interval_sec": null,
  "analysis": {
    "summary": "화면에 특별한 물체나 위험 요소가 감지되지 않은 평온한 상태입니다.",
    "risk_level": "안전",
    "risk_reason": null,
    "stranger_or_animal_detected": false
  }
}
```

→ `next_capture_interval_sec`이 `null`이므로 60초 뒤 평소대로 다음 촬영.

### 2) 위험 감지 (최초, 버스트 시작)

```bash
curl -X POST http://localhost:8000/api/v1/images \
  -F "file=@capture.jpg;type=image/jpeg" \
  -F "checkpoint=현관"
```

```json
{
  "camera_log_id": "a1b2c3d4-...",
  "image_url": "https://xxxx.supabase.co/storage/v1/object/public/camera-images/.../capture.jpg",
  "checkpoint": "현관",
  "event_id": "e5f6a7b8-1234-4c5d-9e0f-abcdef123456",
  "sequence_in_event": 0,
  "burst_remaining": 3,
  "next_capture_interval_sec": 9,
  "analysis": {
    "summary": "현관문이 열려 있고 문 앞에 낯선 상자가 놓여 있습니다.",
    "risk_level": "주의",
    "risk_reason": "현관문 개방 상태가 감지되었습니다.",
    "stranger_or_animal_detected": false
  }
}
```

→ 9초 대기 후, **응답의 `event_id`를 그대로 붙여서** 후속 촬영을 보낸다.

### 3) 버스트 후속 촬영 (`event_id` 포함)

```bash
curl -X POST http://localhost:8000/api/v1/images \
  -F "file=@capture2.jpg;type=image/jpeg" \
  -F "checkpoint=현관" \
  -F "event_id=e5f6a7b8-1234-4c5d-9e0f-abcdef123456"
```

```json
{
  "camera_log_id": "b2c3d4e5-...",
  "image_url": "https://xxxx.supabase.co/storage/v1/object/public/camera-images/.../capture2.jpg",
  "checkpoint": "현관",
  "event_id": "e5f6a7b8-1234-4c5d-9e0f-abcdef123456",
  "sequence_in_event": 2,
  "burst_remaining": 1,
  "next_capture_interval_sec": 8,
  "analysis": null
}
```

→ `sequence_in_event`가 `2`라 `analysis`는 `null`(저장만 함). `burst_remaining`이 `1`이니 한 번 더 후속 촬영 필요.

## 에러 케이스

| 상황 | 응답 |
|---|---|
| `file`이 이미지가 아님 | `400 { "detail": "이미지 파일만 업로드할 수 있습니다." }` |
| `file`이 비어있음 | `400 { "detail": "빈 파일은 업로드할 수 없습니다." }` |
| `checkpoint` 필드 누락 | `422 Unprocessable Entity` (FastAPI 기본 유효성 검증 오류) |
| **버스트가 이미 끝난 `event_id`로 다시 요청** | `400 { "detail": "이 이벤트는 이미 후속 촬영이 모두 끝났습니다." }` — `burst_remaining`이 `0`으로 온 이후엔 같은 `event_id`를 재사용하지 말 것 |
| `event_id`가 uuid 형식이 아님 (예: `/docs`에서 placeholder `"string"`을 안 지우고 보냄) | `400 { "detail": "event_id는 유효한 uuid 형식이어야 합니다." }` — 평소 촬영이면 `event_id` 필드를 아예 비워서 보낼 것 |

## 순찰 상태 보고 (지그재그 순찰 진행 상태)

```
PATCH http://<서버 주소>:8000/api/v1/robot-status
```

지그재그 패턴으로 순찰 중인 로봇이 몇 번째 줄을 지나는지, 한 바퀴를 완주했는지를
서버에 보고한다. 웹 대시보드의 "N번째 줄 진행 중", "오늘 순찰 N바퀴" 표시가 이 값을 반영한다.
`hardware/patrol_route.py`의 `run_sweep_patrol()`이 각 줄이 끝날 때마다(=사진 촬영 시점) 호출한다.

### 요청 (`application/json`)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `state` | 텍스트 | ✅ | `"순찰중"` \| `"정지"` \| `"이동중"` \| `"장애물회피중"` 중 하나 |
| `current_row_index` | number \| null | 선택 | 현재 지나는 줄 번호 (0부터 시작) |
| `lap_completed` | boolean | 선택 (기본 `false`) | 이번 보고로 지그재그 한 바퀴(출발점->도착점)를 완주했으면 `true`. `true`면 서버가 `patrol_count`를 1 올린다 |

### 응답 (`application/json`)

```json
{
  "id": "robot_status row의 uuid",
  "state": "이동중",
  "current_row_index": 2,
  "patrol_count": 5,
  "last_updated": "2026-08-24T05:12:00.000Z"
}
```

### 예시

```bash
curl -X PATCH http://localhost:8000/api/v1/robot-status \
  -H "Content-Type: application/json" \
  -d '{"state": "이동중", "current_row_index": 2, "lap_completed": false}'
```

완주 시:

```bash
curl -X PATCH http://localhost:8000/api/v1/robot-status \
  -H "Content-Type: application/json" \
  -d '{"state": "정지", "current_row_index": null, "lap_completed": true}'
```
