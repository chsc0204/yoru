"use strict";

/* =========================================================
   Icon set (inline SVG, stroke-based, no external assets)
   ========================================================= */
const ICONS = {
  html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 3 5.5 20 12 22 18.5 20 20 3"/><path d="M8 7h8l-.6 6.5L12 15l-3.4-1.5L8.3 10"/></svg>',
  css: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 13h3M8 17h6"/></svg>',
  js: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H4v18h4"/><path d="M16 3h4v18h-4"/></svg>',
  python: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17V7l8-4 8 4v10l-8 4-8-4z"/><circle cx="12" cy="12" r="2.4"/></svg>',
  git: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4 1.5-4-2-6-2m12 4v-3.4c0-1 .3-1.6 1-2.2-3.3-.4-6.7-1.6-6.7-7.3a5.7 5.7 0 0 1 1.5-4c-.2-.4-.6-2 .1-4 0 0 1.3-.4 4.1 1.6a13.9 13.9 0 0 1 7.4 0c2.8-2 4.1-1.6 4.1-1.6.7 2 .3 3.6.1 4a5.7 5.7 0 0 1 1.5 4c0 5.7-3.4 6.9-6.7 7.3.5.5 1 1.4 1 2.9V19"/></svg>',
  node: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4.5v11L12 22l-8-4.5v-11z"/><path d="M12 12 4 6.5M12 12l8-5.5M12 12v10"/></svg>',
  npm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="1"/><path d="M8 7V4h8v3"/></svg>',
  ai: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z"/><path d="M18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9z"/></svg>',
  vscode: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3l5 3v12l-5 3-9-7 9-7-5-4z"/><path d="M2 12l5-3.5"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  calendarCheck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M9 15l2 2 4-4"/></svg>',
  shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h3.5L16 18h5"/><path d="M17 6h4v4M3 18h3.5L11 12"/><path d="M17 18h4v-4"/></svg>',
  palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-.5-1.5-.5-2 .5-1 1.5-1h1a5 5 0 0 0 5-5c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16.5" cy="10.5" r="1"/></svg>',
  calculator: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6 2 12l6 6M16 6l6 6-6 6"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.8" fill="currentColor"/></svg>',
  activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2.5-7 4 14 2.5-7H21"/></svg>',
};

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    if (e.target.closest('[aria-disabled="true"]')) e.preventDefault();
  });

  renderIcons();
  initThemeToggle();
  initMobileNav();
  initActiveNav();

  // Content-generating sections must run before initScrollReveal(),
  // otherwise the .reveal elements they create are never observed.
  initSkills();
  initProjects();
  initLearned();
  initPlayground();
  initTimeline();
  initActivityGrid();
  initDevNotes();
  initDashboard();

  initScrollReveal();
  initCountUp();
  initDeveloperMode();
  initBackToTop();
});

/* =========================================================
   Dark / light mode toggle
   Persisted in localStorage so the choice survives a reload;
   the inline script in <head> applies it before first paint.
   ========================================================= */
function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  const icon = btn.querySelector("[data-icon]");

  function applyIcon(theme) {
    const isDark = theme === "dark";
    icon.innerHTML = ICONS[isDark ? "sun" : "moon"];
    btn.setAttribute("aria-pressed", String(isDark));
    btn.setAttribute("aria-label", isDark ? "라이트 모드로 전환" : "다크 모드로 전환");
  }

  applyIcon(document.documentElement.dataset.theme === "dark" ? "dark" : "light");

  btn.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    const next = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;

    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      // localStorage unavailable — theme still applies for this page view
    }

    applyIcon(next);
  });
}

/* =========================================================
   Populate every [data-icon] placeholder with its inline SVG
   ========================================================= */
function renderIcons() {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    const icon = ICONS[el.dataset.icon];
    if (icon) el.innerHTML = icon;
  });
}

/* =========================================================
   Mobile navigation
   ========================================================= */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  if (!toggle || !navList) return;

  toggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  navList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navList.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* =========================================================
   Active navigation on scroll
   ========================================================= */
function initActiveNav() {
  const navLinks = Array.from(document.querySelectorAll(".nav-list a"));
  if (!navLinks.length) return;

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === id);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* =========================================================
   Scroll reveal animation
   ========================================================= */
function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* =========================================================
   Count-up animation for stat/dashboard numbers
   ========================================================= */
