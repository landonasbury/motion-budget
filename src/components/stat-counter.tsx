const stats = [
  { value: "2.0s", label: "LCP ceiling" },
  { value: "0.02", label: "CLS ceiling" },
  { value: "170KB", label: "Initial JS, gzipped" },
];

export function StatCounter() {
  return (
    <section id="budgets" className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">
          Numbers the gate will keep
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Static figures for this milestone. They match{" "}
          <span className="font-mono text-paper">performance-budgets.json</span>
          . Counting motion lands in M2.
        </p>
        <dl className="mt-12 grid gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="border border-line bg-panel p-8">
              <dt className="font-mono text-sm text-muted">{stat.label}</dt>
              <dd className="mt-3 font-mono text-5xl text-accent">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
