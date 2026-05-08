const header = document.querySelector("[data-header]");
const countEls = document.querySelectorAll(".count-up");

const workflowContent = [
  {
    kicker: "Stage 01",
    title: "Ingest seismic and well-log files",
    text: "The workflow accepts SEG-Y seismic volumes and LAS/CSV well logs, then organizes them into a repeatable project structure.",
    bullets: [
      "Project files, well headers, well tops, deviations, and checkshots",
      "Upload validation before the model run starts",
      "Prepared bundle for reproducible execution",
    ],
  },
  {
    kicker: "Stage 02",
    title: "Run QC and time-depth alignment",
    text: "Because seismic is measured in time and logs are measured in depth, the system checks quality and aligns the two domains before learning.",
    bullets: [
      "Missing data and abnormal intervals are flagged",
      "Checkshot or sonic information supports well ties",
      "Alignment quality protects the prediction from learning mismatched targets",
    ],
  },
  {
    kicker: "Stage 03",
    title: "Extract windowed seismic attributes",
    text: "Around each well location, seismic windows are converted into model-ready features that preserve local subsurface context.",
    bullets: [
      "Amplitude, phase, frequency, and texture-style attributes",
      "Moving windows around target intervals",
      "Traceable metadata for fair benchmarking",
    ],
  },
  {
    kicker: "Stage 04",
    title: "Predict missing well-log curves",
    text: "ML and deep-learning models learn from known wells, then generate predicted curves at blind wells or selected seismic traces.",
    bullets: [
      "Supervised regression for continuous log values",
      "Blind-well validation to avoid overclaiming performance",
      "Reliability indicators to reduce over-trust",
    ],
  },
  {
    kicker: "Stage 05",
    title: "Review metrics, plots, and exports",
    text: "Users inspect predicted versus measured curves, summary metrics, and analytics before downloading interpretation-ready outputs.",
    bullets: [
      "RMSE, MAE, R2, and correlation where relevant",
      "Predicted curves, charts, and run summaries",
      "LAS, CSV, GeoTIFF, and optional SEG-Y compatible outputs",
    ],
  },
];

const disciplineContent = {
  geophysics: {
    title: "Geophysics keeps the seismic signal reliable.",
    text: "The geophysics layer handles seismic QC, time-depth ties, conditioning, and windowed attribute extraction so the model learns from meaningful seismic context.",
  },
  petroleum: {
    title: "Petroleum engineering keeps predictions reservoir-meaningful.",
    text: "The petroleum layer guides log selection, unit checks, physics-based consistency screening, and final validation so predicted curves remain useful for reservoir evaluation.",
  },
  cs: {
    title: "Computer science and software turn the method into a usable tool.",
    text: "The CS layer builds the supervised learning pipeline, blind-well evaluation, run orchestration, interactive interface, and export system that make the workflow repeatable.",
  },
};

const curveData = {
  dt: {
    measured: [0.35, 0.42, 0.38, 0.52, 0.61, 0.58, 0.66, 0.72, 0.64, 0.55, 0.6, 0.5],
    predicted: [0.33, 0.4, 0.41, 0.5, 0.57, 0.6, 0.64, 0.69, 0.66, 0.58, 0.57, 0.52],
    label: "DT",
  },
  gr: {
    measured: [0.62, 0.58, 0.66, 0.71, 0.64, 0.52, 0.46, 0.5, 0.57, 0.69, 0.74, 0.7],
    predicted: [0.59, 0.61, 0.64, 0.68, 0.62, 0.55, 0.49, 0.52, 0.6, 0.66, 0.72, 0.68],
    label: "GR",
  },
};

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 36);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = Number(el.dataset.count || 0);
      const duration = 850;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(end * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.4 },
);

countEls.forEach((el) => countObserver.observe(el));

