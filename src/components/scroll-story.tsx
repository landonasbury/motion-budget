const beats = [
  {
    kicker: "01 · Record",
    title: "Watch the timeline, not the screenshot.",
    body: "Kiteframe (fictional) samples which properties actually move. Transform and opacity are allowed. Geometry that forces layout is not.",
  },
  {
    kicker: "02 · Diff",
    title: "Budgets live in one file.",
    body: "LCP, CLS, TBT, and script bytes are numbers a pull request can fail. The story here is static in this milestone; motion comes later.",
  },
  {
    kicker: "03 · Gate",
    title: "CI is the design review.",
    body: "If a keyframe animates left or width, the check is red. That is the product idea, invented so this repo has something honest to launch.",
  },
];

export function ScrollStory() {
  return (
    <section id="story" className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">
          How a fictional check works
        </h2>
        <ol className="mt-14 grid gap-12 md:grid-cols-3">
          {beats.map((beat) => (
            <li key={beat.kicker} className="border-t border-line pt-6">
              <p className="font-mono text-sm text-accent">{beat.kicker}</p>
              <h3 className="mt-3 font-display text-2xl leading-snug">{beat.title}</h3>
              <p className="mt-4 text-muted">{beat.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
