"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { performanceBudgets } from "@/lib/budgets";

const lcpTarget = `${(performanceBudgets.lcpMs / 1000).toFixed(1)}s`;
const clsCeiling = performanceBudgets.cls.toFixed(2);
const tbtCeiling = `${performanceBudgets.tbtMs}ms`;

const report = `kiteframe 0.0.0-demo (fictional)

$ kiteframe check src/app

  pass   transform    14 tweens
  pass   opacity       6 fades
  fail   left          HeroCta  (layout)

  budgets  LCP ${lcpTarget}  CLS ${clsCeiling}  TBT ${tbtCeiling}
  result   1 failed  ·  not a real product`;

export function TerminalType() {
  const rootRef = useRef<HTMLElement>(null);
  const [typed, setTyped] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        observer.disconnect();
        setTyped(true);
      },
      { threshold: 0.2 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="terminal" ref={rootRef} className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">
          A sample report
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Characters fade in with opacity after this block is on screen. Width
          never animates, so the motion lint stays green.
        </p>
        <pre className="mt-10 overflow-x-auto border border-line bg-panel p-6 font-mono text-sm leading-relaxed text-paper">
          {typed
            ? report.split("").map((character, index) => (
                <span
                  key={index}
                  className="type-char"
                  style={{ "--char-index": index } as CSSProperties}
                >
                  {character}
                </span>
              ))
            : report}
        </pre>
      </div>
    </section>
  );
}