const PREFERS_REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initCountUp() {
  const targets = document.querySelectorAll("[data-count-target]");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCountUp(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  targets.forEach((el) => observer.observe(el));
}

function animateCountUp(el) {
  const target = Number(el.dataset.countTarget);
  const suffix = el.dataset.countSuffix || "";

  if (PREFERS_REDUCED_MOTION) {
    el.textContent = `${target}${suffix}`;
    return;
  }

  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(target * progress);
    el.textContent = `${value}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/* =========================================================
   Skills data + rendering (grouped by category, hover
   description, animated "학습 경험" progress bar)
   ========================================================= */
const LEVEL_META = {
  learning: { label: "Learning", percent: 33 },
  practicing: { label: "Practicing", percent: 66 },
  experienced: { label: "Experienced", percent: 100 },
};

const skillGroups = [
  {
    category: "Frontend",
    skills: [
      { icon: "html", name: "HTML5", topics: "Web Structure · Semantic HTML", level: "experienced", desc: "시맨틱 태그로 이력서 웹페이지 등의 구조를 직접 설계했습니다." },
      { icon: "css", name: "CSS3", topics: "Layout · Flexbox · Grid · Responsive", level: "practicing", desc: "Flexbox/Grid로 반응형 레이아웃을 구성하는 연습을 하고 있습니다." },
      { icon: "js", name: "JavaScript", topics: "Variables · Functions · Arrays · Objects · DOM · Events", level: "practicing", desc: "Playground의 계산기·시계 등 실제 동작하는 기능을 구현했습니다." },
    ],
  },
  {
    category: "Programming",
    skills: [
      { icon: "python", name: "Python", topics: "Basic Syntax · pygame · Game Development", level: "practicing", desc: "pygame으로 Snake Game을 만들며 게임 루프와 충돌 처리를 익혔습니다." },
    ],
  },
  {
    category: "Development Tools",
    skills: [
      { icon: "git", name: "Git", topics: "Version Control · Commit · Branch / Push", level: "learning", desc: "add-commit-push 흐름으로 프로젝트 변경 이력을 관리하고 있습니다." },
      { icon: "github", name: "GitHub", topics: "Repository · README · GitHub Pages", level: "learning", desc: "원격 저장소에 프로젝트를 올리고 README로 문서화하는 연습을 합니다." },
      { icon: "node", name: "Node.js / npm", topics: "Development Environment · Package Management", level: "learning", desc: "로컬 개발 환경을 구성하고 패키지를 설치하는 데 사용했습니다." },
      { icon: "ai", name: "Claude Code", topics: "AI-assisted Coding · Development Workflow", level: "learning", desc: "요구사항을 정리해 AI와 함께 이 포트폴리오를 포함한 프로젝트를 만들었습니다." },
    ],
  },
  {
    category: "AI",
    skills: [
      { icon: "target", name: "Object Detection", topics: "TensorFlow.js · COCO-SSD", level: "learning", desc: "이미 학습된 AI 모델을 웹페이지에 불러와 활용하는 방법을 익혔습니다." },
    ],
  },
];

function initSkills() {
  const container = document.getElementById("skillsGrid");
  if (!container) return;

  container.innerHTML = skillGroups
    .map(
      (group) => `
    <div class="skill-category">
      <div class="skill-category-title">${group.category}</div>
      <div class="grid grid-4">
        ${group.skills
          .map((skill) => {
            const meta = LEVEL_META[skill.level];
            return `
          <div class="card skill-card reveal" tabindex="0">
            <div class="skill-icon" data-icon="${skill.icon}"></div>
            <div class="skill-name">${skill.name}</div>
            <div class="skill-topics">${skill.topics}</div>
            <span class="skill-level ${skill.level}">${meta.label}</span>
            <div class="skill-progress-track">
              <div class="skill-progress-bar" data-progress="${meta.percent}"></div>
            </div>
            <div class="skill-progress-caption">
              <span>학습 경험</span>
              <span>${meta.percent}%</span>
            </div>
            <div class="skill-desc">${skill.desc}</div>
          </div>
        `;
          })
          .join("")}
      </div>
    </div>
  `
    )
    .join("");

  renderIcons();
  animateSkillBarsOnView();
}

function animateSkillBarsOnView() {
  const bars = document.querySelectorAll(".skill-progress-bar");
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        bar.style.width = PREFERS_REDUCED_MOTION ? `${bar.dataset.progress}%` : "0%";
        requestAnimationFrame(() => {
          bar.style.width = `${bar.dataset.progress}%`;
        });
        obs.unobserve(bar);
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

/* =========================================================
   Projects data + rendering + modal
   ========================================================= */
const REPO_URL = "https://github.com/chsc0204/yoru";

const projects = [
  {
    title: "폰케이스 쇼핑몰",
    category: "HTML / CSS / JavaScript",
    filterCategories: ["HTML/CSS", "JavaScript"],
    tags: ["HTML", "CSS", "JavaScript"],
    description: "카테고리 필터, 검색, 장바구니, 다크 모드까지 갖춘 폰케이스 쇼핑몰 데모 사이트.",
    features: [
      "카테고리 필터 · 실시간 검색 · 상품 상세 모달",
      "장바구니(localStorage) · Checkout · 주문 완료 플로우",
      "다크 모드 토글(localStorage로 새로고침 후에도 유지)",
    ],
    process: "기존 상품 데이터와 파일 구조를 유지한 채, 헤더 · Hero · 상품 그리드 · 장바구니 · 체크아웃까지 실제 쇼핑몰 형태로 다듬었습니다.",
    learned: "localStorage로 장바구니/테마 상태를 영속화하는 방법과, CSS 변수로 라이트 · 다크 테마를 분리 설계하는 감각을 익혔습니다.",
    github: `${REPO_URL}`,
    demo: "projects/phone-case-shop/index.html",
  },
  {
    title: "Snake Game",
    category: "Python / pygame",
    filterCategories: ["Python"],
    tags: ["Python", "pygame"],
    description: "pygame을 활용해 제작한 스네이크 게임.",
    features: ["방향키 / WASD 조작", "먹이를 먹을수록 점수 상승 및 속도 증가", "게임오버 후 R키로 재시작"],
    process: "게임 루프(입력 처리 → 상태 업데이트 → 그리기)를 기본 구조로 잡고, 입력 반응이 느렸던 문제를 이동 타이머 분리로 해결했습니다.",
    learned: "화면 갱신 속도(FPS)와 게임 로직 속도를 분리해서 설계해야 한다는 점을 배웠습니다.",
    github: `${REPO_URL}`,
    demo: null,
  },
  {
    title: "Image Object Detection Web App",
    category: "HTML / CSS / JavaScript",
    filterCategories: ["HTML/CSS", "JavaScript", "AI"],
    tags: ["HTML", "CSS", "JavaScript", "TensorFlow.js"],
    description: "이미지를 업로드하고 객체를 탐지하는 웹 애플리케이션 실습.",
    features: ["이미지 업로드 및 미리보기", "COCO-SSD 모델로 객체 탐지", "탐지 결과를 박스와 확률로 표시"],
    process: "TensorFlow.js와 COCO-SSD 모델을 CDN으로 불러와, canvas에 탐지 박스와 라벨을 직접 그렸습니다.",
    learned: "이미 학습된 AI 모델을 웹 페이지에서 불러와 활용하는 방법을 익혔습니다.",
    github: `${REPO_URL}`,
    demo: "projects/object-detector.html",
  },
  {
    title: "Football Champions Archive",
    category: "HTML / CSS / JavaScript",
    filterCategories: ["HTML/CSS", "JavaScript"],
    tags: ["HTML", "CSS", "JavaScript", "Chart.js"],
    description: "2000년 이후 주요 축구 대회의 우승팀을 정리하고, 검색·필터·통계 시각화로 탐색할 수 있는 Client-only SPA.",
    features: [
      "대회별 챔피언 데이터베이스와 필터/검색",
      "팀 상세 페이지(타이틀 차트, 우승 연도 타임라인)",
      "통계 대시보드(추이·순위·히트맵·국가별 비중)",
      "FIFA 월드컵 세계지도, 즐겨찾기 · 최근 본 팀(LocalStorage)",
    ],
    process: "프로젝트 제안서의 요구사항을 기준으로 프레젠테이션/상태/데이터 접근 계층을 분리해 설계했습니다. fetch로 JSON 데이터를 불러오는 구조라 로컬 서버로 열어야 정상 동작합니다.",
    learned: "데이터 구조 설계와, 프레임워크 없이 상태 관리·라우팅을 직접 구현하는 방법을 배웠습니다.",
    github: `${REPO_URL}/tree/main/projects/football-champions`,
    demo: "projects/football-champions/index.html",
  },
  {
    title: "AI 도구 2025 하반기 인기 보고서",
    category: "Research / Documentation",
    filterCategories: ["Research"],
    tags: ["Research", "Documentation"],
    description: "2025년 하반기 인기 AI 도구를 조사하고 정리한 리포트.",
    features: [
      "웹 트래픽 · MAU/WAU · 개발자 설문 등 다지표 기반 조사 방법론",
      "챗봇 · 코딩 어시스턴트 · 이미지/영상 생성 도구 카테고리별 정리",
      "PDF · Word(.docx) · Markdown 원본 파일 다운로드 제공",
    ],
    process: "Similarweb, a16z, Menlo Ventures, Stack Overflow Developer Survey 등 여러 출처를 종합해 조사 방법론을 설계하고 카테고리별로 데이터를 정리했습니다.",
    learned: "여러 출처의 지표를 교차 검증해 신뢰도 있는 리서치 리포트를 구성하는 방법과, 하나의 리포트를 HTML/PDF/Word/Markdown 등 다양한 형식으로 배포하는 방법을 익혔습니다.",
    github: `${REPO_URL}/tree/main/projects/ai-tools-report`,
    demo: "projects/ai-tools-report/index.html",
  },
  {
    title: "J-POP Archive",
    category: "HTML / CSS / JavaScript",
    filterCategories: ["HTML/CSS", "JavaScript"],
    tags: ["HTML", "CSS", "JavaScript", "Chart.js"],
    description: "아티스트/곡/앨범 정보와 랭킹, 일본어 학습 퀴즈까지 포함한 SPA(싱글 페이지 애플리케이션).",
    features: [
      "아티스트 · 곡 · 앨범 탐색, 검색/필터/정렬, 즐겨찾기(localStorage)",
      "Rankings(Top Artists/Songs/Albums) + Chart.js 통계 시각화",
      "Japanese Study — JLPT 레벨별 학습 카드 + 랜덤 퀴즈",
    ],
    process: "해시 라우터로 9개 페이지를 전환하는 프레임워크 없는 SPA 구조로 설계하고, fetch/JSON 대신 순수 JS 데이터 파일로 관리해 file://로도 바로 열리도록 만들었습니다.",
    learned: "해시 기반 라우팅과 Chart.js 캔버스 재사용(destroy) 처리, localStorage로 즐겨찾기/최근 본 항목을 관리하는 방법을 익혔습니다.",
    github: `${REPO_URL}/tree/main/projects/jpop-archive`,
    demo: "projects/jpop-archive/index.html",
  },
];

function initProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  grid.innerHTML = projects
    .map(
      (project, index) => `
    <article class="card project-card reveal" data-project-card="${index}">
      <div class="project-index">PROJECT ${String(index + 1).padStart(2, "0")}</div>
      <h3 class="project-title">${project.title}</h3>
      <div class="project-tags">${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      <p class="project-desc">${project.description}</p>
      <button class="btn btn-outline" data-project-index="${index}">View Details</button>
    </article>
  `
    )
    .join("");

  grid.querySelectorAll("[data-project-index]").forEach((btn) => {
    btn.addEventListener("click", () => openProjectModal(projects[Number(btn.dataset.projectIndex)]));
  });

  setupModal("projectModal");
  initProjectFilter();
  renderRecentlyViewed();
}

/* ---- Project category filter ---- */
function initProjectFilter() {
  const bar = document.getElementById("projectFilterBar");
  if (!bar) return;

  const categories = [];
  projects.forEach((p) => {
    p.filterCategories.forEach((c) => {
      if (!categories.includes(c)) categories.push(c);
    });
  });

  bar.innerHTML = ["ALL", ...categories]
    .map((c, i) => `<button type="button" class="filter-chip${i === 0 ? " active" : ""}" data-filter="${c}">${c}</button>`)
    .join("");

  bar.addEventListener("click", (e) => {
    const chip = e.target.closest(".filter-chip");
    if (!chip) return;

    bar.querySelectorAll(".filter-chip").forEach((el) => el.classList.remove("active"));
    chip.classList.add("active");
    applyProjectFilter(chip.dataset.filter);
  });
}

function applyProjectFilter(filter) {
  document.querySelectorAll("[data-project-card]").forEach((card) => {
    const project = projects[Number(card.dataset.projectCard)];
    const show = filter === "ALL" || project.filterCategories.includes(filter);
    card.classList.toggle("is-hidden", !show);
  });
}

/* ---- Recently viewed projects (persisted in localStorage) ---- */
const RECENT_PROJECTS_KEY = "recentlyViewedProjects";

function getRecentProjectTitles() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_PROJECTS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function addRecentProjectTitle(title) {
  const list = [title, ...getRecentProjectTitles().filter((t) => t !== title)].slice(0, 3);
  try {
    localStorage.setItem(RECENT_PROJECTS_KEY, JSON.stringify(list));
  } catch (e) {
    // localStorage unavailable — recently-viewed just won't persist
  }
  renderRecentlyViewed();
}

function renderRecentlyViewed() {
  const wrap = document.getElementById("recentlyViewed");
  const listEl = document.getElementById("recentlyViewedList");
  if (!wrap || !listEl) return;

  const titles = getRecentProjectTitles();
  wrap.classList.toggle("is-empty", titles.length === 0);

  listEl.innerHTML = titles
    .map((title) => `<button type="button" class="recent-chip" data-recent-title="${title}">${title}</button>`)
    .join("");

  listEl.querySelectorAll("[data-recent-title]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const project = projects.find((p) => p.title === chip.dataset.recentTitle);
      if (project) openProjectModal(project);
    });
  });
}

function openProjectModal(project) {
  const modal = document.getElementById("projectModal");
  if (!modal) return;

  addRecentProjectTitle(project.title);

  modal.querySelector(".modal-title").textContent = project.title;
  modal.querySelector(".modal-tags").innerHTML = project.tags
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join("");
  modal.querySelector(".modal-desc").textContent = project.description;
  modal.querySelector(".modal-features").innerHTML = project.features
    .map((item) => `<li>${item}</li>`)
    .join("");
  modal.querySelector(".modal-process").textContent = project.process;
  modal.querySelector(".modal-learned").textContent = project.learned;

  const githubBtn = modal.querySelector(".modal-github");
  const demoBtn = modal.querySelector(".modal-demo");

  if (project.github) {
    githubBtn.href = project.github;
    githubBtn.removeAttribute("aria-disabled");
    githubBtn.removeAttribute("tabindex");
  } else {
    githubBtn.href = "#";
    githubBtn.setAttribute("aria-disabled", "true");
    githubBtn.setAttribute("tabindex", "-1");
  }

  if (project.demo) {
    demoBtn.href = project.demo;
    demoBtn.removeAttribute("aria-disabled");
    demoBtn.removeAttribute("tabindex");
  } else {
    demoBtn.href = "#";
    demoBtn.setAttribute("aria-disabled", "true");
    demoBtn.setAttribute("tabindex", "-1");
  }

  openModal(modal);
}

/* =========================================================
   Generic modal open/close (ESC + backdrop click)
   ========================================================= */
function setupModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(modal);
  });

  modal.querySelectorAll("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(modal));
  });
}

function openModal(modal) {
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal-close")?.focus();

  document.addEventListener("keydown", escCloseHandler);

  function escCloseHandler(e) {
    if (e.key === "Escape") {
      closeModal(modal);
      document.removeEventListener("keydown", escCloseHandler);
    }
  }
}

function closeModal(modal) {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

/* =========================================================
   Learning Journey timeline data + rendering
   ========================================================= */
const timeline = [
  { field: "HTML / CSS", summary: "웹페이지의 기본 구조와 레이아웃 학습", practice: "이력서 웹페이지 제작", stack: ["HTML5", "CSS3"] },
  { field: "JavaScript", summary: "웹페이지에 동적인 기능 추가", practice: "Playground 기능 구현 (계산기, 캘린더 등)", stack: ["JavaScript", "DOM"] },
  { field: "Python", summary: "Python 기본 문법과 pygame 활용", practice: "Snake Game 제작", stack: ["Python", "pygame"] },
  { field: "Git / GitHub", summary: "버전 관리와 GitHub Repository 관리", practice: "프로젝트를 GitHub에 커밋·푸시", stack: ["Git", "GitHub"] },
  { field: "Claude Code", summary: "AI 코딩 도구를 활용한 프로젝트 개발 경험", practice: "이 포트폴리오 사이트 개발", stack: ["Claude Code"] },
  { field: "AI / Object Detection", summary: "Object Detection을 활용한 웹 앱 구현", practice: "Image Object Detection Web App 제작", stack: ["TensorFlow.js", "COCO-SSD"] },
  { field: "Web Portfolio", summary: "배운 것들을 하나의 인터랙티브 포트폴리오로 정리", practice: "My Development Journey 제작", stack: ["HTML", "CSS", "JavaScript"] },
];

function initTimeline() {
  const container = document.getElementById("timelineGrid");
  if (!container) return;

  container.innerHTML = timeline
    .map(
      (step, index) => `
    <div class="timeline-step reveal" style="transition-delay:${index * 70}ms">
      <div class="timeline-label">STEP ${String(index + 1).padStart(2, "0")}</div>
      <h3>${step.field}</h3>
      <p>${step.summary}</p>
      <div class="timeline-meta"><strong>대표 실습:</strong> ${step.practice}</div>
      <div class="timeline-stack">${step.stack.map((s) => `<span class="tag">${s}</span>`).join("")}</div>
    </div>
  `
    )
    .join("");
}

/* =========================================================
   What I Learned — accordion cards
   ========================================================= */
const whatILearned = [
  { field: "HTML/CSS", insight: "웹페이지 구조와 레이아웃을 직접 구성하는 방법", detail: "시맨틱 태그로 의미 있는 구조를 만들고, Flexbox/Grid로 레이아웃을 잡는 감각을 이력서 웹페이지를 만들며 익혔습니다." },
  { field: "JavaScript", insight: "사용자 입력과 조건문, 반복문을 활용한 동적 기능 구현", detail: "Playground의 계산기·캘린더 등을 만들며 이벤트 처리와 DOM 조작으로 실제 동작하는 기능을 구현했습니다." },
  { field: "Python", insight: "pygame을 활용한 간단한 게임 제작", detail: "게임 루프(입력→상태 업데이트→그리기) 구조와, 입력 반응성과 이동 속도를 분리하는 설계를 Snake Game으로 경험했습니다." },
  { field: "Git/GitHub", insight: "코드 버전 관리와 GitHub Pages를 이용한 배포 경험", detail: "add-commit-push 흐름으로 변경 이력을 관리하고, 원격 저장소를 통해 프로젝트를 온라인에 올리는 과정을 익혔습니다." },
  { field: "Claude Code", insight: "AI 코딩 도구를 활용한 프로젝트 개발 경험", detail: "구체적인 요구사항과 프로젝트 구조를 명확히 전달할수록 더 좋은 결과로 이어진다는 것을 이 포트폴리오를 만들며 배웠습니다." },
  { field: "AI", insight: "Object Detection을 활용한 웹 애플리케이션 구현 경험", detail: "이미 학습된 AI 모델(COCO-SSD)을 웹페이지에 불러와 이미지 속 물체를 인식하고 시각화하는 방법을 익혔습니다." },
];

function initLearned() {
  const container = document.getElementById("learnedGrid");
  if (!container) return;

  container.innerHTML = whatILearned
    .map(
      (item, index) => `
    <article class="card learn-card reveal" data-learn-index="${index}" tabindex="0" role="button" aria-expanded="false">
      <div class="learn-card-head">
        <div class="learn-arrow">${item.field} <span class="arrow-sep">→</span> ${item.insight}</div>
        <span class="learn-toggle-icon" data-icon="chevron"></span>
      </div>
      <p class="learn-detail">${item.detail}</p>
    </article>
  `
    )
    .join("");

  renderIcons();

  container.querySelectorAll("[data-learn-index]").forEach((card) => {
    const toggle = () => {
      const isOpen = card.classList.toggle("open");
      card.setAttribute("aria-expanded", String(isOpen));
    };
    card.addEventListener("click", toggle);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });
}

/* =========================================================
   Learning Activity — GitHub-style heatmap
   ========================================================= */
const ACTIVITY_LABELS = [
  "HTML/CSS 공부", "JavaScript 공부", "Python 프로젝트", "Git 실습",
  "Claude Code로 개발", "프로젝트 리팩터링", "버그 수정", "새 기능 추가",
  "문서 정리", "알고리즘 연습",
];

function generateActivityData(weeks = 20) {
  const days = 7;
  const total = weeks * days;
  const today = new Date();
  const data = [];

  for (let i = 0; i < total; i++) {
    const level = (i * 3 + Math.floor(i / 7) * 2) % 5;
    const date = new Date(today);
    date.setDate(today.getDate() - (total - 1 - i));

    data.push({
      level,
      date,
      label: level > 0 ? ACTIVITY_LABELS[i % ACTIVITY_LABELS.length] : null,
    });
  }

  return data;
}

const activityData = generateActivityData();

function initActivityGrid() {
  const grid = document.getElementById("activityGrid");
  const tooltip = document.getElementById("activityTooltip");
  if (!grid) return;

  grid.innerHTML = activityData
    .map((cell) => {
      const dateLabel = `${cell.date.getMonth() + 1}월 ${cell.date.getDate()}일`;
      const text = cell.label ? `${dateLabel} · ${cell.label}` : `${dateLabel} · 활동 없음`;
      return `<button type="button" class="activity-cell" data-level="${cell.level}" data-tooltip="${text}" aria-label="${text}"></button>`;
    })
    .join("");

  if (!tooltip) return;
  const defaultText = tooltip.textContent;

  grid.querySelectorAll(".activity-cell").forEach((cell) => {
    cell.addEventListener("mouseenter", () => {
      tooltip.textContent = cell.dataset.tooltip;
    });
    cell.addEventListener("focus", () => {
      tooltip.textContent = cell.dataset.tooltip;
    });
    cell.addEventListener("mouseleave", () => {
      tooltip.textContent = defaultText;
    });
    cell.addEventListener("blur", () => {
      tooltip.textContent = defaultText;
    });
  });
}

/* =========================================================
   Dashboard summary cards (numbers computed from real data)
   ========================================================= */
function initDashboard() {
  const grid = document.getElementById("dashboardGrid");
  if (!grid) return;

  const technologiesCount = skillGroups.reduce((sum, group) => sum + group.skills.length, 0);
  const completedActivities = activityData.filter((c) => c.level > 0).length;

  const summary = [
    { icon: "layers", target: whatILearned.length, label: "Learning Topics" },
    { icon: "code", target: projects.length, label: "Projects" },
    { icon: "target", target: technologiesCount, label: "Technologies" },
    { icon: "activity", target: completedActivities, label: "Completed Activities", suffix: "+" },
  ];

  grid.innerHTML = summary
    .map(
      (item) => `
    <div class="dashboard-card reveal">
      <div class="dashboard-icon" data-icon="${item.icon}"></div>
      <div>
        <div class="dashboard-number" data-count-target="${item.target}" data-count-suffix="${item.suffix || ""}">0${item.suffix || ""}</div>
        <div class="dashboard-label">${item.label}</div>
      </div>
    </div>
  `
    )
    .join("");

  renderIcons();
}

/* =========================================================
   Dev Notes modal
   ========================================================= */
const devNotes = [
  {
    tag: "HTML & CSS",
    title: "HTML과 CSS의 역할 차이",
    body: "HTML은 웹페이지의 구조를 만들고, CSS는 그 구조에 스타일(색상, 레이아웃, 간격 등)을 입힙니다. 역할을 분리해서 생각하면 코드를 훨씬 깔끔하게 관리할 수 있습니다.",
  },
  {
    tag: "Git & GitHub",
    title: "Git과 GitHub의 차이",
    body: "Git은 버전 관리 도구이고, GitHub는 Git 저장소(Repository)를 온라인에서 관리하고 공유할 수 있는 플랫폼입니다. Git이 없어도 코드는 짤 수 있지만, 변경 이력을 추적하려면 Git이 필요합니다.",
  },
  {
    tag: "Git Workflow",
    title: "git add / commit / push",
    body: "파일을 수정한 후 GitHub에 업로드하는 기본적인 과정입니다. add로 변경 사항을 스테이징하고, commit으로 하나의 저장 지점을 만들고, push로 원격 저장소에 반영합니다.",
  },
  {
    tag: "Claude Code",
    title: "Claude Code를 사용하면서 배운 점",
    body: "AI에게 원하는 결과를 얻기 위해서는 구체적인 요구사항과 프로젝트 구조를 명확하게 전달하는 것이 중요했습니다. 모호한 요청보다 명확한 요청이 훨씬 좋은 결과로 이어졌습니다.",
  },
];

function initDevNotes() {
  const grid = document.getElementById("notesGrid");
  if (!grid) return;

  grid.innerHTML = devNotes
    .map(
      (note, index) => `
    <article class="card note-card reveal" data-note-index="${index}" tabindex="0" role="button" aria-haspopup="dialog">
      <span class="note-tag">${note.tag}</span>
      <h3>${note.title}</h3>
      <p>${note.body}</p>
    </article>
  `
    )
    .join("");

  const modal = document.getElementById("noteModal");
  setupModal("noteModal");

  grid.querySelectorAll("[data-note-index]").forEach((card) => {
    const open = () => {
      const note = devNotes[Number(card.dataset.noteIndex)];
      modal.querySelector(".modal-title").textContent = note.title;
      modal.querySelector(".modal-desc").textContent = note.body;
      openModal(modal);
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });
}

/* =========================================================
   Playground
   ========================================================= */
function initPlayground() {
  document.querySelectorAll(".try-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".playground-card").classList.add("active");
    });
  });

  initMonthEndCalculator();
  initLeapYearChecker();
  initRandomNumberGenerator();
  initColorGenerator();
  initCalculator();
  initDigitalClock();
}

/* ---- 1. Month-end calculator ---- */
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function initMonthEndCalculator() {
  const form = document.getElementById("monthEndForm");
  if (!form) return;
  const result = document.getElementById("monthEndResult");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const year = Number(form.year.value);
    const month = Number(form.month.value);

    if (!year || !month || month < 1 || month > 12) {
      result.textContent = "연도와 월(1~12)을 올바르게 입력해주세요.";
      result.classList.add("error");
      return;
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    let message = `${year}년 ${month}월은 ${daysInMonth}일까지 있습니다.`;
    if (month === 2) {
      message += isLeapYear(year) ? " 윤년입니다." : " 윤년이 아닙니다.";
    }
    result.textContent = message;
    result.classList.remove("error");
  });
}

/* ---- 2. Leap year checker ---- */
function initLeapYearChecker() {
  const form = document.getElementById("leapYearForm");
  if (!form) return;
  const result = document.getElementById("leapYearResult");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const year = Number(form.year.value);

    if (!year || year < 1) {
      result.textContent = "올바른 연도를 입력해주세요.";
      result.classList.add("error");
      return;
    }

    result.textContent = `${year}년은 ${isLeapYear(year) ? "윤년입니다." : "윤년이 아닙니다."}`;
    result.classList.remove("error");
  });
}

/* ---- 3. Random number generator ---- */
function initRandomNumberGenerator() {
  const form = document.getElementById("randomForm");
  if (!form) return;
  const result = document.getElementById("randomResult");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const min = Number(form.min.value);
    const max = Number(form.max.value);

    if (Number.isNaN(min) || Number.isNaN(max) || min > max) {
      result.textContent = "최솟값이 최댓값보다 작거나 같아야 합니다.";
      result.classList.add("error");
      return;
    }

    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    result.textContent = `생성된 숫자: ${value}`;
    result.classList.remove("error");
  });
}

/* ---- 4. Color generator ---- */
function initColorGenerator() {
  const btn = document.getElementById("colorGenerateBtn");
  if (!btn) return;
  const preview = document.getElementById("colorPreview");
  const hexEl = document.getElementById("colorHex");
  const rgbEl = document.getElementById("colorRgb");

  btn.addEventListener("click", () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const hex = `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;

    preview.style.background = hex;
    hexEl.textContent = hex.toUpperCase();
    rgbEl.textContent = `rgb(${r}, ${g}, ${b})`;
  });
}