function setWorkflow(index) {
  const content = workflowContent[index];
  document.getElementById("workflowKicker").textContent = content.kicker;
  document.getElementById("workflowPanelTitle").textContent = content.title;
  document.getElementById("workflowPanelText").textContent = content.text;
  document.getElementById("workflowPanelBullets").innerHTML = content.bullets
    .map((item) => `<li>${item}</li>`)
    .join("");

  document.querySelectorAll(".step-button").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.step) === index);
  });
}

document.querySelectorAll(".step-button").forEach((button) => {
  button.addEventListener("click", () => setWorkflow(Number(button.dataset.step)));
});

function setDiscipline(key) {
  const content = disciplineContent[key];
  document.getElementById("disciplineTitle").textContent = content.title;
  document.getElementById("disciplineText").textContent = content.text;

  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === key);
  });
}

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => setDiscipline(button.dataset.tab));
});

const heroCanvas = document.getElementById("heroScene");
const heroCtx = heroCanvas.getContext("2d");
const pointer = { x: 0.72, y: 0.38 };
let heroFrame = 0;

function resizeHeroCanvas() {
  const ratio = window.devicePixelRatio || 1;
  heroCanvas.width = Math.floor(heroCanvas.clientWidth * ratio);
  heroCanvas.height = Math.floor(heroCanvas.clientHeight * ratio);
  heroCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawHeroScene() {
  const width = heroCanvas.clientWidth;
  const height = heroCanvas.clientHeight;
  heroCtx.clearRect(0, 0, width, height);

  const time = heroFrame * 0.009;
  const horizon = height * 0.42;

  const backdrop = heroCtx.createLinearGradient(0, 0, width, height);
  backdrop.addColorStop(0, "#242b2c");
  backdrop.addColorStop(0.5, "#405056");
  backdrop.addColorStop(1, "#efe8db");
  heroCtx.fillStyle = backdrop;
  heroCtx.fillRect(0, 0, width, height);

  heroCtx.save();
  heroCtx.translate(width * 0.48, horizon);
  heroCtx.rotate(-0.12);

  const layerColors = ["#d2b98e", "#7e8e82", "#b66f50", "#59656a", "#c9c0a6", "#2f4246"];
  for (let layer = 0; layer < 7; layer += 1) {
    heroCtx.beginPath();
    const yBase = layer * 54 + Math.sin(time + layer) * 5;
    heroCtx.moveTo(-width * 0.15, yBase);
    for (let x = -width * 0.15; x <= width * 0.68; x += 24) {
      const wave =
        Math.sin(x * 0.012 + time + layer * 0.7) * (12 + layer * 2) +
        Math.sin(x * 0.027 - time * 0.8) * 5;
      heroCtx.lineTo(x, yBase + wave);
    }
    heroCtx.lineTo(width * 0.72, yBase + 74);
    heroCtx.lineTo(-width * 0.18, yBase + 86);
    heroCtx.closePath();
    heroCtx.fillStyle = `${layerColors[layer % layerColors.length]}cc`;
    heroCtx.fill();
    heroCtx.strokeStyle = "rgba(255,255,255,0.24)";
    heroCtx.lineWidth = 1;
    heroCtx.stroke();
  }

  for (let well = 0; well < 5; well += 1) {
    const x = width * (0.12 + well * 0.1);
    heroCtx.strokeStyle = well === 2 ? "rgba(216,148,50,0.9)" : "rgba(255,255,255,0.74)";
    heroCtx.lineWidth = well === 2 ? 3 : 2;
    heroCtx.beginPath();
    heroCtx.moveTo(x, -90);
    heroCtx.lineTo(x + Math.sin(time + well) * 12, 410);
    heroCtx.stroke();

    heroCtx.strokeStyle = "rgba(25,182,176,0.82)";
    heroCtx.lineWidth = 2;
    heroCtx.beginPath();
    for (let y = 12; y < 350; y += 8) {
      const curveX = x + 18 + Math.sin(y * 0.055 + time + well) * 14;
      if (y === 12) heroCtx.moveTo(curveX, y);
      heroCtx.lineTo(curveX, y);
    }
    heroCtx.stroke();
  }
  heroCtx.restore();

  heroCtx.save();
  heroCtx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 10; i += 1) {
    const startX = width * (0.52 + i * 0.035);
    const startY = height * (0.18 + (i % 4) * 0.095);
    const endX = width * (pointer.x + Math.sin(time + i) * 0.03);
    const endY = height * (pointer.y + Math.cos(time * 0.9 + i) * 0.07);
    heroCtx.strokeStyle = i % 3 === 0 ? "rgba(216,148,50,0.42)" : "rgba(25,182,176,0.42)";
    heroCtx.lineWidth = 1.5;
    heroCtx.beginPath();
    heroCtx.moveTo(startX, startY);
    heroCtx.bezierCurveTo(width * 0.68, startY, width * 0.7, endY, endX, endY);
    heroCtx.stroke();
  }
  heroCtx.restore();

  heroFrame += 1;
  requestAnimationFrame(drawHeroScene);
}

