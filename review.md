# 오늘 배운 내용 복습

## 1. 파일/폴더 정리 및 확장자별 분류

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

### 오늘 실습에서 한 일
- `분류용` 폴더의 파일들을 `images / documents / data / installers / archives` 폴더로 자동 분류
- 나중에 새 파일이 들어와도 스크립트를 다시 실행하면 같은 기준으로 정리됨

---

## 2. Git/GitHub 사용법 (init, add, commit, push)

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

### 오늘 실습에서 한 일
- `power sell` 폴더를 Git 저장소로 초기화
- `snake_game.py`를 커밋해서 GitHub 저장소(`yoru`)에 처음으로 푸시

---

## 3. pygame으로 snake_game.py 만들기 실습

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

### 오늘 실습에서 한 일
- `snake_game.py` 완성: 방향키/WASD 조작, 먹이를 먹을수록 점수 상승 및 속도 증가, 게임 오버 후 R키로 재시작
- 처음 만들었을 때 "반응이 느리다"는 문제를 발견하고, 이동 로직과 입력 폴링을 분리해서 해결

---

## 4. FastAPI (백엔드 서버)

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

### 오늘 실습에서 한 일
- FastAPI로 `GET /products`, `GET /cart`, `POST /cart`, `PATCH /cart/{id}`, `DELETE /cart/{id}`, `DELETE /cart` 총 6개 라우트 구현
- `http://127.0.0.1:8001/docs`에서 Swagger UI로 각 API를 직접 호출해보며 정상 동작(수량 증가, 404/400 에러 등) 확인

---

## 5. SQLite (데이터베이스)

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

### 오늘 실습에서 한 일
- `products`, `cart` 두 테이블을 SQLite에 생성하고, 서버 시작 시 상품 4종(노트북/키보드/마우스/헤드셋)을 자동으로 채워두는 초기화 로직 작성
- 장바구니 담기·수량 변경·삭제 API가 실제로 `shop.db` 파일에 반영되는지 직접 쿼리로 조회해서 확인

---

## 6. 미니 장바구니 프로젝트 (종합 실습)

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

### 오늘 실습에서 한 일
- 상품 목록 조회, 장바구니 담기/삭제, 수량 변경(+/−), 중복 상품 자동 수량 증가, 장바구니 비우기, 총 금액 자동 계산까지 기능 완성
- 애플 스타일(넓은 여백, 은은한 그림자, 포인트 컬러 하나, hover 애니메이션)로 프론트엔드 디자인 다듬기
- 완성한 프로젝트를 기존 GitHub 포트폴리오 저장소(`yoru`)의 `projects/mini-cart/`에 정리해서 추가하고 README까지 작성

---

## 7. 외부 API 연동 실습 (날씨/대기질)

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

### 오늘 실습에서 한 일
- `first_call.py`(연결 확인) → `show_json.py`(구조 탐색) → `weather.py`(날씨 조회) → `air.py`(대기질 조회) 순으로 단계별로 실습하며 API 응답 구조를 익힘
- `app.py`로 위 실습을 통합: 도시명 하나만 입력하면 Geocoding → 날씨/대기질을 병렬로 조회하고, 타임아웃/예외 처리 후 미세먼지·강수확률 기준으로 "외출 가능 여부"를 한 문장으로 판정
- 완성한 실습을 GitHub 포트폴리오 저장소(`yoru`)의 `projects/weather-air-api/`에 정리해서 추가

---

## 8. Supabase 연동 (J-MUSE 프로젝트)

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

### 오늘 실습에서 한 일
- Vite + React + Tailwind + Supabase로 J-POP 커뮤니티 웹앱(J-MUSE) 제작
- `profiles`, `artists`, `albums`, `songs`, `posts`, `answers`, `likes`, `playlists`, `playlist_songs` 9개 테이블 설계 및 `schema.sql` → `policies.sql` → `seed.sql` 순서로 실행해 테이블 생성과 RLS 정책 적용
- 회원가입/로그인, 게시글 작성·조회 기능을 실제로 붙여보고, Table Editor와 SQL Editor에서 데이터가 실제로 반영되는지 직접 확인

---

## 오늘의 한 줄 정리
> 파일은 규칙(확장자)으로 자동 정리하고, 코드는 Git으로 버전을 기록하며, 게임은 "입력 → 상태 업데이트 → 그리기"의 반복 루프로 만들어진다. 그리고 FastAPI+SQLite로 실제 동작하는 백엔드를 만들고 Next.js 프론트와 REST API로 연결해, 완성된 풀스택 미니 프로젝트를 GitHub에 올려보는 것까지 경험했다. 외부 API(Open-Meteo)를 병렬로 호출하는 법과, Supabase 같은 BaaS로 실제 회원가입/게시글 작성이 동작하는 커뮤니티 서비스를 만드는 것까지 하루에 경험했다.
