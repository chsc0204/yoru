# 오늘 배운 내용 복습

## 1. (2026-08-13) 파일/폴더 정리 및 확장자별 분류

### 핵심 개념
- 컴퓨터의 모든 파일은 **확장자**(파일명 뒤의 `.png`, `.pdf`, `.zip` 같은 부분)로 종류를 구분할 수 있다.
- 파이썬의 `pathlib.Path`를 쓰면 폴더 안의 파일 목록을 가져오고, 원하는 위치로 옮길 수 있다.
- 확장자 → 카테고리(이미지/문서/데이터 등) 매핑 표를 만들어두면, 어떤 폴더든 같은 기준으로 자동 정리할 수 있다.
- 실수로 중요한 파일을 옮기면 안 되므로, **먼저 미리보기(dry-run)로 계획을 보여주고, 확인 후에 실제로 이동**하는 습관이 안전하다.

### 실제 사용한 코드 예시
```python
from pathlib import Path
import shutil

CATEGORIES = {
    "images": [".png", ".jpg", ".jpeg"],
    "documents": [".pdf", ".docx", ".txt"],
    "data": [".csv", ".xlsx", ".json"],
}

def category_for(ext):
    for name, exts in CATEGORIES.items():
        if ext.lower() in exts:
            return name
    return "기타"

target_dir = Path(r"C:\Users\최현수\Desktop\분류용")
for f in target_dir.iterdir():
    if f.is_file():
        category = category_for(f.suffix)
        dest_dir = target_dir / category
        dest_dir.mkdir(exist_ok=True)
        shutil.move(str(f), str(dest_dir / f.name))
```

### 실습 요약
- `분류용` 폴더의 파일들을 `images / documents / data / installers / archives` 폴더로 자동 분류
- 나중에 새 파일이 들어와도 스크립트를 다시 실행하면 같은 기준으로 정리됨

---

## 2. (2026-08-13) Git/GitHub 사용법 (init, add, commit, push)

### 핵심 개념
| 명령어 | 의미 |
| --- | --- |
| `git init` | 현재 폴더를 Git이 관리하는 저장소로 만든다 (버전 관리 시작) |
| `git add <파일>` | 변경된 파일을 "커밋할 후보"로 등록(스테이징)한다 |
| `git commit -m "메시지"` | 스테이징된 내용을 하나의 저장 지점(커밋)으로 기록한다 |
| `git remote add origin <URL>` | 내 로컬 저장소와 GitHub의 원격 저장소를 연결한다 |
| `git push -u origin main` | 로컬 커밋 내용을 GitHub 저장소로 업로드한다 |

- `git add`와 `git commit`은 **로컬(내 컴퓨터)** 에서만 일어나는 작업이고, `git push`를 해야 실제로 GitHub에 반영된다.
- 커밋에는 "누가 저장했는지"가 필요해서, 처음 한 번은 `git config user.name`, `git config user.email`로 사용자 정보를 설정해야 한다.
- `.gitignore` 파일에 이름을 적어두면 그 파일/폴더(예: `__pycache__/`)는 Git이 추적하지 않는다.

### 실제 사용한 명령어
```bash
git init
git add snake_game.py
git config user.name "chsc0204"
git config user.email "chsc0204@gmail.com"
git commit -m "Add snake game"
git remote add origin https://github.com/chsc0204/yoru.git
git branch -M main
git push -u origin main
```

### 실습 요약
- `power sell` 폴더를 Git 저장소로 초기화
- `snake_game.py`를 커밋해서 GitHub 저장소(`yoru`)에 처음으로 푸시

---

## 3. (2026-08-13) pygame으로 snake_game.py 만들기 실습

