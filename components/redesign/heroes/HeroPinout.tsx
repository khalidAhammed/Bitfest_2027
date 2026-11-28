"use client";

import { useEffect, useRef, useState } from "react";
import { events, fest, money, SHOW_PRIZES } from "@/lib/fest";
import ContestLink from "@/components/redesign/ui/ContestLink";
import ChipGlow, { type GlowId } from "./ChipGlow";
import WarmLight from "./rebrand/WarmLight";
import PoolOdometer from "./PoolOdometer";
import PrizeStrip from "../gallery/PrizeStrip";
import BottomLight from "./BottomLight";

/* Hero: Pinout. The fest is one chip: a substrate with a machined metal lid and ten contest pins
   (five a side) labelled like a datasheet. Built from plain HTML and CSS so it paints with the first response;
   the only motion is transform/opacity (glow, sheen, signals), and one timer steps the active pin. */

const SIDE = 20; // pins down each side
const TOP = 18; // pins across top and bottom
/** The contests in pin order, six down each side; AI-Driven Solutions (the longest name) closes the
    right side. The ICT Olympiad (for school students) has its own pin at the foot of the chip. */
const BOTTOM = events.find((e) => e.slug === "ict-olympiad")!;
const ORDER = [
  "ai-hackathon", "imagine-ai", "project-showcase", "iupc", "3mt", "it-case", // left
  "ctf", "datathon", "lfr", "soccer-bot", "gaming", "ai-solutions", // right
];
const PINS = ORDER.map((slug) => events.find((e) => e.slug === slug)!);
/** Names set on two lines in the hero. */
const PIN_NAME: Record<string, string> = { "it-case": "Tech Business Case\nCompetition" };
const PER = Math.floor(PINS.length / 2); // contests down the left side; the rest go down the right
const BI = PINS.length; // the bottom pin's index in the active cycle
/** Where on its side contest i sits: each side spreads its own contests over the full height, so the
    two columns start and end level even when one has a contest more (13 = 7 + 6). */
const slot = (i: number) => {
  const left = i < PER;
  const count = left ? PER : PINS.length - PER;
  return 0.5 + ((left ? i : i - PER) * 18) / Math.max(1, count - 1);
};
const yOf = (i: number) => `${7 + (86 * i) / (SIDE - 1)}%`;
const xOf = (i: number) => `${8 + (84 * i) / (TOP - 1)}%`;

// The little 2D code etched on the lid (fixed pattern).
const CODE = [1,0,1,1,0,1,0,1, 0,1,1,0,1,0,1,1, 1,1,0,1,0,0,1,0, 0,1,0,1,1,1,0,1, 1,0,1,0,1,0,1,1, 0,0,1,1,0,1,1,0, 1,1,0,0,1,0,1,1, 1,0,1,1,1,1,0,1];

export type SeatId = "float" | "socket" | "carved" | "dissolve" | "board";
export type LidId = "metal" | "corner" | "orbit" | "duo" | "horizon" | "live";

const RIM_CORNER = "radial-gradient(130% 130% at 0% 100%, var(--color-accent-hi), color-mix(in oklab, var(--color-orange) 85%, transparent) 30%, color-mix(in oklab, var(--color-accent-deep) 45%, transparent) 60%, color-mix(in oklab, var(--color-rim) 20%, transparent))";

/** The lit lids: a black face lit in orange, deep rust and black (gradients painted once;
    transform/opacity move them). */
