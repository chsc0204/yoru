# 포트폴리오 요약 — My Development Journey

`index.html` / `script.js` / `README.md`를 기준으로 정리한 포트폴리오 전체 요약 문서입니다.

---

## 1. 사이트 소개

- **제목**: My Development Journey — 개발 학습 & 프로젝트 포트폴리오
- **메타 설명**: HTML/CSS, JavaScript, Python, Git/GitHub를 학습하며 만든 프로젝트와 실습을 소개하는 개인 개발자 포트폴리오

### Hero 문구

> **MY DEVELOPMENT JOURNEY**
> 배운 것을 코드로 만들고, 코드로 **경험**을 쌓다.
>
> 웹 개발부터 Python 게임, Git/GitHub, AI 프로젝트까지 직접 배우고 만들어본 개발 학습 포트폴리오입니다.

- 학습 경로 배지: `HTML/CSS → JavaScript → Python → Git/GitHub → AI → Web Development`
- CTA 버튼: **View My Projects**, **Explore Playground**
- Hero 통계: Learning Areas **7+** · Projects **6+** · Tools **6+** · Curiosity **∞**

### About Me

| 항목 | 내용 |
|---|---|
| 이름 | yoru |
| 역할 | Student Developer |
| Interests | Web Development / Programming / AI |
| Currently Learning | JavaScript 심화 & 웹 프로젝트 |

**My Story**
> 처음에는 웹페이지의 구조를 만드는 HTML/CSS에서 시작했습니다. 이후 JavaScript를 통해 웹페이지에 기능을 추가하는 방법을 배웠고, Python과 pygame을 활용해 게임도 직접 제작했습니다.
>
> 또한 Git과 GitHub를 이용해 프로젝트를 관리하고, Node.js, npm, Claude Code 등 다양한 개발 도구를 직접 사용하면서 단순히 코드를 작성하는 것뿐 아니라 개발 환경을 구성하고 프로젝트를 완성하는 과정까지 경험했습니다.
>
> 지금은 배운 내용을 실제로 동작하는 결과물로 만들어보는 데 집중하고 있으며, 이 포트폴리오도 그 과정 중 하나입니다.

---

## 2. Skills (기술 스택)

| 분류 | 기술 | 세부 주제 | 숙련도 | 설명 |
|---|---|---|---|---|
| Frontend | HTML5 | Web Structure · Semantic HTML | Experienced | 시맨틱 태그로 이력서 웹페이지 등의 구조를 직접 설계했습니다. |
| Frontend | CSS3 | Layout · Flexbox · Grid · Responsive | Practicing | Flexbox/Grid로 반응형 레이아웃을 구성하는 연습을 하고 있습니다. |
| Frontend | JavaScript | Variables · Functions · Arrays · Objects · DOM · Events | Practicing | Playground의 계산기·시계 등 실제 동작하는 기능을 구현했습니다. |
| Programming | Python | Basic Syntax · pygame · Game Development | Practicing | pygame으로 Snake Game을 만들며 게임 루프와 충돌 처리를 익혔습니다. |
| Development Tools | Git | Version Control · Commit · Branch / Push | Learning | add-commit-push 흐름으로 프로젝트 변경 이력을 관리하고 있습니다. |
| Development Tools | GitHub | Repository · README · GitHub Pages | Learning | 원격 저장소에 프로젝트를 올리고 README로 문서화하는 연습을 합니다. |
| Development Tools | Node.js / npm | Development Environment · Package Management | Learning | 로컬 개발 환경을 구성하고 패키지를 설치하는 데 사용했습니다. |
| Development Tools | Claude Code | AI-assisted Coding · Development Workflow | Learning | 요구사항을 정리해 AI와 함께 이 포트폴리오를 포함한 프로젝트를 만들었습니다. |
| AI | Object Detection | TensorFlow.js · COCO-SSD | Learning | 이미 학습된 AI 모델을 웹페이지에 불러와 활용하는 방법을 익혔습니다. |

숙련도 기준: `Learning` 33% · `Practicing` 66% · `Experienced` 100%

---

## 3. Projects (전체 6개)

### ① 폰케이스 쇼핑몰

- **설명**: 카테고리 필터, 검색, 장바구니, 다크 모드까지 갖춘 폰케이스 쇼핑몰 데모 사이트.
- **기술**: HTML, CSS, JavaScript
- **주요 기능**
  - 카테고리 필터 · 실시간 검색 · 상품 상세 모달
  - 장바구니(localStorage) · Checkout · 주문 완료 플로우
  - 다크 모드 토글(localStorage로 새로고침 후에도 유지)
- **Demo**: `projects/phone-case-shop/index.html`
- **GitHub**: https://github.com/chsc0204/yoru

### ② Snake Game

- **설명**: pygame을 활용해 제작한 스네이크 게임.
- **기술**: Python, pygame
- **주요 기능**
  - 방향키 / WASD 조작
  - 먹이를 먹을수록 점수 상승 및 속도 증가
  - 게임오버 후 R키로 재시작
- **Demo**: 별도 웹 데모 없음 — `python snake_game.py`로 로컬 실행
- **GitHub**: https://github.com/chsc0204/yoru

### ③ Image Object Detection Web App (물체 탐지기)

- **설명**: 이미지를 업로드하고 객체를 탐지하는 웹 애플리케이션 실습.
- **기술**: HTML, CSS, JavaScript, TensorFlow.js
- **주요 기능**
  - 이미지 업로드 및 미리보기
  - COCO-SSD 모델로 객체 탐지
  - 탐지 결과를 박스와 확률로 표시
