# Football Champions Archive ⚽

2000년 이후 주요 축구대회 챔피언을 아카이빙하고, 검색·필터·통계 시각화로 탐색할 수 있는
**Client-only SPA**입니다. 빌드 도구, 프레임워크, 서버 없이 HTML5 / CSS3 / Vanilla JS(ES6+
Modules) / Chart.js / LocalStorage만으로 동작합니다.

이 저장소는 프로젝트 제안서(`PROJECT_PLAN.md`)의 기능 요구사항(5장), 시스템 구성도(7장),
화면설계(8장), 데이터 구조(9장)를 기준으로 구현되었습니다.

---

## 1. 실행 방법

이 프로젝트는 `fetch()`로 `data/*.json`을 읽어오기 때문에, **반드시 로컬 HTTP 서버를 통해
실행해야 합니다.** `index.html`을 더블클릭해서 `file://`로 여는 방식은 브라우저의 CORS
정책 때문에 데이터를 불러오지 못합니다.

### 방법 A — Python (가장 간단)

```bash
cd football-champions
python -m http.server 8080
```

브라우저에서 `http://localhost:8080` 접속.

### 방법 B — VS Code Live Server 확장

`index.html`을 열고 우클릭 → **Open with Live Server**.

### 방법 C — Node.js가 있는 경우

```bash
npx serve football-champions
```

---

## 2. 폴더 구조

```
football-champions/
├─ index.html                # 앱 셸 (헤더/내비/모바일 드로어/#app 마운트 포인트)
├─ README.md
├─ pages/                    # (예약 폴더) 향후 서버사이드/멀티페이지 전환 시 사용
├─ assets/
│  ├─ logos/                 # (예약 폴더) 실제 배포 시 팀 엠블럼 이미지 추가 위치
│  ├─ flags/                 # 월드컵 지도용 국기 SVG 8종 (bra/ger/ita/arg/fra/ury/esp/eng)
│  └─ maps/world-map.svg     # 단순화된 대륙 실루엣 배경 지도
├─ css/
│  ├─ reset.css              # 최소 리셋
│  ├─ tokens.css             # 디자인 토큰 (다크테마·글래스모피즘·그린 액센트)
│  ├─ layout.css             # 헤더/내비/드로어/푸터 구조
│  ├─ components.css         # 카드·버튼·칩·타임라인·히트맵·세계지도 등 컴포넌트
│  └─ responsive.css         # 320~479 / 480~1023 / 1024~ 브레이크포인트
├─ js/
│  ├─ app.js                 # 부트스트랩, 헤더 인터랙션
│  ├─ router.js              # 해시 기반 라우터
│  ├─ store.js                # 전역 상태 스토어 (pub/sub)
│  ├─ dataLoader.js           # JSON 로드 + 참조 무결성 검증
│  ├─ searchEngine.js         # 검색 랭킹 알고리즘
│  ├─ filters.js              # 필터 조합 로직
│  ├─ filterPanel.js          # 필터 UI 공용 컴포넌트
│  ├─ recordListView.js       # 표 ↔ 카드 반응형 리스트
│  ├─ statisticsEngine.js     # 통계 집계 로직
│  ├─ chartController.js      # Chart.js 래퍼
│  ├─ worldMap.js             # 월드컵 세계지도 렌더링
│  ├─ favoritesRepository.js  # 즐겨찾기 LocalStorage 접근
│  ├─ recentlyViewed.js       # 최근 본 팀 LocalStorage 접근
│  ├─ utils.js                # 공용 순수 함수
│  └─ pages/                  # 라우트별 화면 (dashboard/database/search/teamDetail/statistics/favorites)
└─ data/
   ├─ competitions.json
   ├─ teams.json
   ├─ countries.json
   ├─ worldcup-champions.json  # 세계지도용 8개국 전체 역사 우승 기록
   └─ records/                 # 대회별 시즌 기록 10종
```

---

## 3. 주요 기능

| 화면 | 구현 내용 |
|---|---|
| 대시보드 | 전체 통계 카드, 대회별 최신 우승, 통합 Top 5 리더보드, 빠른 이동 |
| 챔피언스 데이터베이스 | 연도순 목록, 페이지네이션(15건/페이지), 필터 연동 |
| 검색 | 실시간(디바운스 250ms) 관련도순 검색, 결과 없음 시 유사 팀명 추천 |
| 필터 패널 | 대회 다중선택 · 연대/기간 직접입력 · 국가 · 최소 타이틀 수, 활성 필터 칩 |
| 팀 상세 | 프로필, 대회별 타이틀 막대차트, 우승 연도 타임라인, 시즌별 아코디언, 즐겨찾기 토글 |
| 통계 대시보드 | 연도별 다양성 추이(선), 팀별 순위(막대), 팀×연대 히트맵(커스텀), 국가별 비중(도넛) |
| FIFA 월드컵 세계지도 | SVG 지도 + 국기 핀 + hover/클릭/키보드 툴팁, 모바일용 정적 범례 |
| 즐겨찾기 | LocalStorage 영속, 빈 상태 안내, 개별 해제 |
| 최근 본 팀 | 팀 상세 방문 시 자동 기록(최대 10개, 중복 시 최신순 갱신), "다시 보기" 버튼 |

---

## 4. 기술 스택 및 설계 결정

- **프레임워크 미사용**: React/Vue/TypeScript/Tailwind/Bootstrap 등 외부 프레임워크를 사용하지 않고
  순수 ES6 모듈로 계층(프레젠테이션/상태/데이터 접근)을 분리했습니다.
