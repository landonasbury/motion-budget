const fs = require("fs");
const budgets = require("./performance-budgets.json");

if (typeof budgets.lcpMs !== "number") {
  throw new Error("performance-budgets.json must define numeric lcpMs");
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

module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm start",
      startServerReadyPattern: "Ready",
      url: ["http://localhost:3000/"],
      numberOfRuns: 1,
      settings: {
        ...(chromePath ? { chromePath } : {}),
        formFactor: "mobile",
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 823,
          deviceScaleFactor: 1.75,
          disabled: false,
        },
      },
    },
    // `assert` is omitted until M3; empty assertions make `lhci autorun` fail.
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
  },
};
