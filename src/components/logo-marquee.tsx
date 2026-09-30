const brands = [
  { name: "Helio Batch", mark: "HB" },
  { name: "Northrail Labs", mark: "NR" },
  { name: "Quillhop", mark: "QH" },
  { name: "Ampere Desk", mark: "AD" },
  { name: "Foldline", mark: "FL" },
  { name: "Sable Park", mark: "SP" },
];

function BrandList({ hidden }: { hidden?: boolean }) {
  return (
    <ul
      className="flex items-stretch"
      aria-hidden={hidden ? true : undefined}
    >
      {brands.map((brand) => (
        <li
          key={`${hidden ? "dup-" : ""}${brand.name}`}
          className="mx-2 flex min-w-52 items-center gap-3 border border-line px-4 py-4"
        >
          <span
            aria-hidden="true"
            className="grid size-10 place-items-center border border-accent font-mono text-xs text-accent"
          >
            {brand.mark}
          </span>
          <span className="font-mono text-sm">{brand.name}</span>
        </li>
      ))}
    </ul>
  );
}

export function LogoMarquee() {
  return (
    <section id="logos" className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">
          Invented teams on the waitlist
        </h2>
        <p className="mt-4 text-muted">
          Names and marks are fake. The strip loops with{" "}
          <span className="font-mono text-paper">transform</span> only; hover
          pauses it.
        </p>
        <div className="logo-marquee mt-10" aria-hidden="true">
          <div className="logo-marquee-track">
            <BrandList />
            <BrandList hidden />
          </div>
        </div>
        <ul className="logo-static mt-10 grid-cols-2 gap-4 md:grid-cols-3">
          {brands.map((brand) => (
            <li
              key={brand.name}
              className="flex items-center gap-3 border border-line px-4 py-4"
            >
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center border border-accent font-mono text-xs text-accent"
              >
                {brand.mark}
              </span>
              <span className="font-mono text-sm">{brand.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