### 핵심 개념
- **게임 루프**: `while True:` 안에서 (1) 키보드 입력 처리 → (2) 게임 상태 업데이트 → (3) 화면 그리기를 반복하는 구조가 대부분의 2D 게임의 기본 뼈대다.
- **좌표계**: 화면을 칸(그리드) 단위로 나누고, 뱀의 몸을 `(x, y)` 좌표 리스트로 표현한다. 머리를 앞에 추가하고 꼬리를 제거하면 "이동"이 된다.
- **충돌 판정**: 벽 밖으로 나가거나, 자기 몸 좌표와 새 머리 좌표가 같으면 게임 오버로 처리한다.
- **입력 반응성과 이동 속도 분리**: 화면 갱신(FPS)과 뱀이 실제로 움직이는 속도를 하나로 묶으면 키 입력이 느리게 느껴진다. 그래서 화면/입력은 60FPS로 자주 확인하고, 뱀의 이동만 `pygame.time.get_ticks()`로 별도 타이머를 둬서 "초당 몇 칸 이동" 속도를 따로 조절했다.

### 실제 사용한 코드 예시 (핵심 부분만)
```python
# 방향 큐: 빠르게 연속으로 키를 눌러도 순서대로 반영
if event.type == pygame.KEYDOWN and event.key in DIRECTIONS:
    direction_queue.append(DIRECTIONS[event.key])

# 이동은 별도 타이머로 (입력 반응성과 분리)
now = pygame.time.get_ticks()
if now - last_move_time >= 1000 / moves_per_sec:
    last_move_time = now
    if direction_queue:
        direction = direction_queue.pop(0)
    new_head = (head[0] + direction[0], head[1] + direction[1])
    if not (0 <= new_head[0] < GRID_WIDTH and 0 <= new_head[1] < GRID_HEIGHT):
        return score  # 벽 충돌 -> 게임 오버
    if new_head in snake:
        return score  # 자기 몸 충돌 -> 게임 오버
```

### 실습 요약
- `snake_game.py` 완성: 방향키/WASD 조작, 먹이를 먹을수록 점수 상승 및 속도 증가, 게임 오버 후 R키로 재시작
- 처음 만들었을 때 "반응이 느리다"는 문제를 발견하고, 이동 로직과 입력 폴링을 분리해서 해결

---

## 4. (2026-08-18) FastAPI (백엔드 서버)

### 핵심 개념
- GET 라우트로 가장 단순한 서버 만들기
- Pydantic `BaseModel`로 요청 데이터 형식(스키마)을 정의 — 잘못된 타입/필드가 오면 FastAPI가 자동으로 검증해서 422 에러를 돌려준다
- POST/GET으로 데이터 저장·조회 API 구현
- `/docs`(Swagger UI)로 API 직접 테스트하는 법 — 코드를 작성하면 별도 문서화 없이도 브라우저에서 각 라우트를 클릭해 바로 호출해볼 수 있다

### 실제 사용한 코드 예시
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="미니 장바구니 API")

class CartCreateRequest(BaseModel):
    product_id: int

@app.get("/products")
def get_products():
    ...

@app.post("/cart")
def add_to_cart(payload: CartCreateRequest):
    ...  # payload.product_id 는 이미 int로 검증된 값
```

### 실습 요약
- FastAPI로 `GET /products`, `GET /cart`, `POST /cart`, `PATCH /cart/{id}`, `DELETE /cart/{id}`, `DELETE /cart` 총 6개 라우트 구현
- `http://127.0.0.1:8001/docs`에서 Swagger UI로 각 API를 직접 호출해보며 정상 동작(수량 증가, 404/400 에러 등) 확인

---

## 5. (2026-08-18) SQLite (데이터베이스)

### 핵심 개념
- `sqlite3` 모듈만으로 별도 DB 서버 설치 없이 파일 하나(`.db`)로 바로 데이터베이스를 사용할 수 있다
- `CREATE TABLE IF NOT EXISTS`로 테이블 생성, `INSERT`/`SELECT`/`UPDATE`/`DELETE`로 데이터 삽입·조회·수정·삭제
- Python 코드에서 DB 연동하는 기본 흐름: 커넥션 열기 → SQL 실행 → `commit()`으로 저장 → 커넥션 닫기

### 실제 사용한 코드 예시
```python
import sqlite3

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

conn = get_connection()
conn.execute(
    """
    CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1
    )
    """
)
conn.commit()
```