function LidLight({ kind }: { kind: Exclude<LidId, "metal" | "live"> }) {
  if (kind === "orbit") {
    return (
      <>
        <span className="lx lx-orbit"><span className="lx-corner lx-bl lx-warm" /></span>
        <span className="lx lx-rimlight">
          <i className="glow-spin" style={{ ["--spin" as string]: "20s", background: "conic-gradient(from 0deg, transparent 0deg 150deg, color-mix(in oklab, var(--color-accent-deep) 80%, transparent) 195deg, var(--color-accent-hi) 225deg, color-mix(in oklab, var(--color-orange) 85%, transparent) 250deg, transparent 300deg 360deg)" }} />
        </span>
        <span className="lx lx-rim" />
      </>
    );
  }
  if (kind === "duo") {
    return (
      <>
        <span className="lx lx-corner lx-bl lx-warm lx-trade-a" />
        <span className="lx lx-corner lx-tr lx-small lx-plum lx-trade-b" />
        <span className="lx lx-rimlight" style={{ background: "linear-gradient(45deg, var(--color-accent-hi), color-mix(in oklab, var(--color-orange) 30%, transparent) 40%, color-mix(in oklab, var(--color-accent-deep) 30%, transparent) 60%, color-mix(in oklab, var(--color-orange) 90%, transparent))" }} />
        <span className="lx lx-rim" />
      </>
    );
  }
  if (kind === "horizon") {
    return (
      <>
        <span className="lx lx-horizon" />
        <span className="lx lx-rimlight" style={{ background: "linear-gradient(0deg, var(--color-accent-hi), color-mix(in oklab, var(--color-orange) 60%, transparent) 30%, color-mix(in oklab, var(--color-accent-deep) 30%, transparent) 60%, color-mix(in oklab, var(--color-rim) 18%, transparent))" }} />
        <span className="lx lx-rim" />
      </>
    );
  }
  return (
    <>
      <span className="lx lx-corner lx-bl lx-breathe">
        <i className="lx inset-0 lx-warm" />
        <i className="lx inset-0 lx-fade lx-warm-2" />
      </span>
      <span className="lx lx-rimlight" style={{ background: RIM_CORNER }} />
      <span className="lx lx-rim" />
    </>
  );
}

