# My Development Journey

코딩을 배우며 실습한 내용을 실제로 동작하는 프로젝트로 만들어보는 개인 포트폴리오
저장소입니다. HTML/CSS, JavaScript, Python, Git/GitHub, AI 도구 활용까지 학습 과정을
코드로 직접 만들어보고 기록하는 것을 목표로 합니다.

---

## 메인 포트폴리오 사이트 (`index.html`)

`index.html`이 이 저장소의 **메인 포트폴리오 웹페이지**입니다. 순수 HTML/CSS/JavaScript로
만들어졌으며 별도의 빌드 과정 없이 바로 열어볼 수 있습니다.

Hero → About → Skills → Projects → Interactive Playground → Learning Journey →
Dev Notes → Tools → Git Workflow → Developer Mode → Contact 순서로 구성되어 있습니다.

### 실행 방법

1. **더블클릭**: `index.html` 파일을 더블클릭해서 기본 브라우저로 열기
2. **로컬 서버**:
   ```bash
   python -m http.server 8000
   ```
   브라우저에서 `http://localhost:8000` 접속
3. **GitHub Pages**: 이 저장소는 아직 GitHub Pages가 활성화되어 있지 않습니다.
   저장소 **Settings → Pages**에서 Source를 `main` 브랜치 `/(root)`로 지정하면
   `https://chsc0204.github.io/yoru/`에서 접속할 수 있게 됩니다.

구성 파일: `style.css`(전체 스타일), `script.js`(Navigation, Scroll Animation,
Project/Note Modal, Playground 기능 등), `assets/`(아이콘·이미지).

---

## `projects/` — 소개하는 프로젝트들

포트폴리오의 Projects 섹션에서 카드로 소개하는 프로젝트들입니다.

| 프로젝트 | 경로 | 한 줄 설명 |
|---|---|---|
| 폰케이스 쇼핑몰 | `projects/phone-case-shop/` | 카테고리 필터·검색·상품 상세·장바구니·Checkout·다크 모드를 갖춘 폰케이스 쇼핑몰 데모 사이트 |
| Snake Game | `projects/snake-game/snake_game.py` | pygame으로 만든 스네이크 게임. 방향키/WASD 조작, 먹이를 먹을수록 점수·속도 상승 |
| 물체 탐지기 (Image Object Detection Web App) | `projects/object-detector.html` | 사진을 업로드하면 TensorFlow.js COCO-SSD 모델로 물체를 탐지해 박스와 확률(%)로 표시 |
| Football Champions Archive | `projects/football-champions/` | 2000년 이후 주요 축구 대회 우승팀 아카이브. 검색·필터·통계 시각화 SPA (로컬 서버 필요, 자세한 내용은 폴더 내 README 참고) |
| AI 도구 2025 하반기 인기 보고서 | `projects/ai-tools-report/` | 2025년 하반기 인기 AI 도구를 여러 지표로 조사한 리서치 리포트. PDF/Word/Markdown 원본 다운로드 제공 |
| J-POP Archive | `projects/jpop-archive/` | 아티스트/곡/앨범 정보와 랭킹, Chart.js 통계 시각화, 일본어 학습 퀴즈까지 포함한 SPA. 인기도·랭킹 수치는 실제 인기도를 참고해 구성한 학습용 예시 데이터 |
| 미니 장바구니 | `projects/mini-cart/` | Next.js / FastAPI / SQLite로 만든 미니 쇼핑몰. 상품 목록 조회, 장바구니 담기·삭제·수량 변경, 총 금액 계산 기능 구현 |
| 날씨/대기질 API 학습 | `projects/weather-air-api/` | Open-Meteo API로 날씨·대기질을 조회하는 손코딩 실습과, 이를 병렬 요청(ThreadPoolExecutor)·예외 처리로 통합한 완성형 프로그램 |
| J-MUSE | `projects/j-muse/` | React 19 + Supabase로 만든 J-POP 음악 커뮤니티 웹앱. 회원가입/로그인, 추천·질문 게시글 CRUD, 답변·좋아요, 통합 검색, 아티스트/곡/앨범 상세, 하단 고정 뮤직 플레이어, 라이브러리·플레이리스트 기능 구현 |
| 초음파 센서 + 부저 연동 | `projects/arduino-sensor-buzzer/` | HC-SR04 초음파 센서로 거리를 측정해 30cm 이내로 가까워지면 피에조 부저로 경보음을 울리는 Tinkercad 회로 실습 |

