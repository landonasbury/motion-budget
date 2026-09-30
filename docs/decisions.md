# Decisions

## Why this repo exists

Motion often looks great on a developer's machine while dragging down real mobile devices. The main problem is that normal CI pipelines catch TypeScript errors, lint issues, and bundle bloat, but nothing stops layout-triggering animations or broken accessibility preferences from slipping into production.

I built a fictional product instead of using client work because client code is locked behind NDAs or belongs to unlaunched projects. A self-contained demo lets me prove the enforcement architecture publicly, end-to-end, in a clean environment where anyone can trigger a failure and see CI catch it.

## Stack

**Next.js & Tailwind:** Standard modern React baseline. Tailwind keeps static styles manageable, and Next.js gives realistic production builds and bundle chunking out of the box.

**CSS for Motion, Dynamic GSAP for Count-Ups:** CSS animations run off-thread on the compositor. The numeric count-up is the only thing that needs JavaScript, because it has to interpolate text values every frame. Importing GSAP dynamically means users don’t download or parse that script until the count-up section is needed, keeping the initial bundle clean.

## Motion model

**The Rule:** Only animate `transform` and `opacity`. Animating properties like `left`, `top`, or `width` alters box geometry. That forces the browser through layout recalculations and repaints on every frame, which burns CPU cycles and drops frames. Transforms and `opacity` skip layout and paint entirely, going straight to the compositor.

**Reduced Motion:** Inside `@media (prefers-reduced-motion: reduce)` in `globals.css`, explicit classes (`.hero-in`, `.hero-in-late`, `.story-beat`, `.type-char`, and `.logo-marquee-track`) are targeted with `animation: none`, `animation-timeline: none`, `opacity: 1`, and `transform: none`. Explicitly resetting `opacity: 1` and `transform: none` ensures elements land cleanly in their final, visible states rather than getting trapped in their initial hidden or translated offsets. Instead of just killing the scrolling logo marquee, the CSS hides the continuous track entirely and reveals a static grid of the logos as a functional alternative. While the motion model rule allows short `opacity` fades for state transitions, this page currently uses none—animations are simply turned off.

## Performance budgets

**Where the numbers came from:** These targets (LCP ≤ 2.0s, CLS ≤ 0.02, JS bundle ≤ 170 KB) came from the spec I started the project with. I chose targets deliberately stricter than standard Core Web Vitals (LCP 2.5s, CLS 0.1) to create an intentional safety margin. Budgets are tracked in `performance-budgets.json`.

**CI Gate (2.5s) vs. Target Budget (2.0s):** Local CI yields an LCP around 2.17s under simulated throttling, which fails the 2.0s project target. Because 2.17s is the reality of this Next.js runtime under simulated throttling, the hard gate in `lighthouserc.cjs` is set to 2.5s—the official Core Web Vitals "good" threshold. The 2.0s target is not met under CI's throttling, but it is met on PSI (1.8s).

**Why Local CI and PSI Differ:** We haven't isolated the exact cause, but the difference is likely because:

- **Throttling profiles differ:** `lighthouserc.cjs` uses custom settings (150ms RTT, 1638 Kbps throughput, 4x CPU slowdown), whereas PSI applies its own simulated Slow 4G profile on a Moto G Power.
- **Test environments differ:** CI runs against a local server, while PSI tests the deployed Vercel CDN edge from Google's infrastructure.
- PSI is lab data here too—the report shows "No Data" for CrUX real-user metrics.

## Enforcement

**Four automated checks run in the pipeline:**

- **Motion Lint (Playwright):** Boots the page in a browser and inspects both `document.getAnimations()` for active keyframe effects and `document.styleSheets` for declared `@keyframes` rules. It flags any animation keyframe that touches layout properties (like `left`, `margin`, or `width`).
- **Reduced Motion Test:** Emulates `prefers-reduced-motion: reduce` in Playwright and asserts that any animation still running under reduced motion touches only `opacity`.
- **LoAF Scroll Test:** Scrolls the page while observing the `Long Animation Frames API`. It fails if any animation frame has a `blockingDuration` over 50ms or a total duration over 100ms.
- **Lighthouse CI:** Reads `lighthouserc.cjs` to enforce budgets on initial load metrics and bundle size.

Why check both `getAnimations()` and stylesheet `@keyframes`? They cover two different blind spots. `getAnimations()` catches active, running CSS animations on the DOM. The stylesheet walk catches `@keyframes` that exist in CSS but haven't been triggered yet (like entrance animations awaiting an interaction or class toggle).

**Positive Controls:** Sanity assertions inside the tests confirming the runner actually found animations and keyframes to evaluate, and that a `transform` animation runs normally when reduced motion is off. They prevent tests from passing trivially if a selector breaks or styles fail to load.

**The Demo Branch (`demo/layout-animation-regression`):** Changes an animation to animate `left` instead of `transform`. In CI run 6, the Playwright motion lint failed immediately as expected. Because the test step failed, downstream steps like Lighthouse CI were skipped, proving the lint gate halts regressions early.

## Trade-offs

**What the motion lint misses:** It only reads CSS `@keyframes` and running `CSS/WAAPI` animations. It cannot detect JavaScript updating inline styles directly (like GSAP tweening `left` via `element.style`), nor does it monitor hover transitions or layout properties changed dynamically in script.

**Mobile Speed Index (4.0s):** Speed Index is currently 4.0s and unbudgeted. My hypothesis is that delayed entrance animations slow down visual completeness across the viewport. The simplest way to test this is to temporarily disable entrance animations, re-run PSI lab data, and compare the visual progression.

**What I'd do next:**

- Test the Speed Index hypothesis by removing entrance delays to measure how much lab SI drops.
- Add an ESLint rule banning layout properties inside React style attributes to catch inline style motion at authoring time.