### 실습 요약
- `products`, `cart` 두 테이블을 SQLite에 생성하고, 서버 시작 시 상품 4종(노트북/키보드/마우스/헤드셋)을 자동으로 채워두는 초기화 로직 작성
- 장바구니 담기·수량 변경·삭제 API가 실제로 `shop.db` 파일에 반영되는지 직접 쿼리로 조회해서 확인

---

## 6. (2026-08-18) 미니 장바구니 프로젝트 (종합 실습)

### 핵심 개념
- Next.js(프론트) + FastAPI(백엔드) + SQLite(DB)로 이어지는 풀스택 구조를 처음부터 끝까지 직접 구성
- REST API 설계: 하나의 자원(`/cart`)에 대해 GET(조회)/POST(생성)/PATCH(부분 수정)/DELETE(삭제)를 역할에 맞게 나눠서 설계
- CORS 설정으로 프론트-백엔드 통신 연결 — 프론트(`localhost:3000`)와 백엔드(`localhost:8001`)는 포트가 달라 브라우저 기준으로 "다른 출처"이기 때문에, 백엔드에 `CORSMiddleware`로 프론트 주소를 허용해줘야 API 호출이 막히지 않는다
- 프론트엔드에서 API 호출해 화면 갱신하는 흐름: 버튼 클릭 → `fetch`로 백엔드 호출 → 성공하면 최신 장바구니 목록을 다시 `fetch` → 상태(`useState`) 업데이트로 화면이 자동으로 다시 그려짐

### 실제 사용한 코드 예시
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
```tsx
const handleAddToCart = async (productId: number) => {
  const res = await fetch(`${API_BASE_URL}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId }),
  });
  if (!res.ok) throw new Error("장바구니 추가에 실패했습니다.");
  await fetchCart(); // 최신 장바구니로 화면 갱신
};
```

### 실습 요약
- 상품 목록 조회, 장바구니 담기/삭제, 수량 변경(+/−), 중복 상품 자동 수량 증가, 장바구니 비우기, 총 금액 자동 계산까지 기능 완성
- 애플 스타일(넓은 여백, 은은한 그림자, 포인트 컬러 하나, hover 애니메이션)로 프론트엔드 디자인 다듬기
- 완성한 프로젝트를 기존 GitHub 포트폴리오 저장소(`yoru`)의 `projects/mini-cart/`에 정리해서 추가하고 README까지 작성

---

## 7. (2026-08-19) 외부 API 연동 실습 (날씨/대기질)

### 핵심 개념
- Open-Meteo API(무료, 인증키 불필요)로 날씨/대기질 조회
- Geocoding API로 도시명 → 위경도 변환 — 도시명만 알면 위경도를 몰라도 날씨/대기질을 조회할 수 있다
- 여러 API를 순차로 호출하면 한쪽이 느려도 전체가 그만큼 느려지므로, `ThreadPoolExecutor`로 동시에 호출하고 각각 타임아웃/예외를 개별 처리하면 한쪽이 실패하거나 늦어도 나머지 결과로 판단할 수 있다

### 실제 사용한 코드 예시
```python
def find_city(name):
    """도시 이름 -> (위도, 경도, 표시용 이름)"""
    r = requests.get(GEO, params={"name": name, "count": 1}, timeout=TIMEOUT)
    hit = r.json()["results"][0]
    return hit["latitude"], hit["longitude"], hit["name"] + ", " + hit["country_code"]

with ThreadPoolExecutor(max_workers=2) as pool:
    weather_future = pool.submit(get_weather, lat, lon)
    air_future = pool.submit(get_air, lat, lon)
    try:
        weather = weather_future.result(timeout=WAIT_LIMIT)
    except FutureTimeoutError:
        weather = None  # 타임아웃이 나도 프로그램 전체가 멈추지 않도록 처리
