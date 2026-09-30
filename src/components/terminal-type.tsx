const report = `kiteframe 0.0.0-demo (fictional)

$ kiteframe check src/app

  pass   transform    14 tweens
  pass   opacity       6 fades
  fail   left          HeroCta  (layout)

  budgets  LCP 2.0s  CLS 0.02  TBT 150ms
  result   1 failed  ·  not a real product`;

export function TerminalType() {
  return (
    <section id="terminal" className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">A sample report</h2>
        <p className="mt-4 max-w-xl text-muted">
          Output is static for the baseline. The typing effect in M2 will fade
          characters in, not animate width.
        </p>
        <pre className="mt-10 overflow-x-auto border border-line bg-panel p-6 font-mono text-sm leading-relaxed text-paper">
          {report}
        </pre>
      </div>
    </section>
  );
}
