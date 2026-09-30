import { Hero } from "@/components/hero";
import { LogoMarquee } from "@/components/logo-marquee";
import { ScrollStory } from "@/components/scroll-story";
import { StatCounter } from "@/components/stat-counter";
import { TerminalType } from "@/components/terminal-type";

export default function Home() {
  return (
    <main>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-baseline justify-between px-6 py-5">
          <p className="font-display text-sm tracking-wide">Kiteframe</p>
          <p className="text-xs text-muted">Demo · not for sale</p>
        </div>
      </header>
      <Hero />
      <ScrollStory />
      <StatCounter />
      <LogoMarquee />
      <TerminalType />
      <footer className="mx-auto max-w-6xl px-6 py-12 font-mono text-xs text-muted">
        Kiteframe is a fictional developer tool invented for this public
        portfolio. No real customers, clients, or private work appear here.
      </footer>
    </main>
  );
}
