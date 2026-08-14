import { escapeHtml } from "./utils.js";

/**
 * FIFA 월드컵 세계지도 기능 (통계 페이지 부가 기능).
 * assets/maps/world-map.svg(단순화된 대륙 실루엣)를 인라인으로 불러온 뒤,
 * 동일한 좌표계(viewBox 0 0 1000 500) 위에 국가별 지도 핀을 겹쳐 그린다.
 * 데스크톱은 hover, 모바일/키보드 사용자는 클릭·포커스로 툴팁을 확인할 수 있다.
 */

const SVG_NS = "http://www.w3.org/2000/svg";
const MAP_ASSET_PATH = "assets/maps/world-map.svg";
const FLAG_ASSET_DIR = "assets/flags";

// 클래식 "지도 핀(map pin)" 모양 경로. 끝(tip)이 로컬 좌표 (0,0)에 오도록 그려,
// <g transform="translate(x,y)">로 실제 지리 좌표에 배치한다.
const PIN_PATH_D = "M0,0 C0,0 -11,-18 -11,-25 A11,11 0 1 1 11,-25 C11,-18 0,0 0,0 Z";
const PIN_HEAD_CENTER_Y = -25;
const PIN_BADGE_RADIUS = 7.5;
const FLAG_ICON_WIDTH = 14;
const FLAG_ICON_HEIGHT = 9;
const PULSE_START_RADIUS = 11;
const PULSE_END_RADIUS = 20;

/**
 * @param {HTMLElement} viewportEl `.world-map-viewport` 컨테이너
 * @param {Array<Object>} worldCupChampions data/worldcup-champions.json
 */
export async function renderWorldMap(viewportEl, worldCupChampions) {
  const svgMarkup = await fetchMapMarkup();
  viewportEl.innerHTML = svgMarkup;

  const svg = viewportEl.querySelector("svg");
  svg.classList.add("world-map-svg");
  const pinLayer = svg.querySelector("#pin-layer");

  const tooltip = document.createElement("div");
  tooltip.className = "world-map-tooltip";
  tooltip.setAttribute("role", "tooltip");
  tooltip.id = "world-map-tooltip";
  viewportEl.appendChild(tooltip);

  worldCupChampions.forEach((entry) => {
    const pin = createPinElement(entry);
    pinLayer.appendChild(pin);
    bindPinInteractions(pin, entry, tooltip, viewportEl);
  });

  document.addEventListener("click", (event) => {
    if (!viewportEl.contains(event.target)) hideTooltip(tooltip);
  });
}

/** @returns {Promise<string>} */
async function fetchMapMarkup() {
  try {
    const response = await fetch(MAP_ASSET_PATH);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch (error) {
    console.warn("[worldMap] 지도 자산 로드 실패, 빈 배경으로 대체합니다.", error);
    return `<svg viewBox="0 0 1000 500"><rect width="1000" height="500" fill="#0a0e14" /><g id="pin-layer"></g></svg>`;
  }
}

/**
 * 지도 핀 하나(그림자 + 펄스 링 + 핀 몸통 + 국기 배지)를 생성한다.
 * @param {Object} entry worldcup-champions.json 항목
 * @returns {SVGGElement}
 */
function createPinElement(entry) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const group = document.createElementNS(SVG_NS, "g");
  group.setAttribute("class", "world-map-pin");
  group.setAttribute("transform", `translate(${entry.x}, ${entry.y})`);
  group.setAttribute("tabindex", "0");
  group.setAttribute("role", "button");
  group.setAttribute("aria-label", `${entry.name}, 월드컵 ${entry.titles}회 우승. 상세 정보 보기`);
  group.dataset.countryId = entry.countryId;

  const shadow = document.createElementNS(SVG_NS, "ellipse");
  shadow.setAttribute("class", "world-map-pin__shadow");
  shadow.setAttribute("cx", "0");
  shadow.setAttribute("cy", "2");
  shadow.setAttribute("rx", "7");
  shadow.setAttribute("ry", "2.5");
  group.appendChild(shadow);

  if (!prefersReducedMotion) {
    group.appendChild(createPulseRing());
  }

  const body = document.createElementNS(SVG_NS, "path");
  body.setAttribute("class", "world-map-pin__body");
  body.setAttribute("d", PIN_PATH_D);
  group.appendChild(body);

  const badge = document.createElementNS(SVG_NS, "circle");
  badge.setAttribute("class", "world-map-pin__badge");
  badge.setAttribute("cx", "0");
  badge.setAttribute("cy", String(PIN_HEAD_CENTER_Y));
  badge.setAttribute("r", String(PIN_BADGE_RADIUS));
  group.appendChild(badge);

  group.appendChild(createFlagIconOrFallback(entry));

  return group;
}

