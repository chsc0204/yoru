import { loadDataset } from "./dataLoader.js";
import { store } from "./store.js";
import { initRouter, navigateTo } from "./router.js";
import { debounce, showToast } from "./utils.js";
import * as favoritesRepository from "./favoritesRepository.js";
import * as recentlyViewed from "./recentlyViewed.js";

const SEARCH_DEBOUNCE_MS = 250;
const SCROLL_TOP_VISIBLE_AFTER_PX = 480;
const HEADER_SCROLLED_AFTER_PX = 8;

/** @type {Object} 전 페이지에 공유되는 컨텍스트. store와 리포지토리 접근자를 한데 모은다. */
const ctx = {
  store,
  navigateTo,
  favoritesRepository,
  recentlyViewed,
  showToast,
};

async function bootstrap() {
  setupHeaderInteractions();
  setupScrollToTopButton();

  store.setState({
    favorites: favoritesRepository.getFavoriteTeamIds(),
    recentlyViewed: recentlyViewed.getRecentlyViewed(),
  });

  try {
    const dataset = await loadDataset();
    store.setState({ dataset, isLoading: false, loadError: null });
  } catch (error) {
    console.error("[app] 데이터셋 로드 실패", error);
    store.setState({ isLoading: false, loadError: error });
  }

  const appRoot = document.getElementById("app");
  initRouter(appRoot, ctx);
}

/** 헤더의 검색창, 햄버거 메뉴, 모바일 드로어 인터랙션을 연결한다. */
function setupHeaderInteractions() {
  const header = document.getElementById("site-header");
  const searchForm = document.getElementById("global-search-form");
  const searchInput = document.getElementById("global-search-input");
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const drawer = document.getElementById("mobile-nav-drawer");
  const backdrop = document.getElementById("mobile-nav-backdrop");

  window.addEventListener(
    "scroll",
    () => {
      header.classList.toggle("is-scrolled", window.scrollY > HEADER_SCROLLED_AFTER_PX);
    },
    { passive: true }
  );

  const runSearchNavigation = debounce((value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    store.setState({ searchQuery: trimmed });
    navigateTo(`search?q=${encodeURIComponent(trimmed)}`);
  }, SEARCH_DEBOUNCE_MS);

  searchInput.addEventListener("input", (event) => runSearchNavigation(event.target.value));
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const trimmed = searchInput.value.trim();
    if (trimmed) {
      store.setState({ searchQuery: trimmed });
      navigateTo(`search?q=${encodeURIComponent(trimmed)}`);
    }
  });

  // 검색 페이지 내부 입력창 등 다른 곳에서 검색어가 바뀌어도 헤더 검색창 표시를 동기화한다.
  store.subscribe((state) => {
    if (document.activeElement !== searchInput) {
      searchInput.value = state.searchQuery || "";
    }
  });

  function openDrawer() {
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.removeAttribute("hidden");
    hamburgerBtn.setAttribute("aria-expanded", "true");
  }
  function closeDrawer() {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.setAttribute("hidden", "");
    hamburgerBtn.setAttribute("aria-expanded", "false");
  }

  hamburgerBtn.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("is-open");
    if (isOpen) closeDrawer();
    else openDrawer();
  });
  backdrop.addEventListener("click", closeDrawer);
  drawer.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeDrawer));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDrawer();
  });
}

/** 스크롤이 일정 위치를 넘으면 "맨 위로" 버튼을 노출하고 클릭 시 스크롤을 되돌린다. */
function setupScrollToTopButton() {
  const button = document.getElementById("scroll-top-btn");
  button.removeAttribute("hidden");

  window.addEventListener(
    "scroll",
    () => {
      const shouldShow = window.scrollY > SCROLL_TOP_VISIBLE_AFTER_PX;
      button.classList.toggle("is-visible", shouldShow);
    },
    { passive: true }
  );

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    button.focus();
  });
}

bootstrap();