/* ---- 5. Simple calculator ---- */
function initCalculator() {
  const display = document.getElementById("calcDisplay");
  const keys = document.getElementById("calcKeys");
  if (!display || !keys) return;

  let current = "0";
  let previous = null;
  let operator = null;
  let shouldReset = false;

  function updateDisplay() {
    display.textContent = current;
  }

  function calculate(a, b, op) {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return b === 0 ? NaN : a / b;
      default:
        return b;
    }
  }

  keys.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const value = btn.dataset.value;
    const action = btn.dataset.action;

    if (action === "clear") {
      current = "0";
      previous = null;
      operator = null;
      shouldReset = false;
    } else if (action === "decimal") {
      if (shouldReset) {
        current = "0";
        shouldReset = false;
      }
      if (!current.includes(".")) current += ".";
    } else if (action === "operator") {
      if (operator && previous !== null && !shouldReset) {
        const result = calculate(previous, Number(current), operator);
        current = Number.isNaN(result) ? "오류" : String(result);
        previous = Number.isNaN(result) ? null : result;
      } else {
        previous = Number(current);
      }
      operator = value;
      shouldReset = true;
    } else if (action === "equals") {
      if (operator && previous !== null) {
        const result = calculate(previous, Number(current), operator);
        current = Number.isNaN(result) ? "0으로 나눌 수 없습니다" : String(result);
        previous = null;
        operator = null;
        shouldReset = true;
      }
    } else if (value !== undefined) {
      if (shouldReset || current === "0") {
        current = value;
        shouldReset = false;
      } else {
        current += value;
      }
    }

    updateDisplay();
  });
}

