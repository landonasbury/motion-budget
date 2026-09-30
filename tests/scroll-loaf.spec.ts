import { expect, test } from "@playwright/test";
import { performanceBudgets } from "../src/lib/budgets";

type LoafEntry = {
  duration: number;
  blockingDuration: number;
};

test("scripted scroll stays within LoAF budgets", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  await page.evaluate(() => {
    const global = window as Window & { __loafs?: LoafEntry[] };
    global.__loafs = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const loaf = entry as PerformanceEntry & { blockingDuration?: number };
        global.__loafs?.push({
          duration: loaf.duration,
          blockingDuration: loaf.blockingDuration ?? 0,
        });
      }
    });

    // Do not use buffered entries: first paint and font-swap LoAFs are not the scroll gate.
    observer.observe({ type: "long-animation-frame", buffered: false });
  });

  await page.evaluate(async () => {
    const maxY = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      0,
    );
    const steps = 8;
    for (let i = 1; i <= steps; i += 1) {
      window.scrollTo(0, (maxY * i) / steps);
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
  });

  await page.evaluate(
    () => new Promise<void>((resolve) => window.setTimeout(resolve, 200)),
  );

  const loafs = await page.evaluate(() => {
    const global = window as Window & { __loafs?: LoafEntry[] };
    return global.__loafs ?? [];
  });

  const overBudget = loafs.filter(
    (entry) =>
      entry.blockingDuration > performanceBudgets.loafBlockingDurationMs ||
      entry.duration > performanceBudgets.loafDurationMs,
  );

  expect(overBudget).toEqual([]);
});