- **Demo**: `projects/object-detector.html`
- **GitHub**: https://github.com/chsc0204/yoru

### ④ Football Champions Archive

- **설명**: 2000년 이후 주요 축구 대회의 우승팀을 정리하고, 검색·필터·통계 시각화로 탐색할 수 있는 Client-only SPA.
- **기술**: HTML, CSS, JavaScript, Chart.js
- **주요 기능**
  - 대회별 챔피언 데이터베이스와 필터/검색
  - 팀 상세 페이지(타이틀 차트, 우승 연도 타임라인)
  - 통계 대시보드(추이·순위·히트맵·국가별 비중)
  - FIFA 월드컵 세계지도, 즐겨찾기 · 최근 본 팀(LocalStorage)
- **Demo**: `projects/football-champions/index.html` (fetch로 JSON을 불러오므로 로컬 서버 실행 필요)
- **GitHub**: https://github.com/chsc0204/yoru/tree/main/projects/football-champions

### ⑤ AI 도구 2025 하반기 인기 보고서

- **설명**: 2025년 하반기 인기 AI 도구를 조사하고 정리한 리포트.
- **기술**: Research, Documentation
- **주요 기능**
  - 웹 트래픽 · MAU/WAU · 개발자 설문 등 다지표 기반 조사 방법론
  - 챗봇 · 코딩 어시스턴트 · 이미지/영상 생성 도구 카테고리별 정리
  - PDF · Word(.docx) · Markdown 원본 파일 다운로드 제공
- **Demo**: `projects/ai-tools-report/index.html`
- **GitHub**: https://github.com/chsc0204/yoru/tree/main/projects/ai-tools-report

### ⑥ J-POP Archive

- **설명**: 아티스트/곡/앨범 정보와 랭킹, 일본어 학습 퀴즈까지 포함한 SPA(싱글 페이지 애플리케이션).
- **기술**: HTML, CSS, JavaScript, Chart.js
- **주요 기능**
  - 아티스트 · 곡 · 앨범 탐색, 검색/필터/정렬, 즐겨찾기(localStorage)
  - Rankings(Top Artists/Songs/Albums) + Chart.js 통계 시각화
  - Japanese Study — JLPT 레벨별 학습 카드 + 랜덤 퀴즈
- **Demo**: `projects/jpop-archive/index.html`
- **GitHub**: https://github.com/chsc0204/yoru/tree/main/projects/jpop-archive

---

## 4. Playground 기능 목록

| 기능 | 설명 |
|---|---|
| 월말 날짜 계산기 | 연도와 월을 입력하면 그 달이 며칠까지 있는지 알려줍니다. |
| 윤년 판별기 | 연도를 입력하면 윤년인지 아닌지 알려줍니다. |
| Random Number Generator | 최솟값과 최댓값을 입력하고 랜덤 숫자를 생성합니다. |
| Color Generator | 버튼을 클릭하면 랜덤 색상과 HEX / RGB 값을 보여줍니다. |
| Simple Calculator | 더하기, 빼기, 곱하기, 나누기를 계산합니다. |
| Digital Clock | 현재 시간과 날짜를 실시간으로 보여줍니다. |

---

## 5. Learning Journey (학습 타임라인)

| 단계 | 분야 | 요약 | 실습 | 스택 |
|---|---|---|---|---|
| 1 | HTML / CSS | 웹페이지의 기본 구조와 레이아웃 학습 | 이력서 웹페이지 제작 | HTML5, CSS3 |
| 2 | JavaScript | 웹페이지에 동적인 기능 추가 | Playground 기능 구현 (계산기, 캘린더 등) | JavaScript, DOM |
| 3 | Python | Python 기본 문법과 pygame 활용 | Snake Game 제작 | Python, pygame |
| 4 | Git / GitHub | 버전 관리와 GitHub Repository 관리 | 프로젝트를 GitHub에 커밋·푸시 | Git, GitHub |
| 5 | Claude Code | AI 코딩 도구를 활용한 프로젝트 개발 경험 | 이 포트폴리오 사이트 개발 | Claude Code |
| 6 | AI / Object Detection | Object Detection을 활용한 웹 앱 구현 | Image Object Detection Web App 제작 | TensorFlow.js, COCO-SSD |
| 7 | Web Portfolio | 배운 것들을 하나의 인터랙티브 포트폴리오로 정리 | My Development Journey 제작 | HTML, CSS, JavaScript |

---

## 6. 사용한 개발 도구

| 도구 | 용도 | 사용 내용 |
|---|---|---|
| VS Code | Code Editor | HTML/CSS/JS와 Python 코드를 작성하고 디버깅하는 데 사용했습니다. |
| Git | Version Control | 프로젝트의 변경 이력을 커밋 단위로 기록하고 관리하는 데 사용했습니다. |
| GitHub | Repository / Deployment | 로컬 프로젝트를 원격 저장소에 올리고 버전을 공유하는 데 사용했습니다. |
| Node.js | JavaScript Runtime | 브라우저 밖에서 JavaScript를 실행하고 개발 환경을 구성하는 데 사용했습니다. |
| npm | Package Management | 필요한 패키지를 설치하고 프로젝트 의존성을 관리하는 데 사용했습니다. |
| Claude Code | AI Coding Assistant | 요구사항을 정리하고 코드를 작성·수정하는 개발 워크플로우 전반에 활용했습니다. |

---

## 7. 배포 링크

- **GitHub 저장소**: https://github.com/chsc0204/yoru
- **GitHub Pages (배포 사이트)**: https://chsc0204.github.io/yoru/