/* ---- 6. Digital clock ---- */
function initDigitalClock() {
  const timeEl = document.getElementById("clockTime");
  const dateEl = document.getElementById("clockDate");
  if (!timeEl || !dateEl) return;

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    timeEl.textContent = `${h}:${m}:${s}`;
    dateEl.textContent = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 (${weekdays[now.getDay()]})`;
  }

  tick();
  setInterval(tick, 1000);
}

/* =========================================================
   Developer Mode (fun terminal animation)
   ========================================================= */
function initDeveloperMode() {
  const btn = document.getElementById("devModeBtn");
  const output = document.getElementById("devModeOutput");
  if (!btn || !output) return;

  const lines = [
    "> Initializing portfolio...",
    "> Loading skills...",
    "> Loading projects...",
    "> Loading curiosity...",
    "> Done!",
  ];

  btn.addEventListener("click", () => {
    btn.disabled = true;
    output.innerHTML = "";

    lines.forEach((line, index) => {
      setTimeout(() => {
        const p = document.createElement("p");
        p.className = "dev-terminal-line";
        p.textContent = line;
        output.appendChild(p);
        requestAnimationFrame(() => p.classList.add("show"));

        if (index === lines.length - 1) {
          setTimeout(() => {
            const done = document.createElement("p");
            done.className = "dev-terminal-line done";
            done.textContent = "Developer Mode Activated.";
            output.appendChild(done);
            requestAnimationFrame(() => done.classList.add("show"));
            btn.disabled = false;
          }, 500);
        }
      }, index * 500);
    });
  });
}

/* =========================================================
   Back to top
   ========================================================= */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 480);
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