- **해시 라우팅(`#/team/real-madrid`)**: GitHub Pages 정적 호스팅에서 서버 URL 재작성 설정 없이
  동작하도록 선택했습니다.
- **히트맵은 순수 HTML 테이블 + accent 색상 농도로 구현**: Chart.js 4.x 자체에는 매트릭스(히트맵)
  차트 타입이 없고, 이를 위한 `chartjs-chart-matrix` 플러그인은 "지정된 기술 스택 외 라이브러리
  금지" 원칙에 어긋나므로 커스텀 구현으로 대체했습니다.
- **세계지도는 실제 국가 경계 기반 SVG**를 사용합니다. 베이스 지도는
  [flekschas/simple-world-map](https://github.com/flekschas/simple-world-map)
  (Author: Al MacDonald, Editor: Fritz Lekschas, **License: CC BY-SA 3.0**)에서 가져와,
  대륙별로 다른 색상 그라데이션을 입히고 다크 테마에 맞는 바다/격자 배경·그림자 필터를
  새로 적용했습니다. 8개국 핀 좌표는 해당 국가 SVG 경로의 바운딩박스 중심을 계산해
  배치했으며, 유럽/남미처럼 국가가 밀집한 지역은 가독성을 위해 좌표를 소폭 조정했습니다.
- **팀 엠블럼 이미지 미포함**: `teams.json`의 `logoUrl` 필드는 실제 배포 시 로고 이미지를
  연결할 수 있도록 스키마상 예약되어 있으나, 이번 구현에서는 국기 이모지/배지로 대체했습니다
  (깨진 이미지 아이콘 노출 방지). 세계지도 핀의 국기만 실제 SVG 자산(`assets/flags/`)으로
  제작했습니다.
- **데이터는 2000년 이후 실제 우승 기록 기반**(대회별 6~11시즌, 총 85건, 클럽 대회는 2024-25 시즌까지 반영)
  이며, 월드컵 세계지도는 요구사항에 맞춰 8개국의 전체 역사 우승 횟수를 별도 데이터
  (`worldcup-champions.json`)로 관리합니다.
- **2026 FIFA 월드컵 미반영**: 학습 데이터 기준 아직 개최되지 않은 대회라 실제 결과를 검증할 수
  없어 의도적으로 제외했습니다. `data/records/worldcup.json`은 2002~2022년까지만 포함합니다.

---

## 5. GitHub Pages 배포 방법

1. 이 `football-champions/` 폴더를 저장소 루트(또는 `docs/` 폴더)로 push 합니다.
2. GitHub 저장소 **Settings → Pages**로 이동합니다.
3. **Source**를 `Deploy from a branch`로 설정하고, 브랜치와 폴더(`/root` 또는 `/docs`)를 지정합니다.
4. 저장 후 발급되는 `https://<username>.github.io/<repo>/` 주소로 접속합니다.
5. 정적 파일만 사용하므로 별도 빌드 단계가 필요 없습니다.

> 저장소 루트에 이미 다른 프로젝트가 있다면, `football-champions/`를 별도 저장소로 분리하거나
> `docs/` 폴더로 이동한 뒤 Pages 소스를 `/docs`로 지정하세요.

---

## 6. Lighthouse 점검 체크리스트

배포 전/후 Chrome DevTools → Lighthouse에서 아래 항목을 확인하세요 (목표: 4개 카테고리 90점 이상).

- [ ] **Performance**
  - [ ] 초기 로드 시 불필요한 콘솔 오류 없음
  - [ ] `data/*.json`이 병렬(Promise.all)로 로드되는지 확인 (Network 탭)
  - [ ] Chart.js CDN 스크립트가 `defer`로 로드되어 렌더링을 막지 않는지 확인
  - [ ] 이미지 없는 페이지(대시보드 등)의 CLS(레이아웃 이동)가 낮은지 확인
- [ ] **Accessibility**
  - [ ] 색상 대비 경고 없음 (다크 배경 대비 텍스트/버튼 색상)
  - [ ] 모든 버튼/링크에 접근 가능한 이름(aria-label 또는 텍스트) 존재
  - [ ] 폼 입력(검색, 필터)에 label 연결 확인
  - [ ] 키보드만으로 헤더 → 검색 → 필터 → 팀 상세 → 즐겨찾기까지 이동 가능한지 Tab으로 확인
- [ ] **Best Practices**
  - [ ] 콘솔에 에러/경고(특히 404) 없음
  - [ ] HTTPS 배포 확인 (GitHub Pages는 기본 제공)
  - [ ] 이미지/자산에 적절한 크기 지정 여부 (세계지도 SVG는 반응형 viewBox 사용)
- [ ] **SEO**
  - [ ] `<title>`, `<meta name="description">` 존재 확인
  - [ ] 시맨틱 헤딩 계층(`h1` → `h2`) 준수 확인
  - [ ] `lang="ko"` 속성 확인

---

## 7. 알려진 제한사항 (Out of Scope)

- 실시간 경기 데이터, 사용자 인증/계정, 선수 개인 기록은 포함하지 않습니다 (제안서 4.2절 참고).
- 데이터는 수동 큐레이션 방식이며, 새 시즌 결과는 `data/records/*.json`에 객체를 1건 추가하는
  방식으로 갱신합니다 (코드 변경 불필요).
- 세계지도는 스타일라이즈된 개략도이며, 정밀 지리 정보 용도로는 사용할 수 없습니다.
