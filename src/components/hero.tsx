import Image from "next/image";
import { preload } from "react-dom";

const HERO_SRC = "/images/hero.svg";

export function Hero() {
  preload(HERO_SRC, { as: "image", fetchPriority: "high" });

  return (
    <section className="border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="hero-in font-mono text-sm text-accent">
            Fictional product · portfolio demo
          </p>
          <h1 className="hero-in mt-4 font-display text-4xl leading-tight tracking-tight md:text-6xl">
            Catch layout animation before it ships.
          </h1>
          <p className="hero-in mt-6 max-w-md text-lg text-muted">
            Kiteframe is an invented profiler that fails CI when motion touches
            layout. It is not a real product; this page is the proof of the
            gate around it.
          </p>
          <a
            href="#terminal"
            className="hero-in mt-8 inline-block bg-accent px-5 py-3 font-mono text-sm text-ink"
          >
            Read a sample report
          </a>
        </div>
        <Image
          src={HERO_SRC}
          alt="Diagram of a kite-shaped graph on a dark grid, invented artwork for the Kiteframe demo."
          width={960}
          height={720}
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 90vw, 28rem"
          className="hero-in-late h-auto w-full border border-line bg-panel"
        />
      </div>
    </section>
  );
}
