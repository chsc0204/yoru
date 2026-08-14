/**
 * Chart.js 4.x 공용 래퍼 (기획서 5.10절 통계 엔진 렌더링 담당).
 * 다크 테마/글래스모피즘 컨셉에 맞는 공통 옵션을 적용하고,
 * 동일 canvas에 대한 재렌더링 시 기존 Chart 인스턴스를 안전하게 해제한다.
 */

/** @type {WeakMap<HTMLCanvasElement, import('chart.js').Chart>} */
const chartInstances = new WeakMap();

const FONT_FAMILY = "Pretendard, 'Segoe UI', system-ui, sans-serif";

function readCssVar(name, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function getPalette() {
  return [
    readCssVar("--chart-1", "#00c853"),
    readCssVar("--chart-2", "#40c4ff"),
    readCssVar("--chart-3", "#ffab00"),
    readCssVar("--chart-4", "#ff6e40"),
    readCssVar("--chart-5", "#b388ff"),
    readCssVar("--chart-6", "#ff5252"),
    readCssVar("--chart-7", "#64ffda"),
    readCssVar("--chart-8", "#ffd740"),
  ];
}

function getBaseOptions() {
  const textSecondary = readCssVar("--color-text-secondary", "#a7b3c2");
  const gridColor = readCssVar("--glass-border", "rgba(255,255,255,0.09)");

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600, easing: "easeOutQuart" },
    plugins: {
      legend: {
        labels: { color: textSecondary, font: { family: FONT_FAMILY, size: 12 } },
      },
      tooltip: {
        backgroundColor: "rgba(12,18,24,0.95)",
        titleColor: "#f3f6f9",
        bodyColor: "#f3f6f9",
        borderColor: readCssVar("--color-accent-border", "rgba(0,200,83,0.35)"),
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        ticks: { color: textSecondary, font: { family: FONT_FAMILY, size: 11 } },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: textSecondary, font: { family: FONT_FAMILY, size: 11 } },
        grid: { color: gridColor },
        beginAtZero: true,
      },
    },
  };
}

/**
 * 기존 canvas에 남아있는 Chart 인스턴스를 파괴한다 (메모리 누수/충돌 방지).
 * @param {HTMLCanvasElement} canvas
 */
function destroyExistingChart(canvas) {
  const existing = chartInstances.get(canvas);
  if (existing) existing.destroy();
}

/**
 * 연도별 추이 선그래프를 렌더링한다 (FR-6.1).
 * @param {HTMLCanvasElement} canvas
 * @param {{ labels: (string|number)[], datasets: Array<{ label: string, data: number[] }> }} data
 */
export function renderLineChart(canvas, data) {
  destroyExistingChart(canvas);
  const palette = getPalette();

  const chart = new window.Chart(canvas, {
    type: "line",
    data: {
      labels: data.labels,
      datasets: data.datasets.map((dataset, index) => ({
        label: dataset.label,
        data: dataset.data,
        borderColor: palette[index % palette.length],
        backgroundColor: palette[index % palette.length],
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: false,
      })),
    },
    options: getBaseOptions(),
  });

  chartInstances.set(canvas, chart);
  return chart;
}

/**
 * 팀별 순위 막대그래프를 렌더링한다 (FR-6.2, FR-5.3).
 * @param {HTMLCanvasElement} canvas
 * @param {{ labels: string[], data: number[], label?: string }} data
 */
export function renderBarChart(canvas, data) {
  destroyExistingChart(canvas);
  const accentColor = readCssVar("--color-accent", "#00c853");

  const chart = new window.Chart(canvas, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: data.label || "타이틀 수",
          data: data.data,
          backgroundColor: accentColor,
          borderRadius: 6,
          maxBarThickness: 36,
        },
      ],
    },
    options: {
      ...getBaseOptions(),
      indexAxis: data.horizontal ? "y" : "x",
      plugins: { ...getBaseOptions().plugins, legend: { display: false } },
    },
  });

  chartInstances.set(canvas, chart);
  return chart;
}

/**
 * 국가별 비중 도넛차트를 렌더링한다 (FR-6.4).
 * @param {HTMLCanvasElement} canvas
 * @param {{ labels: string[], data: number[] }} data
 */
export function renderDoughnutChart(canvas, data) {
  destroyExistingChart(canvas);
  const palette = getPalette();

  const chart = new window.Chart(canvas, {
    type: "doughnut",
    data: {
      labels: data.labels,
      datasets: [
        {
          data: data.data,
          backgroundColor: data.labels.map((_, index) => palette[index % palette.length]),
          borderColor: readCssVar("--color-bg", "#0a0e14"),
          borderWidth: 2,
        },
      ],
    },
    options: {
      ...getBaseOptions(),
      scales: undefined,
      cutout: "62%",
    },
  });

  chartInstances.set(canvas, chart);
  return chart;
}

/**
 * 주어진 canvas들이 뷰포트에 들어올 때 fade-in 애니메이션 클래스를 부여한다 (Chart Fade-in Animation 요구사항).
 * @param {HTMLElement} container
 */
export function markChartCardsRevealed(container) {
  container.querySelectorAll(".chart-card").forEach((card, index) => {
    window.setTimeout(() => card.classList.add("is-revealed"), index * 80);
  });
}