/** @returns {SVGCircleElement} 반복적으로 퍼져나가는 레이더 핑 애니메이션 링 */
function createPulseRing() {
  const pulse = document.createElementNS(SVG_NS, "circle");
  pulse.setAttribute("class", "world-map-pin__pulse");
  pulse.setAttribute("cx", "0");
  pulse.setAttribute("cy", String(PIN_HEAD_CENTER_Y));
  pulse.setAttribute("r", String(PULSE_START_RADIUS));

  const animateRadius = document.createElementNS(SVG_NS, "animate");
  animateRadius.setAttribute("attributeName", "r");
  animateRadius.setAttribute("values", `${PULSE_START_RADIUS};${PULSE_END_RADIUS}`);
  animateRadius.setAttribute("dur", "2s");
  animateRadius.setAttribute("repeatCount", "indefinite");
  pulse.appendChild(animateRadius);

  const animateOpacity = document.createElementNS(SVG_NS, "animate");
  animateOpacity.setAttribute("attributeName", "opacity");
  animateOpacity.setAttribute("values", "0.55;0");
  animateOpacity.setAttribute("dur", "2s");
  animateOpacity.setAttribute("repeatCount", "indefinite");
  pulse.appendChild(animateOpacity);

  return pulse;
}

/**
 * 국가 국기 아이콘(SVG 자산)을 핀 배지 위치에 배치한다. 자산 로드에 실패하면
 * 국기 이모지 텍스트로 대체한다 (일부 OS/브라우저 조합의 국기 이모지 렌더링 불안정 문제 방어).
 * @param {Object} entry
 * @returns {SVGImageElement}
 */
function createFlagIconOrFallback(entry) {
  const image = document.createElementNS(SVG_NS, "image");
  image.setAttribute("href", `${FLAG_ASSET_DIR}/${entry.countryId}.svg`);
  image.setAttribute("x", String(-FLAG_ICON_WIDTH / 2));
  image.setAttribute("y", String(PIN_HEAD_CENTER_Y - FLAG_ICON_HEIGHT / 2));
  image.setAttribute("width", String(FLAG_ICON_WIDTH));
  image.setAttribute("height", String(FLAG_ICON_HEIGHT));
  image.style.pointerEvents = "none";

  image.addEventListener("error", () => {
    const fallbackLabel = document.createElementNS(SVG_NS, "text");
    fallbackLabel.setAttribute("x", "0");
    fallbackLabel.setAttribute("y", String(PIN_HEAD_CENTER_Y + 4));
    fallbackLabel.setAttribute("text-anchor", "middle");
    fallbackLabel.setAttribute("font-size", "11");
    fallbackLabel.textContent = entry.flag;
    image.replaceWith(fallbackLabel);
  });

  return image;
}

/**
 * @param {SVGGElement} pin
 * @param {Object} entry
 * @param {HTMLElement} tooltip
 * @param {HTMLElement} viewportEl
 */
function bindPinInteractions(pin, entry, tooltip, viewportEl) {
  const show = () => showTooltip(pin, entry, tooltip, viewportEl);
  const hide = () => hideTooltip(tooltip);

  pin.addEventListener("mouseenter", show);
  pin.addEventListener("mouseleave", hide);
  pin.addEventListener("focus", show);
  pin.addEventListener("blur", hide);
  pin.addEventListener("click", (event) => {
    event.stopPropagation();
    if (tooltip.classList.contains("is-visible") && tooltip.dataset.activeCountry === entry.countryId) {
      hide();
    } else {
      show();
    }
  });
}

function showTooltip(pin, entry, tooltip, viewportEl) {
  tooltip.innerHTML = `
    <div class="world-map-tooltip__title">${escapeHtml(entry.flag)} ${escapeHtml(entry.name)}</div>
    <div class="world-map-tooltip__count">${entry.titles}회 우승</div>
    <div class="world-map-tooltip__years">${entry.years.join(", ")}</div>
  `;
  tooltip.dataset.activeCountry = entry.countryId;

  // 펄스 링은 계속 커지는 애니메이션 중이라 bounding box가 흔들릴 수 있으므로,
  // 항상 고정 크기인 국기 배지(badge)를 기준으로 툴팁 위치를 계산한다.
  const badge = pin.querySelector(".world-map-pin__badge");
  const anchorRect = (badge || pin).getBoundingClientRect();
  const viewportRect = viewportEl.getBoundingClientRect();
  const left = anchorRect.left + anchorRect.width / 2 - viewportRect.left;
  const top = anchorRect.top - viewportRect.top;

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
  tooltip.classList.add("is-visible");
}

function hideTooltip(tooltip) {
  tooltip.classList.remove("is-visible");
  delete tooltip.dataset.activeCountry;
}
