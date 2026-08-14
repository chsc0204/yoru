import { escapeHtml } from "../utils.js";

/**
 * 즐겨찾기 화면 (FR-7.x) + 최근 본 팀 (추가 기능 요구사항).
 * @param {HTMLElement} container
 * @param {import('../router.js').RouteInfo} routeInfo
 * @param {Object} ctx
 */
export function render(container, routeInfo, ctx) {
  const { dataset, isLoading } = ctx.store.getState();
  if (isLoading || !dataset) {
    container.innerHTML = `<div class="loading-screen" role="status"><div class="loading-screen__spinner" aria-hidden="true"></div><p>데이터를 불러오는 중입니다…</p></div>`;
    return;
  }

  function refresh() {
    const favoriteTeamIds = ctx.favoritesRepository.getFavoriteTeamIds();
    const recentEntries = ctx.recentlyViewed.getRecentlyViewed();

    container.innerHTML = `
      <h1 class="page-title">즐겨찾기</h1>
      <p class="page-subtitle">저장한 팀과 최근에 살펴본 팀을 한곳에서 확인하세요.</p>

      ${ctx.favoritesRepository.isUsingMemoryFallback() ? renderStorageWarning() : ""}

      <section class="reveal-on-scroll">
        <div class="section-heading">
          <h2>즐겨찾기한 팀</h2>
          <span class="section-heading__meta">${favoriteTeamIds.length}개</span>
        </div>
        ${
          favoriteTeamIds.length
            ? `<div class="grid grid--cards">${favoriteTeamIds.map((teamId) => renderFavoriteCard(teamId, dataset)).join("")}</div>`
            : renderEmptyState("☆", "즐겨찾기한 팀이 없습니다", "데이터베이스를 둘러보고 관심 있는 팀을 즐겨찾기에 추가해보세요.")
        }
      </section>

      <section class="reveal-on-scroll" style="margin-top: var(--space-7);">
        <div class="section-heading">
          <h2>최근 본 팀</h2>
          <span class="section-heading__meta">최대 10개, 최신순</span>
        </div>
        ${
          recentEntries.length
            ? `<div class="grid grid--cards">${recentEntries.map((entry) => renderRecentCard(entry, dataset)).join("")}</div>`
            : renderEmptyState("🕒", "최근 방문한 팀이 없습니다", "팀 상세 페이지를 방문하면 이곳에 자동으로 기록됩니다.")
        }
      </section>
    `;

    container.querySelectorAll("[data-remove-favorite]").forEach((button) => {
      button.addEventListener("click", () => {
        const teamId = button.dataset.removeFavorite;
        ctx.favoritesRepository.removeFavorite(teamId);
        ctx.store.setState({ favorites: ctx.favoritesRepository.getFavoriteTeamIds() });
        ctx.showToast("즐겨찾기에서 제거했습니다.");
        refresh();
      });
    });

    container.querySelectorAll("[data-remove-recent]").forEach((button) => {
      button.addEventListener("click", () => {
        const teamId = button.dataset.removeRecent;
        ctx.recentlyViewed.removeFromRecentlyViewed(teamId);
        ctx.store.setState({ recentlyViewed: ctx.recentlyViewed.getRecentlyViewed() });
        refresh();
      });
    });
  }

  refresh();
}

function renderFavoriteCard(teamId, dataset) {
  const team = dataset.teamsById.get(teamId);
  const country = team ? dataset.countriesById.get(team.countryId) : null;
  const titleCount = dataset.allRecords.filter((record) => record.championTeamId === teamId).length;
  const displayName = team ? team.name : teamId;

  return `
    <div class="card recent-card">
      <div class="recent-card__header">
        <span class="recent-card__crest" aria-hidden="true">${escapeHtml(country ? country.flag : "⚽")}</span>
        <div>
          <div class="recent-card__name">${escapeHtml(displayName)}</div>
          <div class="recent-card__meta">통합 타이틀 ${titleCount}회</div>
        </div>
      </div>
      <div class="chip-row">
        <a class="btn btn--ghost btn--sm" href="#/team/${encodeURIComponent(teamId)}">팀 상세 보기</a>
        <button type="button" class="btn btn--icon is-active" data-remove-favorite="${escapeHtml(teamId)}" aria-label="${escapeHtml(displayName)} 즐겨찾기 해제">★</button>
      </div>
    </div>
  `;
}

function renderRecentCard(entry, dataset) {
  const team = dataset.teamsById.get(entry.teamId);
  const country = team ? dataset.countriesById.get(team.countryId) : null;
  const displayName = team ? team.name : entry.teamId;
  const viewedDate = new Date(entry.viewedAt);
  const viewedLabel = Number.isNaN(viewedDate.getTime())
    ? ""
    : viewedDate.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });

  return `
    <div class="card recent-card">
      <div class="recent-card__header">
        <span class="recent-card__crest" aria-hidden="true">${escapeHtml(country ? country.flag : "⚽")}</span>
        <div>
          <div class="recent-card__name">${escapeHtml(displayName)}</div>
          <div class="recent-card__meta">${viewedLabel ? `${viewedLabel} 방문` : "최근 방문"}</div>
        </div>
      </div>
      <div class="chip-row">
        <a class="btn btn--primary btn--sm" href="#/team/${encodeURIComponent(entry.teamId)}">다시 보기</a>
        <button type="button" class="btn btn--icon" data-remove-recent="${escapeHtml(entry.teamId)}" aria-label="${escapeHtml(displayName)} 최근 본 팀 목록에서 제거">✕</button>
      </div>
    </div>
  `;
}

function renderStorageWarning() {
  return `
    <div class="card" style="border-color: var(--color-warning); margin-bottom: var(--space-5);" role="alert">
      ⚠️ 현재 브라우저에서 로컬 저장소를 사용할 수 없어 즐겨찾기가 이번 세션에서만 유지됩니다.
    </div>
  `;
}

function renderEmptyState(icon, title, description) {
  return `
    <div class="empty-state">
      <div class="empty-state__icon" aria-hidden="true">${icon}</div>
      <p class="empty-state__title">${escapeHtml(title)}</p>
      <p>${escapeHtml(description)}</p>
      <a class="btn btn--primary" href="#/database" style="margin-top: var(--space-4);">데이터베이스 둘러보기</a>
    </div>
  `;
}
