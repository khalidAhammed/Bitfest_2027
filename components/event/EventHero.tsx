import type { ReactNode } from "react";
import { events, fest } from "@/lib/fest";
import { Button } from "@/components/ui/Button";
import BottomLight from "@/components/redesign/heroes/BottomLight";
import { hasRulebook } from "@/lib/eventPages";
import RegisterButton from "./RegisterButton";

/* Every contest page opens the same way, on the landing hero's ground: the dot field, grain, top
   light and the warm bottom-corner lights that follow the cursor. The title sits at the top; each
   contest brings its own live scene underneath (the soccer match, the training curves) and a small
   lid-shaped badge over it. */

export default function EventHero({
  slug,
  lead,
  registerHref,
  rulebookHref,
  scene,
  under,
  badge,
}: {
  slug: string;
  lead: string;
  registerHref: string;
  rulebookHref: string;
  scene: ReactNode;
  /** Sits in the flow right under the buttons and fills the rest of the hero (e.g. the leaderboard). */
  under?: ReactNode;
  badge?: ReactNode;
}) {
  const e = events.find((x) => x.slug === slug)!;
  // With a panel under the buttons the hero may grow past one screen on very short phones, so the
  // panel is never cut; otherwise it is exactly one screen tall.
  return (
    <section className={`relative flex flex-col overflow-hidden ${under ? "min-h-[max(100svh,640px)]" : "h-[100svh] min-h-[640px]"}`} aria-label={`${e.name}, ${fest.name} ${fest.year}`}>
      <div aria-hidden className="hero-stage-bg pointer-events-none absolute inset-0" />
      <div aria-hidden className="hero-dots pointer-events-none absolute inset-0" />
      <div aria-hidden className="hero-noise pointer-events-none absolute inset-0" />
      {/* As on the landing hero: the ground fades into the page at the bottom, and the corner lights
          stay pinned to the bottom of the screen, fading as you scroll. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      <BottomLight />

      {/* The scene's own 3D (the pitch tilting back on scroll) gets its perspective here, so the
          section stays a plain frame and the lights above stay pinned to the screen. */}
      {scene && <div className="absolute inset-0 [perspective:1400px]">{scene}</div>}

      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center px-6 pt-[clamp(104px,15vh,150px)] text-center md:px-14">
        {/* Over a live scene, the ground behind the copy sinks darker, so the words sit on a quiet patch
            (the scene's players are also kept out of this area). */}
        {scene && <div aria-hidden className="hero-copy-shade absolute inset-x-0 -bottom-[180px] -top-[120px] -z-10" />}
        <p className="hero-in text-[15px] font-medium text-soft">
          <span className="text-orange">{e.kind}</span> · {e.day === "Online" ? "Online, entries due 25 January" : `${e.day} on the KUET campus`}
        </p>
        {/* Long names (over 20 characters) get a smaller size, so "AI-Driven Solutions for Bangladesh's Needs" fits a 320px phone. */}
        <h1 className={`mt-4 text-balance font-semibold leading-[0.92] tracking-[-0.05em] ${e.name.length > 20 ? "text-[clamp(36px,min(8vw,11vh),108px)]" : "text-[clamp(60px,min(9vw,13vh),140px)]"}`}>
          <span className="lx-ink-warm">{e.name}</span>
        </h1>
        <p className="hero-in mt-6 max-w-[580px] text-lg leading-relaxed text-soft md:text-xl" style={{ animationDelay: "0.2s" }}>
          {lead}
        </p>
        <div className="hero-in pointer-events-auto mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: "0.3s" }}>
          <RegisterButton href={registerHref} />
          {hasRulebook(rulebookHref) && <Button href={rulebookHref} variant="ghost">Read the rulebook</Button>}
        </div>
      </div>

      {under && <div className="relative z-10 flex-1">{under}</div>}

      {badge && (
        <div className="lidx pointer-events-none absolute bottom-8 left-1/2 z-20 flex w-max -translate-x-1/2 items-center gap-4 rounded-full py-2 pl-4 pr-5 text-[14px] font-medium">
          <span className="lx lx-rim" />
          {badge}
        </div>
      )}
    </section>
  );
}