heroCanvas.addEventListener("pointermove", (event) => {
  const rect = heroCanvas.getBoundingClientRect();
  pointer.x = (event.clientX - rect.left) / rect.width;
  pointer.y = (event.clientY - rect.top) / rect.height;
});

window.addEventListener("resize", () => {
  resizeHeroCanvas();
  drawCurveChart(activeCurve);
});

resizeHeroCanvas();
drawHeroScene();

const curveCanvas = document.getElementById("curveChart");
const curveCtx = curveCanvas.getContext("2d");
let activeCurve = "dt";

function drawCurveLine(points, color, dashed = false) {
  const padding = { top: 58, right: 36, bottom: 42, left: 48 };
  const width = curveCanvas.width;
  const height = curveCanvas.height;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  curveCtx.save();
  curveCtx.strokeStyle = color;
  curveCtx.lineWidth = 4;
  curveCtx.lineJoin = "round";
  curveCtx.lineCap = "round";
  if (dashed) curveCtx.setLineDash([10, 8]);
  curveCtx.beginPath();

  points.forEach((value, index) => {
    const x = padding.left + (plotWidth * index) / (points.length - 1);
    const y = padding.top + plotHeight * (1 - value);
    if (index === 0) curveCtx.moveTo(x, y);
    curveCtx.lineTo(x, y);
  });

  curveCtx.stroke();
  curveCtx.restore();
}

function drawCurveChart(curveKey) {
  const data = curveData[curveKey];
  const width = curveCanvas.width;
  const height = curveCanvas.height;
  curveCtx.clearRect(0, 0, width, height);
  curveCtx.fillStyle = "#fbfaf6";
  curveCtx.fillRect(0, 0, width, height);

  curveCtx.strokeStyle = "#d9ddd7";
  curveCtx.lineWidth = 1;
  for (let i = 0; i < 6; i += 1) {
    const y = 58 + i * 60;
    curveCtx.beginPath();
    curveCtx.moveTo(48, y);
    curveCtx.lineTo(width - 36, y);
    curveCtx.stroke();
  }

  curveCtx.fillStyle = "#172124";
  curveCtx.font = "800 22px Inter, system-ui, sans-serif";
  curveCtx.fillText(`${data.label} blind-well comparison`, 48, 36);

  drawCurveLine(data.measured, "#262b2c");
  drawCurveLine(data.predicted, "#19b6b0", true);

  curveCtx.fillStyle = "#617073";
  curveCtx.font = "700 14px Inter, system-ui, sans-serif";
  curveCtx.fillText("Depth interval", 48, height - 14);
  curveCtx.save();
  curveCtx.translate(18, height - 80);
  curveCtx.rotate(-Math.PI / 2);
  curveCtx.fillText("Normalized response", 0, 0);
  curveCtx.restore();
}

function setCurve(key) {
  activeCurve = key;
  drawCurveChart(key);
  document.querySelectorAll(".curve-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.curve === key);
  });
}

document.querySelectorAll(".curve-button").forEach((button) => {
  button.addEventListener("click", () => setCurve(button.dataset.curve));
});

drawCurveChart(activeCurve);
