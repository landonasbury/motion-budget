const fs = require("fs");
const budgets = require("./performance-budgets.json");

if (typeof budgets.lcpMs !== "number" || typeof budgets.lcpCiMs !== "number") {
  throw new Error("performance-budgets.json must define numeric lcpMs and lcpCiMs");
}

function resolveChromePath() {
  if (process.env.CHROME_PATH) {
    return process.env.CHROME_PATH;
  }

  try {
    const { chromium } = require("playwright-core");
    const chromePath = chromium.executablePath();
    if (fs.existsSync(chromePath)) {
      return chromePath;
    }
  } catch {
    // Fall through to LHCI's default Chrome lookup.
  }

  return undefined;
}

const chromePath = resolveChromePath();
const formFactor = process.env.LHCI_FORM_FACTOR === "desktop" ? "desktop" : "mobile";
const isMobile = formFactor === "mobile";

const sharedAssertions = {
  "categories:accessibility": [
    "error",
    { minScore: budgets.lighthouseAccessibility / 100 },
  ],
  "resource-summary:script:size": [
    "error",
    { maxNumericValue: budgets.initialJsGzipKb * 1024 },
  ],
};

const mobileAssertions = {
  ...sharedAssertions,
  "categories:performance": [
    "error",
    { minScore: budgets.lighthousePerformanceMobile / 100 },
  ],
  "largest-contentful-paint": ["error", { maxNumericValue: budgets.lcpCiMs }],
  "cumulative-layout-shift": ["error", { maxNumericValue: budgets.cls }],
  "total-blocking-time": ["error", { maxNumericValue: budgets.tbtMs }],
};

const desktopAssertions = {
  ...sharedAssertions,
  "categories:performance": [
    "error",
    { minScore: budgets.lighthousePerformanceDesktop / 100 },
  ],
};

module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm start",
      startServerReadyPattern: "Ready",
      url: ["http://localhost:3000/"],
      numberOfRuns: 3,
      settings: {
        ...(chromePath ? { chromePath } : {}),
        formFactor,
        throttlingMethod: "simulate",
        throttling: isMobile
          ? {
              rttMs: 150,
              throughputKbps: 1638.4,
              cpuSlowdownMultiplier: 4,
            }
          : {
              rttMs: 40,
              throughputKbps: 10240,
              cpuSlowdownMultiplier: 1,
            },
        screenEmulation: isMobile
          ? {
              mobile: true,
              width: 412,
              height: 823,
              deviceScaleFactor: 1.75,
              disabled: false,
            }
          : {
              mobile: false,
              width: 1350,
              height: 940,
              deviceScaleFactor: 1,
              disabled: false,
            },
      },
    },
    assert: {
      aggregationMethod: "median",
      assertions: isMobile ? mobileAssertions : desktopAssertions,
    },
    upload: {
      target: "filesystem",
      outputDir: isMobile ? ".lighthouseci" : ".lighthouseci-desktop",
    },
  },
};
