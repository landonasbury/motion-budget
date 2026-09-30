# Performance budgets

Source of truth: [`performance-budgets.json`](./performance-budgets.json). Lab numbers assume mobile emulation and throttling unless noted.

| Metric | Budget |
| --- | --- |
| LCP | ≤ 2.0 s |
| CLS | ≤ 0.02 |
| TBT | ≤ 150 ms |
| Initial JS (gzipped) | ≤ 170 KB |
| Lighthouse Performance (mobile) | ≥ 95 |
| Lighthouse Performance (desktop) | ≥ 98 |
| Lighthouse Accessibility | = 100 |
| LoAF `blockingDuration` (scripted scroll) | ≤ 50 ms |
| LoAF `duration` (scripted scroll) | ≤ 100 ms |

LHCI **asserts** these starting in M3. Until then CI collects reports as artifacts (`assert` is omitted from `lighthouserc.cjs`; an empty assertions object makes `lhci autorun` fail).