```

### 실습 요약
- `first_call.py`(연결 확인) → `show_json.py`(구조 탐색) → `weather.py`(날씨 조회) → `air.py`(대기질 조회) 순으로 단계별로 실습하며 API 응답 구조를 익힘
- `app.py`로 위 실습을 통합: 도시명 하나만 입력하면 Geocoding → 날씨/대기질을 병렬로 조회하고, 타임아웃/예외 처리 후 미세먼지·강수확률 기준으로 "외출 가능 여부"를 한 문장으로 판정
- 완성한 실습을 GitHub 포트폴리오 저장소(`yoru`)의 `projects/weather-air-api/`에 정리해서 추가

### app.py와 손코딩 비교분석

| 항목 | first_call.py | show_json.py | weather.py | air.py | app.py |
|---|---|---|---|---|---|
| 목적 | API 연결 확인 | 응답 구조 탐색 | 도시 검색+날씨 | 도시 검색+대기질 | 통합 종합 판정 |
| 위치 지정 | 서울 고정 | 서울 고정 | 도시명 입력 | 도시명 입력 | 도시명 입력 |
| 호출 API | 1개 | 1개 | 2개 | 2개 | 3개 |
| 요청 방식 | 단일 | 단일 | 순차 | 순차 | 병렬(ThreadPoolExecutor) |
| 에러 처리 | 없음 | 없음 | 없음 | 없음 | 있음(timeout 시 정보없음 처리) |
| 결과 형태 | 상태코드/텍스트 | JSON 원본 | 개별 수치 | 등급 판정 | 종합 결론 문장 |

---

## 8. (2026-08-19) Supabase 연동 (J-MUSE 프로젝트)

### 핵심 개념
- Supabase = PostgreSQL DB + Auth + API를 한 번에 제공하는 BaaS(Backend as a Service). 백엔드 서버를 직접 만들지 않고도 회원가입/로그인, DB CRUD를 바로 사용할 수 있다
- 여러 테이블이 서로 참조하는 관계형 스키마 설계: `profiles`/`artists`/`albums`/`songs`처럼 콘텐츠를 나누고, `posts`/`answers`/`likes`로 커뮤니티 기능을, `playlists`/`playlist_songs`로 다대다 관계(플레이리스트-곡)를 표현
- RLS(Row Level Security): 테이블 단위로 "누가 어떤 행을 읽고/쓸 수 있는지" 정책(policy)을 SQL로 정의한다. 정책이 없으면 기본적으로 접근이 막히므로, 로그인한 사용자만 자기 글을 쓸 수 있게 하는 등의 규칙을 직접 작성해야 한다
- SQL Editor에서 `schema.sql`(테이블 생성) → `policies.sql`(RLS 정책) → `seed.sql`(초기 데이터) 순서로 실행하는 것이 중요하다 — 정책은 테이블이 있어야 걸 수 있고, 초기 데이터는 정책이 허용해야 들어간다

### 실제 사용한 코드 예시
```sql
-- policies.sql: 로그인한 사용자만 자기 글을 쓸 수 있도록 제한
alter table posts enable row level security;

create policy "누구나 글 조회 가능"
  on posts for select
  using (true);

create policy "로그인한 사용자만 자기 글 작성 가능"
  on posts for insert
  with check (auth.uid() = author_id);
```
```tsx
// Supabase Auth로 회원가입
const { error } = await supabase.auth.signUp({ email, password });
```

### 실습 요약
- Vite + React + Tailwind + Supabase로 J-POP 커뮤니티 웹앱(J-MUSE) 제작
- `profiles`, `artists`, `albums`, `songs`, `posts`, `answers`, `likes`, `playlists`, `playlist_songs` 9개 테이블 설계 및 `schema.sql` → `policies.sql` → `seed.sql` 순서로 실행해 테이블 생성과 RLS 정책 적용
- 회원가입/로그인, 게시글 작성·조회 기능을 실제로 붙여보고, Table Editor와 SQL Editor에서 데이터가 실제로 반영되는지 직접 확인

---

## 9. (2026-08-20) Arduino 기초 실습 (LED / PIR 센서 / 패시브 부저)

### 핵심 개념
- `pinMode(pin, OUTPUT/INPUT)`으로 핀의 입출력 방향을 정한 뒤 `digitalWrite`/`digitalRead`로 값을 주고받는 것이 Arduino 프로그래밍의 기본 패턴이다.
- `tone(pin, frequency)`/`noTone(pin)`으로 피에조 부저에서 원하는 음(주파수)을 재생하거나 끌 수 있다.
- PIR 같은 디지털 센서는 감지되면 HIGH, 아니면 LOW를 돌려주는 단순한 스위치처럼 동작해서 `if(val==HIGH)` 분기로 손쉽게 반응시킬 수 있다.
- Tinkercad Circuits 시뮬레이터로 실제 부품 없이도 회로 연결과 코드 동작을 바로 테스트할 수 있다.

### 실제 사용한 코드 예시
```cpp
int ledPin=8;
int inputPin=7;
int val=0;

