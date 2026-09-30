const brands = [
  { name: "Helio Batch", mark: "HB" },
  { name: "Northrail Labs", mark: "NR" },
  { name: "Quillhop", mark: "QH" },
  { name: "Ampere Desk", mark: "AD" },
  { name: "Foldline", mark: "FL" },
  { name: "Sable Park", mark: "SP" },
];

export function LogoMarquee() {
  return (
    <section id="logos" className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">
          Invented teams on the waitlist
        </h2>
        <p className="mt-4 text-muted">
          Names and marks are fake. The row is static; a looping marquee is M2.
        </p>
        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
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