export default function HeroPinout({ glow = "orbit", seat = "float", lid = "metal" }: { glow?: GlowId; seat?: SeatId; lid?: LidId }) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const hold = useRef(false);
  const sec = useRef<HTMLElement>(null);
  // A hovered contest swings the live lid's light out toward that pin.
  const focus: [number, number] | null =
    hovered === null ? null : hovered === BI ? [0.5, 1.3] : [hovered < PER ? -0.25 : 1.25, (7 + (86 * slot(hovered)) / (SIDE - 1) - 10.5) / 79];

  // Step through the pins; pause while a label is hovered or focused.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!hold.current) setActive((a) => (a + 1) % events.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  const pick = (i: number) => {
    hold.current = i >= 0;
    setHovered(i >= 0 ? i : null);
    if (i >= 0) setActive(i);
  };

  return (
    <section ref={sec} id="hero" aria-label={`${fest.name} ${fest.year}`} className="relative flex min-h-[100svh] flex-col overflow-hidden px-6 pb-8 pt-[88px] md:px-14 lg:h-[100svh] lg:min-h-[680px]">
      <div aria-hidden className="hero-stage-bg pointer-events-none absolute inset-0" />
      <div aria-hidden className="hero-dots pointer-events-none absolute inset-0" />
      <div aria-hidden className="hero-noise pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      {lid === "live" && <BottomLight />}

      <div className="relative mx-auto flex w-full max-w-[1332px] flex-1 flex-col">

        <div className="relative my-6 flex flex-1 flex-col items-center justify-center gap-6 lg:mb-10 lg:mt-0 lg:gap-5">
          {/* 3 · The motto, above the chip in the accent. */}
          <p className="hero-in rd-motto relative z-[5] text-balance text-center text-[clamp(17px,5vw,21px)] font-semibold leading-[1.25] tracking-[-0.02em] lg:text-[clamp(19px,1.55vw,25px)]" style={{ animationDelay: "0.1s" }}>AI for Mankind, Society and the<br />Sustainable Development</p>
          <div className="chip relative">
            {/* What the chip sits in, and the light. */}
            {seat === "socket" && (
              <>
                <div aria-hidden className="seat-pocket absolute -inset-[18px] rounded-[24px]" />
                <div aria-hidden className="pointer-events-none absolute -inset-[18px] overflow-hidden rounded-[24px]">
                  <div className="absolute inset-[18px]"><ChipGlow kind={glow} /></div>
                </div>
              </>
            )}
            {seat === "board" && (
              <>
                <div aria-hidden className="seat-board absolute -inset-[16%] rounded-[40px]" />
                <div aria-hidden className="seat-board-fade pointer-events-none absolute -inset-[16%]">
                  <div className="absolute inset-[11.1%]"><ChipGlow kind={glow} /></div>
                </div>
                <div aria-hidden className="absolute -inset-[12px] rounded-[18px] border border-white/[0.12]" />
                <span aria-hidden className="absolute -left-[22px] -top-[22px] h-0 w-0 border-l-[8px] border-t-[8px] border-l-transparent border-t-white/30" />
              </>
            )}
            {seat === "dissolve" && (
              <div aria-hidden className="seat-dissolve-mask pointer-events-none absolute inset-0"><ChipGlow kind={glow} /></div>
            )}
            {seat === "float" && <ChipGlow kind={glow} />}

            {/* Leaders and their signals. Drawn first, so each line comes out from behind the chip and its pin. The
                signals start just outside the seat's frame line (12px out) and are clipped there, so a
                light never travels across that line; each one fades out about 56px short of its pin's end
                dot. On phones the lines stay but the moving lights are left out. */}
            {PINS.map((e, ev) => {
              const left = ev < PER;
              const y = yOf(slot(ev));
              const on = ev === active;
              const from = left ? { right: "calc(100% - var(--inset-x))" } : { left: "calc(100% - var(--inset-x))" };
              return (
                <div key={e.slug} aria-hidden>
                  <span
                    className={`lead-in absolute z-[1] h-px -translate-y-1/2 transition-colors duration-300 ${left ? "origin-right" : "origin-left"} ${on ? "bg-orange" : "bg-white/15"}`}
                    style={{ top: y, width: "calc(var(--inset-x) + var(--pin) + var(--lead))", animationDelay: `${0.05 + (ev % PER) * 0.03}s`, ...from }}
                  >
                    <span className={`absolute top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full transition-[background-color,box-shadow] duration-300 ${left ? "-left-[2px]" : "-right-[2px]"} ${on ? "bg-orange shadow-[0_0_10px_color-mix(in_oklab,var(--color-orange)_80%,transparent)]" : "bg-white/30"}`} />
                  </span>
                  <span className={`sig hidden lg:block ${left ? "sig-l" : "sig-r"}`} data-on={on} style={{ top: y, width: "calc(var(--pin) + var(--lead) - 70px)", clipPath: "inset(-12px 0)", ...(left ? { right: "calc(100% + 14px)" } : { left: "calc(100% + 14px)" }) }}>
                    <i style={{ animationDelay: `${-(ev * 1.4) % 11}s` }} />
                  </span>
                </div>
              );
            })}
            {/* The ICT Olympiad's pin, straight down from the middle of the chip's foot. */}
            <span
              aria-hidden
              className={`lead-in absolute left-1/2 z-[4] w-px -translate-x-1/2 origin-top transition-colors duration-300 ${active === BI ? "bg-orange" : "bg-white/15"}`}
              style={{ top: "100%", height: "24px", animationDelay: "0.2s" }}
            >
              <span className={`absolute -bottom-[2px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full transition-[background-color,box-shadow] duration-300 ${active === BI ? "bg-orange shadow-[0_0_10px_color-mix(in_oklab,var(--color-orange)_80%,transparent)]" : "bg-white/30"}`} />
            </span>

            {/* Substrate, via ring, capacitors. */}
            <div aria-hidden className={`absolute inset-0 z-[3] ${seat === "dissolve" ? "seat-dissolve-mask" : ""}`}>
            <div aria-hidden className={`absolute inset-0 rounded-[12px] ${seat === "carved" ? "seat-carved" : seat === "dissolve" ? "seat-dissolve" : seat === "board" ? "chip-substrate seat-board-chip" : "chip-substrate"}`} />
            {seat === "carved" && (
              <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[12px] opacity-[0.28]"><ChipGlow kind={glow} /></div>
            )}
            <div aria-hidden className="absolute rounded-[10px] border-[1.5px] border-dotted border-white/[0.09]" style={{ inset: "5.5% calc(var(--inset-x) - 4.5%)" }} />
            {[
              "left-[2.4%] top-[2.6%]",
              "right-[2.4%] top-[2.6%]",
              "left-[2.4%] bottom-[2.6%]",
              "right-[2.4%] bottom-[2.6%]",
            ].map((pos) => (
              <div key={pos} aria-hidden className={`absolute grid grid-cols-2 gap-x-[3px] gap-y-[3px] ${pos} ${seat === "carved" ? "hidden" : ""}`}>
                {Array.from({ length: 6 }, (_, i) => <span key={i} className="cap h-[3px] w-[6px] lg:h-[4px] lg:w-[9px]" />)}
              </div>
            ))}
            </div>

            {lid !== "metal" ? (
              <div className="lidx absolute z-[3] flex flex-col items-center justify-center rounded-[9px] text-center [container-type:inline-size]" style={{ inset: "10.5% var(--inset-x)" }}>
                {lid === "live" ? (
                  <>
                    <span className="lx lx-corner lx-warm" style={{ width: "80%", left: "74%", top: "112%" }} />
                    <WarmLight track={sec} rest={[0.78, 1.08]} radius={0.47} lean={0.3} box={[-0.2, 1.0, 1.2, 1.2]} focus={focus} />
                    <span className="lx lx-rim" />
                  </>
                ) : (
                  <LidLight kind={lid} />
                )}
                {/* 1 · The main title in the middle. 2 · The prize pool along the foot of the lid. */}
                <h1 className="relative z-[4] whitespace-nowrap text-[21cqi] font-semibold leading-[0.92] tracking-[-0.045em]">
                  <span className="lx-ink-warm">{fest.name}</span>
                  <br />
                  <span className="lx-ink-warm">{fest.year}</span>
                </h1>
                <p className="absolute inset-x-0 bottom-[7%] z-[4] whitespace-nowrap text-[5.4cqi] font-medium tracking-[-0.01em] text-cream/85 [filter:drop-shadow(0_2px_6px_rgba(3,10,20,0.9))_drop-shadow(0_0_18px_rgba(3,10,20,0.65))]">
                  {/* The prize pool stays on the chip even while the rest of the prize money is hidden. */}
                  <PoolOdometer value={`${fest.prizePool} BDT`} className="text-[1.3em] font-semibold tracking-[-0.025em]" /> prize pool
                </p>
                {/* The dates head the lid. */}
                <p className="absolute inset-x-0 top-[7%] z-[4] text-[13px] font-medium tracking-[-0.005em] text-cream/85 [text-shadow:0_1px_10px_rgba(0,0,0,0.35)] lg:text-[clamp(14px,1.15vw,18px)]">{fest.dates}</p>
              </div>
            ) : (
              <>
            {/* The metal lid, its marking and lit rim. */}
              <div className={`chip-lid absolute z-[3] flex flex-col items-center justify-center rounded-[9px] text-center ${seat !== "float" ? "is-set" : ""} ${seat === "carved" ? "is-carved" : ""}`} style={{ inset: "10.5% var(--inset-x)" }}>
                <span aria-hidden className="absolute left-[5%] top-[6%] h-2.5 w-2.5 rounded-full bg-[#0b0c11] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.08)] lg:h-3 lg:w-3" />
                <span aria-hidden className="absolute right-[5%] top-[6%] grid w-[7%] grid-cols-8 gap-px opacity-50">
                  {CODE.map((on, i) => <span key={i} className={`aspect-square ${on ? "bg-[#c9cdd8]" : ""}`} />)}
                </span>
                <h1 className="text-[clamp(40px,14vw,60px)] font-semibold leading-[0.9] tracking-[-0.045em] lg:text-[clamp(56px,min(8.4vw,calc((100svh_-_300px)*0.18)),104px)]">
                  <span className={seat === "carved" ? "carved-ink" : "chip-ink"}>BitFest</span>
                  <br />
                  <span className={seat === "carved" ? "carved-ink-orange" : "chip-ink-orange"}>2027</span>
                </h1>
                <p className="mt-3 text-[12px] font-medium text-[#8b90a3] md:text-[13px]">BF-27 · KUET CSE · Khulna</p>
                <p aria-hidden className="absolute bottom-[6%] left-[5%] text-[11px] tabular-nums text-[#5c6172]">Lot 2701</p>
              </div>
              <div aria-hidden className="chip-rim pointer-events-none absolute z-[3] rounded-[9px]" style={{ inset: "10.5% var(--inset-x)" }} />
  
              </>
            )}

            {/* Pin labels (desktop). */}
            <ul className="hidden lg:block">
              {PINS.map((e, i) => {
                const left = i < PER;
                const on = active === i;
                return (
                  <li
                    key={e.slug}
                    className="hero-in absolute -translate-y-[9px]"
                    style={{ animationDelay: `${0.12 + (i % PER) * 0.03}s`, top: yOf(slot(i)), ...(left ? { right: "calc(100% + var(--pin) + var(--lead) + 14px)" } : { left: "calc(100% + var(--pin) + var(--lead) + 14px)" }) }}
                  >
                    <ContestLink
                      e={e}
                      onPointerEnter={() => pick(i)}
                      onPointerLeave={() => pick(-1)}
                      onFocus={() => pick(i)}
                      onBlur={() => pick(-1)}
                      className={`relative flex w-max max-w-[250px] flex-col ${left ? "items-end text-right" : "items-start text-left"}`}
                    >
                      {/* The name, with its category and day under it; the lit pin turns both green. */}
                      <span className={`pin-name whitespace-pre-line text-balance text-[15px] font-semibold leading-[1.2] transition-colors ${on ? "text-orange" : "text-cream-hi"}`}>{PIN_NAME[e.slug] ?? e.name}</span>
                      <span className={`pin-sub mt-0.5 whitespace-nowrap text-[12px] tabular-nums transition-colors ${on ? "text-orange/85" : "text-dim"}`}>{SHOW_PRIZES ? `${e.day} · ${money(e.pool)} BDT` : e.day === "Online" ? `${e.kind} · online` : `${e.kind} · ${e.day}`}</span>
                    </ContestLink>
                  </li>
                );
              })}
              {/* The ICT Olympiad, under the chip. */}
              <li className="hero-in absolute left-1/2 -translate-x-1/2" style={{ animationDelay: "0.25s", top: "calc(100% + 31px)" }}>
                <ContestLink
                  e={BOTTOM}
                  onPointerEnter={() => pick(BI)}
                  onPointerLeave={() => pick(-1)}
                  onFocus={() => pick(BI)}
                  onBlur={() => pick(-1)}
                  className="relative flex w-max flex-col items-center text-center"
                >
                  <span className={`pin-name text-[15px] font-semibold leading-[1.2] transition-colors ${active === BI ? "text-orange" : "text-cream-hi"}`}>{BOTTOM.name}</span>
                  <span className={`pin-sub mt-0.5 whitespace-nowrap text-[12px] tabular-nums transition-colors ${active === BI ? "text-orange/85" : "text-dim"}`}>{BOTTOM.kind} · {BOTTOM.day} · school students</span>
                </ContestLink>
              </li>
            </ul>
          </div>
        </div>

        {/* The Explore and Facebook buttons are off for now (HeroActions in ./shared). */}
      </div>
      {/* Prize night from BitFest 2025, drifting along the foot of the hero, edge to edge. */}
      <div className="hero-in relative z-[5] -mx-6 mt-6 md:-mx-14 lg:mt-5" style={{ animationDelay: "0.2s" }}>
        <PrizeStrip variant="hero" />
      </div>
    </section>
  );
}