void loop()
{
  val=digitalRead(inputPin);
  if(val==HIGH){
    digitalWrite(ledPin,HIGH);
    Serial.println("Welcome!");
  }
  else{
    digitalWrite(ledPin,LOW);
    Serial.println("Nothing");
  }
  delay(1000);
}
```

### 실습 요약
- `LED_BUILTIN`을 1초 간격으로 켜고 끄는 기본 블링크, PIR 센서가 감지되면 LED를 켜고 시리얼 모니터에 "Welcome!"을 출력하는 실습, 패시브 부저로 C5→D5→E5 음을 순서대로 재생하는 실습까지 3개의 독립적인 기초 스케치 작성
- 완성한 실습을 GitHub 포트폴리오 저장소(`yoru`)의 `projects/arduino-basics/`에 정리해서 추가하고 README까지 작성

---

## 10. (2026-08-25) 아이지킴이(AI-Zikimi) — AI 순찰 로봇 시스템 (종합 프로젝트)

### 프로젝트 개요
원룸을 지그재그로 순찰하며 사람이 없는 시간대의 안전을 지켜주는 AI 로봇 시스템. `ESP32-S3 Sense(카메라) → Raspberry Pi(이동/센서/통신) → FastAPI 서버 → Gemini API(이미지 분석) → Supabase(DB/Storage/Realtime) → Next.js 웹 대시보드`로 이어지는 풀스택 파이프라인을 2인 팀(A: 웹/AI/데이터, B: 하드웨어)으로 진행 중인 프로젝트다.

### 핵심 개념
- **구조화 출력(Structured Output)**: Gemini에 `response_mime_type: application/json` + Pydantic 스키마(`response_schema`)를 함께 넘기면, 자유 텍스트가 아니라 정해진 JSON 필드(문열림/바닥위험/사람·동물/화재위험/요약/위험도)로만 답이 오도록 강제할 수 있다.
- **이벤트 버스트 촬영 설계**: 평소엔 60초 간격으로 한 장씩만 찍다가, 위험(주의/위험)이 감지되면 `event_id`를 새로 발급해 같은 이벤트로 묶고 8~10초 간격 후속 촬영 3장을 추가로 찍게 해서 순간의 오판단을 줄인다. 다만 매 장마다 Gemini를 다시 부르면 비용/쿼터가 크게 늘어나므로, 후속 촬영 중 1번째(seq=1)까지만 재분석하고 2·3번째는 저장만 하도록 설계했다.
- **Supabase Realtime**: 테이블 INSERT/UPDATE를 웹소켓으로 구독해서, 새로고침 없이도 로봇 상태·새 위험 알림이 대시보드에 바로 반영되게 할 수 있다.
- **FK `on delete cascade`**: `ai_analysis.camera_log_id`에 cascade를 걸어두면, 촬영 로그(`camera_logs`)를 지울 때 딸린 분석 결과가 자동으로 같이 삭제돼서 테스트 데이터 정리가 훨씬 간단해진다.
- **무료 API 쿼터는 눈으로 확인하기 전엔 모른다**: 모델 문서에 정적 쿼터 표가 사라진 경우, 실제로 최소 호출을 날려보고 429 에러 응답에 찍히는 `quotaValue` 필드로 진짜 한도를 확인해야 한다 — 추측하지 않고 API 응답/AI Studio 대시보드로만 확정.
- **Cloudflare Tunnel(quick tunnel)**: 계정 없이 `cloudflared tunnel --url http://localhost:PORT` 한 줄이면 로컬 서버가 임시 `trycloudflare.com` 주소로 외부에 노출된다. 단, 프런트/백엔드를 각각 따로 터널링하면 프런트가 여전히 `localhost` API 주소를 바라보지 않도록 환경변수(API Base URL)와 CORS 허용 origin을 터널 주소로 맞춰줘야 하고, Next.js dev 서버는 `allowedDevOrigins`에 터널 도메인을 추가해야 외부에서 정적 리소스가 차단되지 않는다.

