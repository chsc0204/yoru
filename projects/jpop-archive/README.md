# J-POP ARCHIVE 🎧

일본 음악(J-POP)을 탐색하는 **인터랙티브 음악 아카이브**입니다. 아티스트·곡·앨범 정보,
랭킹, 음악 통계 시각화, 일본어 학습(퀴즈 포함), 즐겨찾기까지 하나의 사이트에 통합했습니다.
실제 음원 재생·스트리밍 기능은 없으며, "MV 보기" 버튼은 항상 유효하게 열리는 YouTube
검색 결과 페이지로 연결됩니다. React/Vue 등 프레임워크나 백엔드 서버 없이 순수
HTML5 / CSS3 / JavaScript(ES6+) + Chart.js만으로 동작합니다.

> ⚠️ **데이터 안내**: 아티스트/곡의 인기도(popularity) 수치와 랭킹은 실제 공식 차트를
> 그대로 가져온 것이 아니라, 실제 인기도를 참고해 구성한 **학습용 예시 데이터**입니다.
> (Rankings 페이지에도 동일한 안내 문구가 표시됩니다.)

---

## 1. 실행 방법

모든 데이터를 JS 객체/배열(`js/data/*.js`)로 관리하므로 **로컬 서버 없이 바로 열어도
정상 동작**합니다.

1. `index.html`을 더블클릭해서 기본 브라우저로 열기
2. 또는 로컬 서버로 열기
   ```bash
   cd projects/jpop-archive
   python -m http.server 8000
   ```
   브라우저에서 `http://localhost:8000` 접속
3. GitHub Pages로 배포된 경우 해당 URL로 바로 접속

Chart.js는 CDN(`cdn.jsdelivr.net`)에서 불러오므로 차트가 보이려면 인터넷 연결이 필요합니다
(인터넷이 없어도 나머지 페이지·검색·즐겨찾기·퀴즈 기능은 정상 동작합니다).

---

## 2. 폴더 구조

```
jpop-archive/
├─ index.html                # 앱 셸 (헤더/내비/검색/#app 마운트 포인트)
├─ css/
│  ├─ style.css               # 리셋 + 디자인 토큰(다크 테마) + 레이아웃 + 컴포넌트
│  ├─ responsive.css          # 태블릿(~1199px) / 모바일(≤767px, ≤480px) 대응
│  └─ animations.css          # 등장 애니메이션, scroll reveal
├─ js/
│  ├─ data/
│  │  ├─ artists.js           # 아티스트 20명
│  │  ├─ songs.js             # 곡 40개 (아티스트당 2곡)
│  │  ├─ albums.js            # 앨범 20개 (아티스트당 1개)
│  │  └─ vocabulary.js        # 일본어 학습 카드 30개
│  ├─ utils.js                # 포맷팅, 별점, 그라디언트 커버아트, YouTube 검색 링크 등
│  ├─ favoritesRepository.js  # 즐겨찾기 (localStorage)
│  ├─ recentlyViewed.js       # 최근 본 아티스트/곡 (localStorage, 최대 5개)
│  ├─ searchEngine.js         # 통합 검색 (Artists/Songs/Albums)
│  ├─ components.js           # 카드/행 등 공용 HTML 컴포넌트 + 이벤트 위임 바인딩
│  ├─ router.js               # 해시 기반 라우터 (#artists, #songs/:id 등)
│  ├─ app.js                  # 부트스트랩 (네비게이션, 검색창, 즐겨찾기 카운트, scroll reveal)
│  └─ pages/                  # 9개 페이지 렌더 함수 (dashboard/artists/artistDetail/...)
└─ assets/images/             # (예약 폴더, 현재 비어있음 — 아래 "커버 아트" 참고)
```

---

## 3. 주요 기능

