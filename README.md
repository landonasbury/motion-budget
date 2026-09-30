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
| LCP | ≤ 2.0 s |
| CLS | ≤ 0.02 |
| TBT | ≤ 150 ms |
| Initial JS (gzipped) | ≤ 170 KB |
| Lighthouse Performance (mobile) | ≥ 95 |
| Lighthouse Performance (desktop) | ≥ 98 |
| Lighthouse Accessibility | = 100 |

Numbers live in [`performance-budgets.json`](./performance-budgets.json). See [`BUDGETS.md`](./BUDGETS.md) for LoAF thresholds and how they are enforced.

## How the gates work

_Filled in M3, once assertions are live._ Until then GitHub Actions runs lint, typecheck, production build, Playwright (motion lint, reduced-motion, LoAF), and Lighthouse CI **collect + filesystem upload** (`assert` is omitted so scores cannot fail the scaffold). Reports upload as workflow artifacts.

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Next.js dev server |
| `pnpm build` | Production build |
| `pnpm test` | Playwright (builds locally if needed) |
| `pnpm lhci` | Lighthouse CI collect (run `pnpm build` first) |