### 실제 사용한 코드 예시
```python
# Gemini에게 구조화 JSON 출력을 강제하는 방식
response = client.models.generate_content(
    model=settings.gemini_model,
    contents=[
        types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
        build_risk_checklist_prompt(sensitivity),
    ],
    config=types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=AnalysisResult,  # Pydantic 모델 그대로 스키마로 사용
    ),
)
result = response.parsed  # 이미 AnalysisResult 인스턴스로 파싱되어 있음
```
```sql
-- ai_analysis.camera_log_id에 cascade를 걸어, camera_logs 삭제 시 분석 결과가 자동 정리되게 함
alter table ai_analysis
  add column camera_log_id uuid not null references camera_logs(id) on delete cascade;
```

### 개발 과정 (STEP 1~7)
- **STEP 1** 웹 대시보드 뼈대 (Next.js App Router, 레이아웃/네비게이션)
- **STEP 2** Supabase 스키마 설계 (checkpoints/robot_status/camera_logs/ai_analysis 등 관계형 구조)
- **STEP 3** Storage 이미지 업로드 연동
- **STEP 4** Gemini 이미지 분석 연동 — 체크리스트 4항목(문열림/바닥위험/사람·동물/화재위험) + 구조화 출력
- **STEP 5** FastAPI 이미지 수신 API (`POST /api/v1/images`) 구현
- **STEP 6** 전체 파이프라인 연결 (촬영 → Storage 업로드 → Gemini 분석 → DB 저장 → 대시보드 표시)
- **STEP 6.5** 이벤트 버스트 촬영 — 위험 감지 시 전/후로 추가 촬영 3장을 이어붙여 기록
- **STEP 7** Supabase Realtime 구독으로 대시보드 자동 갱신
- **여유 작업**: 체크포인트 좌표 기반 순찰 경로 시각화(지도), 설정 화면(민감도/알림)을 localStorage가 아니라 Supabase DB와 직접 연동

### 팀 협업
- 원래 3인 체제로 시작하려 했으나, 하드웨어(ESP32-S3 Sense/Raspberry Pi) 배송이 늦어지면서 인원 구성을 다시 논의해 **2인(A/B) 체제**로 확정
- B의 하드웨어 작업을 **이동 제어 / 센서 / 카메라 / 통신** 4단계로 세분화해서, 부품이 도착하는 대로 단계별로 바로 착수할 수 있게 계획을 미리 정리해둠