| 페이지 | 구현 내용 |
|---|---|
| Dashboard | Hero, Today's Picks, Popular Artists, Trending Songs, Latest Releases, Music Statistics, 연도별 발매 추이 차트, Recently Viewed |
| Artists | 20명 그리드, 이름 검색 · 장르/데뷔년도 필터 · Popularity/이름/데뷔년도 정렬 |
| Artist Detail | 소개, Popular Songs, Albums, Popularity/Songs/Albums·Yearly Activity 차트, Related Artists, 즐겨찾기 |
| Songs | 40곡 리스트, 곡명/아티스트명 검색 · 장르/아티스트 필터 · Popularity/최신/오래된순/가나다 정렬 |
| Song Detail | 곡 정보, ▶ MV 보기(YouTube 검색 링크), 즐겨찾기, 관련 Japanese Study 카드 |
| Albums | 20개 그리드, 앨범명 검색 · 장르 필터 · 정렬 |
| Album Detail | 커버, 앨범 정보, Track List(클릭 시 Song Detail로 이동), 즐겨찾기 |
| Rankings | Top Artists/Songs/Albums(1~10위, 순위+이름+점수+변화량), Rising Artists, Popularity/Genre/Yearly 차트 |
| Japanese Study | 30개 학습 카드, JLPT 레벨·카테고리 필터, 5문제 랜덤 퀴즈(정답/오답 피드백 + 점수) |
| Favorites | 즐겨찾기한 아티스트/곡/앨범, Recently Viewed, 빈 상태 안내 |

공통: 전역 검색(헤더), 즐겨찾기 ♡→♥ 토글, 최근 본 항목(localStorage), Toast 알림,
스크롤 reveal 애니메이션, 반응형 레이아웃(모바일에서 내비게이션 축소·그리드 열 변경·
차트 크기 조정 등).

---

## 4. 기술 스택 및 설계 결정

- **프레임워크 미사용**: React/Vue 없이 해시 라우터(`router.js`)로 9개 페이지를 전환합니다.
- **데이터는 순수 JS 파일**: `fetch`/JSON 대신 `js/data/*.js`에 `const ARTISTS = [...]` 형태로
  직접 관리해, `file://`로 더블클릭해서 열어도 CORS 문제 없이 바로 동작합니다.
- **커버 아트는 실제 이미지 대신 그라디언트 + 이니셜**로 생성합니다(`utils.js`의
  `coverArtHTML`/`gradientForId`). 실존 아티스트의 초상권 문제를 피하면서도 항목마다
  시각적으로 구분되는 커버를 결정적(항상 같은 입력 → 같은 색상)으로 만들어줍니다.
  색상은 무작위 HSL이 아니라 **다크 UI에 어울리도록 미리 골라둔 16종의 보석톤 듀오톤
  팔레트**(`COVER_GRADIENTS`)에서 고르고, 각도(120°/135°/150°)도 색상과 다른 시드로 뽑아
  같은 팔레트가 걸려도 카드가 완전히 똑같아 보이지 않도록 했습니다.
- **MV 링크는 특정 영상 URL을 추측하지 않고, "아티스트 + 곡명" YouTube 검색 결과 페이지로
  연결**합니다. 항상 유효하게 열리며, 실제로 존재하지 않는 영상 링크를 잘못 안내할 위험이
  없습니다.
- **Chart.js는 CDN(defer)으로 로드**하고, 페이지 전환 시 이전 캔버스의 Chart 인스턴스를
  반드시 `destroy()` 한 뒤 새로 그립니다(`router.js`의 `registerChart`/`destroyActiveCharts`).
- **가사 미포함**: 저작권이 있는 실제 가사는 저장/표시하지 않고, 곡 제목·컨셉에서 착안한
  짧은 학습용 단어/표현만 `vocabulary.js`에 담았습니다.

---

## 5. 알려진 제한사항 (Out of Scope) / 추가 개선 아이디어

- 실제 음원 재생, 로그인/회원 시스템은 포함하지 않습니다.
- 아티스트당 곡 2개·앨범 1개로 데이터가 균일해, Artist Detail의 "Songs/Albums" 통계 막대가
  아티스트마다 크게 다르지 않습니다 — 데이터를 확장하면 더 다채로워집니다.
- 아티스트 사진 등 실제 이미지 자산은 포함하지 않았습니다(그라디언트 커버로 대체).
- 검색/필터 상태는 페이지를 벗어나면 초기화됩니다(즐겨찾기·최근 본 항목·다크 모드 같은
  개인화 상태만 localStorage로 유지).
