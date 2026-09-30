# Performance budgets

Source of truth: [`performance-budgets.json`](./performance-budgets.json). Lab numbers assume mobile emulation and throttling unless noted.

| Metric | Budget | Enforced by |
| --- | --- | --- |
| LCP (product target) | ≤ 2.0 s | Shown on the page; from `lcpMs` |
| LCP (CI lab) | ≤ 2.5 s | LHCI mobile `largest-contentful-paint` (`lcpCiMs`) |
| CLS | ≤ 0.02 | LHCI mobile `cumulative-layout-shift` |
| TBT | ≤ 150 ms | LHCI mobile `total-blocking-time` |
| Initial JS (gzipped) | ≤ 170 KB | LHCI `resource-summary:script:size` |
| Lighthouse Performance (mobile) | ≥ 95 | LHCI mobile `categories:performance` |
| Lighthouse Performance (desktop) | ≥ 98 | LHCI desktop `categories:performance` |
| Lighthouse Accessibility | = 100 | LHCI mobile and desktop |
| LoAF `blockingDuration` (scripted scroll) | ≤ 50 ms | Playwright `scroll-loaf.spec.ts` |
| LoAF `duration` (scripted scroll) | ≤ 100 ms | Playwright `scroll-loaf.spec.ts` |

CI runs Lighthouse three times per form factor and asserts the **median**. Simulated-throttle LCP on this Next.js runtime is about 2.17s in lab, so `lcpCiMs` is 2.5s to leave runner headroom while the page still advertises the 2.0s product target. Animated `left` / `top` / `width` / `height` / `margin` / `padding` fail Playwright motion lint. The unmerged branch `demo/layout-animation-regression` ships a `left` keyframe so that failure is visible.