### 발견하고 해결한 버그
- **`event_id` 형식 미검증 → 500 에러**: 잘못된 형식의 `event_id`가 들어오면 서버 내부 오류(500)로 죽던 것을, uuid 형식을 미리 검증해 `400 Bad Request` + 명확한 에러 메시지로 개선
- **`stranger_or_animal_detected` 필드명 오매핑**: Gemini는 "사람 또는 동물"을 구분하지 않고 하나의 값으로 판단하는데, DB/API 필드명이 `person_detected`였던 탓에 동물만 있는 사진에서도 "사람 감지"로 오인되는 문제 발견 → DB 컬럼 · API 응답 스키마 · 웹 화면까지 필드명을 일관되게 `stranger_or_animal_detected`로 변경
- **"낯선지 익숙한지" 판단이 들쭉날쭉한 프롬프트**: 아이가 노는 사진은 `false`, 성인이 일하는 사진은 `true`로 나오는 등 판단 기준이 불명확했던 것을, "이 공간은 원래 무인 상태여야 하므로 낯선지 여부와 무관하게 사람·동물이 있으면 무조건 감지로 판단"하도록 프롬프트를 구체화해서 해결
- **Gemini 무료 티어 쿼터 소진**: 초반에 쓰던 모델의 무료 티어가 하루 20건 요청 제한이라는 걸 실제 429 에러로 발견 → List Models API와 실제 호출로 대체 모델들을 하나씩 검증한 뒤, 구조화 출력이 되면서 무료 티어가 더 넉넉한 `gemini-3.5-flash-lite`(RPM 15 / RPD 500, AI Studio에서 직접 확인)로 전환

### 실습 요약
- Gemini 체크리스트 4항목(문 열림/바닥 이상/사람·동물/화재 위험)을 실제 이미지로 하나씩 테스트하며 판정 정확도 확인
- Cloudflare Tunnel로 로컬 FastAPI/Next.js 서버를 임시 공개 URL로 노출해서, 하드웨어 담당(B)이 원격에서 실제 엔드포인트를 호출해보는 통합 테스트 진행
- 테스트 중 쌓인 `camera_logs`/`ai_analysis`/Storage 임시 데이터를 삭제 전 건수 미리보기 → 확인 → 실제 삭제 → 재조회 검증까지 안전하게 정리
- 완성된 진행 상황을 GitHub 포트폴리오 저장소(`yoru`)의 `projects/ai-zikimi/`에 기획서·API 명세·DB 스키마로 정리해서 추가

---

## 11. (2026-08-27) Arduino 심화 실습 (RGB LED / 화염 센서+부저 / 초음파 / 서보·스테퍼 모터 / 조이스틱 / LCD I2C / 7-Segment)

### 핵심 개념
- RGB(3색) LED는 R/G/B 세 핀에 각각 `analogWrite()`로 밝기(0~255)를 따로 줘서 색을 섞는 방식이라, 세 핀을 순서대로 하나씩만 켜면 "순차 점등"이 되고 동시에 다른 비율로 켜면 원하는 혼합색을 만들 수 있다.
- 화염 센서는 임계값(threshold) 기준으로 감지 여부를 판단하는 센서라, 너무 민감하게(값을 낮게) 잡으면 조명이나 반사광에도 반응해 오탐(false positive)이 나기 쉽다 — 실제 불꽃과 평소 환경광을 구분할 수 있는 값으로 직접 튜닝하는 과정이 중요했다.
- 초음파 센서는 `trig` 핀으로 초음파를 쏘고 `echo` 핀이 반사되어 돌아오기까지 걸린 시간을 `pulseIn()`으로 잰 뒤, 소리 속도(약 340m/s)를 이용해 `거리 = (걸린 시간 × 속도) / 2`로 환산해서 거리(cm)를 구한다.
- 서보모터는 `Servo` 라이브러리의 `write(각도)`로 0~180도 절대 위치를 바로 지정하는 반면, 스테퍼모터는 코일에 정해진 순서로 펄스를 줘서 "몇 스텝 회전했는지"를 누적하는 방식이라 제어 개념 자체가 다르다는 걸 체감했다.
- 조이스틱 모듈은 X/Y축을 각각 아날로그 입력(가변저항)으로, 누름 버튼은 별도의 디지털 입력으로 읽는 3-in-1 입력 장치다.
- LCD I2C는 일반 LCD와 달리 SDA/SCL 두 핀(I2C 통신)만 연결하면 되어 배선 핀 수를 크게 줄여주고 `LiquidCrystal_I2C` 라이브러리로 제어한다. 다만 화면 대비(contrast)는 코드가 아니라 모듈에 달린 물리적 조절 나사(potentiometer)로 맞추는 하드웨어 설정이라는 걸 이번에 처음 알았다.

