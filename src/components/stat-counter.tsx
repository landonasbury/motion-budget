"use client";

import { useEffect, useRef } from "react";
import { performanceBudgets } from "@/lib/budgets";

const stats = [
  {
    label: "LCP ceiling",
    to: performanceBudgets.lcpMs / 1000,
    digits: 1,
    suffix: "s",
  },
  {
    label: "CLS ceiling",
    to: performanceBudgets.cls,
    digits: 2,
    suffix: "",
  },
  {
    label: "Initial JS, gzipped",
    to: performanceBudgets.initialJsGzipKb,
    digits: 0,
    suffix: "KB",
  },
];

function formatValue(to: number, digits: number, suffix: string) {
  return `${to.toFixed(digits)}${suffix}`;
}

export function StatCounter() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const values = Array.from(
      root.querySelectorAll<HTMLElement>("[data-stat-value]"),
    );
    let cancelled = false;
    let tweenContext: { revert: () => void } | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        observer.disconnect();

        void import("gsap").then(({ default: gsap }) => {
          if (cancelled) {
            return;
          }

          tweenContext = gsap.context(() => {
            values.forEach((node, index) => {
              const stat = stats[index];
              if (!stat) {
                return;
              }

              const state = { value: 0 };
              gsap.to(state, {
                value: stat.to,
                duration: 1.15,
                delay: index * 0.08,
                ease: "power2.out",
                onUpdate: () => {
                  node.textContent = formatValue(
                    state.value,
                    stat.digits,
                    stat.suffix,
                  );
                },
              });
            });
          }, root);
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(root);

    return () => {
      cancelled = true;
      observer.disconnect();
      tweenContext?.revert();
    };
  }, []);

  return (
    <section id="budgets" ref={rootRef} className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">
          Numbers the gate will keep
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Figures match{" "}
          <span className="font-mono text-paper">performance-budgets.json</span>
          . The count-up is a GSAP timeline loaded only when this block is in
          view.
        </p>
        <dl className="mt-12 grid gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="story-beat border border-line bg-panel p-8">
              <dt className="font-mono text-sm text-muted">{stat.label}</dt>
              <dd
                data-stat-value
                className="mt-3 min-h-[3rem] min-w-[7ch] font-mono text-5xl text-accent tabular-nums"
              >
                {formatValue(stat.to, stat.digits, stat.suffix)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