`phone-case-shop/`, `ai-tools-report/`, `football-champions/`, `jpop-archive/`, `mini-cart/`, `j-muse/`,
`arduino-sensor-buzzer/` 폴더에는 각각 더 자세한 내용을 담은 README.md가 별도로 있습니다.

---

## `review.md` — 학습 복습 노트

`review.md`는 그날그날 배운 내용을 정리한 학습 복습 노트입니다. 파일/폴더 확장자 자동
분류, Git/GitHub 기본 명령어(init/add/commit/push), pygame 게임 루프 설계 등 그날의
핵심 개념과 실제 사용한 코드를 함께 기록해둔 문서입니다.

---

## Architecture

```
power sell/
├── index.html                — 메인 포트폴리오 페이지 (Hero/About/Skills/Projects/Playground/Journey/Tools/Contact)
├── style.css                 — 포트폴리오 전체 스타일 (라이트·다크 테마 변수 포함)
├── script.js                 — Navigation, 검색, Skills/Projects/Playground 렌더링 등 전체 로직
├── README.md                 — 이 문서
├── portfolio-summary.md      — 포트폴리오 전체 내용을 정리한 제출용 요약 문서
├── review.md                 — 그날그날 배운 내용을 정리한 학습 복습 노트
├── assets/
│   ├── images/                — 프로필 사진 등 포트폴리오 홈에서 쓰는 이미지
│   └── icons/                 — (예약 폴더)
└── projects/                  — 포트폴리오 Projects 카드로 소개하는 실습 프로젝트 모음
    ├── phone-case-shop/        — 폰케이스 쇼핑몰. HTML/CSS/JS, 카테고리 필터·장바구니·다크 모드
    ├── snake-game/
    │   └── snake_game.py       — pygame으로 만든 스네이크 게임
    ├── object-detector.html    — TensorFlow.js 물체 탐지 웹앱 (단일 파일로 구성)
    ├── football-champions/     — 축구 우승팀 아카이브 SPA (css/js/data 폴더 구조, fetch 사용으로 로컬 서버 필요)
    ├── ai-tools-report/        — AI 도구 리서치 리포트 (html · pdf · docx · md 원본 파일 포함)
    ├── jpop-archive/           — J-POP 아카이브 SPA (js/data, js/pages 폴더 구조, 해시 라우터)
    ├── j-muse/                 — React 19 + Supabase J-POP 음악 커뮤니티 (src/components, pages, services, store, supabase/*.sql)
    └── arduino-sensor-buzzer/  — Arduino 기초 실습. LED 제어·초음파 센서·부저 연동
```

`phone-case-shop/`, `football-champions/`, `ai-tools-report/`, `jpop-archive/`, `j-muse/`,
`arduino-sensor-buzzer/`는 폴더 안에 각자의 README.md가 따로 있어 더 자세한 구성을
확인할 수 있습니다. `snake-game/`과 `object-detector.html`은 파일 구성이 단순해
별도 README 없이 이 문서로 충분합니다.

### 왜 이렇게 구조를 나눴나

메인 포트폴리오 사이트(`index.html`/`style.css`/`script.js`)와 실습 프로젝트들을 명확히
분리해서, `index.html`은 오직 "소개하는 화면" 역할만 하고 실제 프로젝트 코드는 전부
`projects/` 아래 각자의 폴더에 두었습니다. 그 결과 `projects/`의 각 폴더는 서로 의존성 없이
독립적으로 실행·테스트할 수 있습니다 — 자체 HTML/CSS/JS(또는 `.py`)를 그대로 가지고 있어서,
포트폴리오 홈을 거치지 않고 해당 폴더만 열어도(또는 GitHub Pages의 하위 경로로 바로 접속해도)
완전히 동작합니다.

같은 이유로 각 프로젝트는 데이터/스타일을 서로 공유하지 않고 폴더 안에서 전부 자체 완결적으로
관리합니다. `phone-case-shop/`, `jpop-archive/`, `object-detector.html`처럼 데이터를 JS 파일로
직접 관리하는 프로젝트는 더블클릭(`file://`)만으로 열리는 반면, `football-champions/`는
`fetch`로 JSON을 불러오는 구조라 로컬 서버가 필요합니다 — 이렇게 프로젝트마다 실행 방식이
다른 것도, 각 폴더를 배운 시점 그대로의 독립적인 결과물로 남겨두었기 때문입니다.

---

## 기타 파일

- `catch_pikachu.py`, `organize_downloads.py`, `organize_folder.py`, `path_parts.py` —
  수업 중 별도로 연습한 스크립트들로, 아직 포트폴리오 Projects 카드에는 연결되어 있지
  않습니다.