### 실제 사용한 코드 예시
```cpp
int redPin=9, greenPin=10, bluePin=11;
int flamePin=7;
int buzzerPin=8;
int flameThreshold=500; // 너무 낮추면 조명/반사광에도 오탐 발생

void loop()
{
  // RGB LED 순차 점등 (R -> G -> B)
  analogWrite(redPin,255); analogWrite(greenPin,0); analogWrite(bluePin,0);
  delay(500);
  analogWrite(redPin,0); analogWrite(greenPin,255); analogWrite(bluePin,0);
  delay(500);
  analogWrite(redPin,0); analogWrite(greenPin,0); analogWrite(bluePin,255);
  delay(500);

  // 화염 센서 + 부저: threshold보다 낮게(더 강하게) 감지되면 경보
  int flameValue=analogRead(flamePin);
  if(flameValue<flameThreshold){
    tone(buzzerPin,1000);
  } else {
    noTone(buzzerPin);
  }
}
```

### 실습 요약
- 3색 LED(RGB) 순차 점등, 화염 센서+부저 화재 감지, 초음파 센서 거리 측정, 서보/스테퍼 모터 제어, 조이스틱 모듈, LCD I2C 디스플레이까지 6개 실습 완료. 7-Segment+택트 스위치는 점퍼선이 부족해 배선을 끝내지 못해 다음으로 미룸
- 화염 센서 threshold를 처음엔 너무 민감하게 잡아 평소 조명에도 경보가 울렸던 것을, 값을 조정해가며 실제 불꽃에만 반응하도록 튜닝 — 임계값 설정이 오탐/미탐 사이의 균형을 잡는 문제라는 걸 체감
- 코드에 글자 하나가 잘못 붙어 생긴 컴파일 에러를, 에러 메시지가 가리키는 줄 번호를 따라가며 원인을 찾아 수정
- 업로드 시 "programmer is not responding" 에러가 났을 때 포트 선택 → USB 케이블 → 보드 리셋 버튼 순서로 하나씩 확인하며 원인을 좁혀서 해결
- LCD 화면에 아무것도 안 보이는 문제를 코드가 아니라 하드웨어 쪽(대비 조절 나사)에서 원인을 찾아 해결 — 소프트웨어 문제와 하드웨어 설정 문제를 구분해서 접근하는 법을 익힘

---

## 오늘의 한 줄 정리
> 파일은 규칙(확장자)으로 자동 정리하고, 코드는 Git으로 버전을 기록하며, 게임은 "입력 → 상태 업데이트 → 그리기"의 반복 루프로 만들어진다. 그리고 FastAPI+SQLite로 실제 동작하는 백엔드를 만들고 Next.js 프론트와 REST API로 연결해, 완성된 풀스택 미니 프로젝트를 GitHub에 올려보는 것까지 경험했다. 외부 API(Open-Meteo)를 병렬로 호출하는 법과, Supabase 같은 BaaS로 실제 회원가입/게시글 작성이 동작하는 커뮤니티 서비스를 만드는 것까지 하루에 경험했다. 그리고 하드웨어(로봇)-서버-AI-DB-웹 대시보드를 전부 잇는 실제 팀 프로젝트(아이지킴이)에서, Gemini 구조화 출력·Supabase Realtime·이벤트 버스트 설계 같은 아키텍처 결정과, 필드명 오매핑·프롬프트 모호성·API 쿼터 소진처럼 실제로 부딪혀야만 보이는 버그들을 직접 찾아 고쳐보는 경험까지 이어갔다. 여기에 더해 RGB LED·화염 센서·초음파·서보/스테퍼·조이스틱·LCD I2C 같은 아두이노 센서/액추에이터를 하나씩 직접 다뤄보며, 컴파일 에러·업로드 실패·화면 미출력처럼 층위가 다른 문제를 각각 다른 방식(코드 줄 번호, 포트/케이블/리셋, 하드웨어 조절 나사)으로 좁혀나가는 디버깅 감각과, 센서 임계값 하나가 오탐/미탐을 가른다는 것도 몸으로 익혔다.
