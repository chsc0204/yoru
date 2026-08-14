import { escapeHtml } from "./utils.js";
import { ERA_OPTIONS, describeActiveFilters } from "./filters.js";

/**
 * 필터 패널(FR-4.x) 공용 렌더러. 데이터베이스 화면과 검색 화면이 동일한 마크업/동작을
 * 공유하도록 분리했다 (DRY). 호출 측은 renderFilterPanel()로 HTML을 얻고,
 * bindFilterPanelEvents()로 이벤트를 연결한 뒤 onChange 콜백에서 재렌더링하면 된다.
 */

const MIN_TITLES_MAX = 15;

/**
 * @param {import('./store.js').FilterState} filters
 * @param {import('./dataLoader.js').Dataset} dataset
 * @returns {string}
 */
export function renderFilterPanel(filters, dataset) {
  const activeChips = describeActiveFilters(filters, dataset);

  return `
    <div class="card filter-panel" aria-label="필터 패널">
      <div class="filter-panel__header">
        <h2>필터</h2>
        <button type="button" class="btn btn--ghost btn--sm" data-action="reset-filters">전체 초기화</button>
      </div>

      <div class="chip-row" style="margin-bottom: var(--space-5);" aria-live="polite">
        ${
          activeChips.length
            ? activeChips
                .map(
                  (chip) => `
              <span class="chip">
                ${escapeHtml(chip.label)}
                <button type="button" aria-label="${escapeHtml(chip.label)} 필터 제거" data-action="remove-filter" data-filter-key="${chip.key}">×</button>
              </span>`
                )
                .join("")
            : `<span class="chip chip--empty">적용된 필터 없음</span>`
        }
      </div>

      <div class="field-group">
        <span class="field-group__label" id="filter-competition-label">대회</span>
        <div role="group" aria-labelledby="filter-competition-label">
          ${dataset.competitions
            .map(
              (competition) => `
            <label class="checkbox-row">
              <input
                type="checkbox"
                name="competitionIds"
                value="${competition.competitionId}"
                ${filters.competitionIds.includes(competition.competitionId) ? "checked" : ""}
              />
              ${escapeHtml(competition.name)}
            </label>`
            )
            .join("")}
        </div>
      </div>

      <div class="field-group">
        <span class="field-group__label" id="filter-era-label">연대</span>
        <div role="radiogroup" aria-labelledby="filter-era-label">
          ${ERA_OPTIONS.map(
            (option) => `
            <label class="radio-row">
              <input type="radio" name="era" value="${option.value}" ${filters.era === option.value ? "checked" : ""} />
              ${escapeHtml(option.label)}
            </label>`
          ).join("")}
        </div>
        <div class="year-range-row" style="margin-top: var(--space-3);">
          <input
            type="number"
            class="text-input"
            name="yearFrom"
            placeholder="시작 연도"
            aria-label="기간 직접 입력 - 시작 연도"
            value="${filters.yearFrom ?? ""}"
          />
          <span aria-hidden="true">–</span>
          <input
            type="number"
            class="text-input"
            name="yearTo"
            placeholder="종료 연도"
            aria-label="기간 직접 입력 - 종료 연도"
            value="${filters.yearTo ?? ""}"
          />
        </div>
      </div>

      <div class="field-group">
        <label class="field-group__label" for="filter-country">국가 / 대륙연맹</label>
        <select id="filter-country" class="select-input" name="countryId">
          <option value="">전체</option>
          ${dataset.countries
            .map(
              (country) => `
            <option value="${country.countryId}" ${filters.countryId === country.countryId ? "selected" : ""}>
              ${escapeHtml(country.flag)} ${escapeHtml(country.name)}
            </option>`
            )
            .join("")}
        </select>
      </div>

      <div class="field-group">
        <label class="field-group__label" for="filter-min-titles">
          최소 타이틀 수: <strong>${filters.minTitles > 0 ? `${filters.minTitles}회 이상` : "전체"}</strong>
        </label>
        <input
          id="filter-min-titles"
          class="range-input"
          type="range"
          name="minTitles"
          min="0"
          max="${MIN_TITLES_MAX}"
          step="1"
          value="${filters.minTitles}"
        />
      </div>
    </div>
  `;
}

/**
 * 필터 패널의 입력 이벤트를 연결한다.
 * @param {HTMLElement} container 필터 패널을 포함하는 상위 컨테이너
 * @param {Object} ctx 공용 컨텍스트 (store 포함)
 * @param {() => void} onChange 필터 변경 시 호출할 콜백 (결과 재렌더링 트리거)
 */
export function bindFilterPanelEvents(container, ctx, onChange) {
  const panel = container.querySelector(".filter-panel");
  if (!panel) return;

  panel.querySelectorAll('input[name="competitionIds"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const { filters } = ctx.store.getState();
      const selected = new Set(filters.competitionIds);
      if (checkbox.checked) selected.add(checkbox.value);
      else selected.delete(checkbox.value);
      ctx.store.setState({ filters: { ...filters, competitionIds: [...selected] } });
      onChange();
    });
  });

  panel.querySelectorAll('input[name="era"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const { filters } = ctx.store.getState();
      ctx.store.setState({ filters: { ...filters, era: radio.value, yearFrom: null, yearTo: null } });
      onChange();
    });
  });

  ["yearFrom", "yearTo"].forEach((fieldName) => {
    const input = panel.querySelector(`input[name="${fieldName}"]`);
    input.addEventListener("change", () => {
      const { filters } = ctx.store.getState();
      const value = input.value === "" ? null : Number.parseInt(input.value, 10);
      ctx.store.setState({ filters: { ...filters, [fieldName]: value, era: null } });
      onChange();
    });
  });

  panel.querySelector('select[name="countryId"]').addEventListener("change", (event) => {
    const { filters } = ctx.store.getState();
    ctx.store.setState({ filters: { ...filters, countryId: event.target.value || null } });
    onChange();
  });

  panel.querySelector('input[name="minTitles"]').addEventListener("change", (event) => {
    const { filters } = ctx.store.getState();
    ctx.store.setState({ filters: { ...filters, minTitles: Number.parseInt(event.target.value, 10) } });
    onChange();
  });

  panel.querySelector('[data-action="reset-filters"]').addEventListener("click", () => {
    ctx.store.resetFilters();
    onChange();
  });

  panel.querySelectorAll('[data-action="remove-filter"]').forEach((button) => {
    button.addEventListener("click", () => {
      const { filters } = ctx.store.getState();
      const key = button.dataset.filterKey;
      const nextFilters = { ...filters };

      if (key.startsWith("competition:")) {
        const competitionId = key.split(":")[1];
        nextFilters.competitionIds = filters.competitionIds.filter((id) => id !== competitionId);
      } else if (key === "era") {
        nextFilters.era = null;
      } else if (key === "yearRange") {
        nextFilters.yearFrom = null;
        nextFilters.yearTo = null;
      } else if (key === "countryId") {
        nextFilters.countryId = null;
      } else if (key === "minTitles") {
        nextFilters.minTitles = 0;
      }

      ctx.store.setState({ filters: nextFilters });
      onChange();
    });
  });
}
