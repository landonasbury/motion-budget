# motion-budget

A motion-rich launch page for the fictional product **Kiteframe**, with CI that fails when performance or motion rules break.

## Run

```bash
pnpm i && pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Requires Node 22+ and [pnpm](https://pnpm.io).

## Budgets

| Metric | Budget |
| --- | --- |
| LCP (product target) | ≤ 2.0 s |
| LCP (CI lab) | ≤ 2.5 s |
| CLS | ≤ 0.02 |
| TBT | ≤ 150 ms |
| Initial JS (gzipped) | ≤ 170 KB |
| Lighthouse Performance (mobile) | ≥ 95 |
| Lighthouse Performance (desktop) | ≥ 98 |
| Lighthouse Accessibility | = 100 |

Numbers live in [`performance-budgets.json`](./performance-budgets.json). See [`BUDGETS.md`](./BUDGETS.md) for LoAF thresholds and how they are enforced.

## How the gates work

Every push and pull request runs `.github/workflows/ci.yml`:

1. **Lint, production build, typecheck** — typecheck runs after build so Next-generated types exist.
2. **Playwright motion lint** — `document.getAnimations()` keyframes plus a stylesheet `@keyframes` walk. Any `left`, `top`, `width`, `height`, `margin`, `padding` (and those longhands) fails the job.
3. **Playwright reduced motion** — with `prefers-reduced-motion: reduce`, running animations may only change `opacity`.
4. **Playwright LoAF** — a scripted scroll fails if any `long-animation-frame` exceeds the LoAF rows in [`BUDGETS.md`](./BUDGETS.md).
5. **Lighthouse CI** — mobile (throttled) and desktop. Assertions are mapped from [`performance-budgets.json`](./performance-budgets.json). Reports upload as artifacts.

The branch [`demo/layout-animation-regression`](https://github.com/landonasbury/motion-budget/tree/demo/layout-animation-regression) adds a `left` animation on purpose. [Its CI is expected to fail](https://github.com/landonasbury/motion-budget/actions?query=branch%3Ademo%2Flayout-animation-regression). Do not merge it.

## Deploy

Import [this GitHub repo](https://github.com/landonasbury/motion-budget) in [Vercel](https://vercel.com/new) as a Next.js project. There are no environment variables or secrets. After the first production deploy, set GitHub About to that `*.vercel.app` URL. Do not point Open Graph or docs at `motion-budget.vercel.app` unless it is this project — that host is already in use by an unrelated app.

## License

[MIT](./LICENSE) © 2026 Landon Asbury

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Next.js dev server |
| `pnpm build` | Production build |
| `pnpm test` | Playwright (builds locally if needed) |
| `pnpm lhci` | Lighthouse CI mobile collect + assert (`pnpm build` first) |
| `pnpm lhci:desktop` | Lighthouse CI desktop collect + assert |
