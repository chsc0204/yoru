# 10일 코딩 수업 포트폴리오

10일간의 코딩 수업에서 배운 내용을 실습하며 만든 개인 포트폴리오 저장소입니다.
HTML/CSS, JavaScript, Python, Git/GitHub, AI 도구 활용까지 학습 과정을 코드로 직접
만들어보고 기록하는 것을 목표로 합니다.

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

`phone-case-shop/`, `ai-tools-report/`, `football-champions/` 폴더에는 각각 더 자세한
내용을 담은 README.md가 별도로 있습니다.

---

## `review.md` — 학습 복습 노트

`review.md`는 그날그날 배운 내용을 정리한 학습 복습 노트입니다. 파일/폴더 확장자 자동
분류, Git/GitHub 기본 명령어(init/add/commit/push), pygame 게임 루프 설계 등 그날의
핵심 개념과 실제 사용한 코드를 함께 기록해둔 문서입니다.

---

## 기타 파일

- `catch_pikachu.py`, `organize_downloads.py`, `organize_folder.py`, `path_parts.py` —
  수업 중 별도로 연습한 스크립트들로, 아직 포트폴리오 Projects 카드에는 연결되어 있지
  않습니다.
