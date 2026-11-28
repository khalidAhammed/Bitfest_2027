"use client";

import { useEffect, useRef, useState } from "react";
import BitfestLogo from "@/components/redesign/ui/BitfestLogo";
import KuetLogo from "@/components/redesign/ui/KuetLogo";
import { events, fest } from "@/lib/fest";
import ContestLink from "@/components/redesign/ui/ContestLink";
import { Button } from "@/components/redesign/ui/Button";

export type NavLink = { href: string; label: string };
const HOME_LINKS: NavLink[] = [
  { href: "#schedule", label: "Schedule" },
  { href: "#gallery", label: "Gallery" },
  { href: "#partners", label: "Partners" },
];

/** Events: one panel, every contest in two columns. Opens on hover or click, closes on leaving,
    Escape or a click elsewhere; rows rise in one after another and light on hover. */
function EventsMenu() {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const t = useRef(0);
  const show = () => { window.clearTimeout(t.current); setOpen(true); };
  const hide = () => { window.clearTimeout(t.current); t.current = window.setTimeout(() => setOpen(false), 160); };
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const click = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    window.addEventListener("keydown", key);
    window.addEventListener("mousedown", click);
    return () => { window.removeEventListener("keydown", key); window.removeEventListener("mousedown", click); };
  }, [open]);
  return (
    <div ref={wrap} className="relative" onPointerEnter={show} onPointerLeave={hide}>
      <button type="button" aria-expanded={open} aria-controls="events-menu" onClick={() => setOpen((o) => !o)} className={`flex items-center gap-1.5 transition hover:text-ink ${open ? "text-ink" : "text-muted"}`}>
        Events
        <svg aria-hidden width="10" height="10" viewBox="0 0 10 10" className={`transition-transform duration-300 ${open ? "rotate-180 text-orange" : ""}`}><path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
      </button>
      <div id="events-menu" data-open={open} className="ev-menu absolute left-1/2 top-full pt-5">
        <div className="lidx relative w-[600px] overflow-hidden rounded-[18px] p-3 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)]">
          <span aria-hidden className="lx lx-corner lx-tr lx-warm" style={{ width: "70%", opacity: 0.55 }} />
          <span aria-hidden className="lx lx-rim" />
          <ul className="relative z-[4] grid grid-cols-2 gap-1">
            {events.map((e, i) => (
              <li key={e.slug} className="ev-row" style={{ transitionDelay: open ? `${60 + i * 28}ms` : "0ms" }}>
                <ContestLink e={e} onClick={() => setOpen(false)} className="group flex items-center justify-between gap-3 rounded-[11px] px-4 py-3 transition-colors hover:bg-orange/10">
                  <span className="flex flex-col">
                    <span className="text-[15px] font-semibold text-ink transition-colors group-hover:text-orange">{e.name}</span>
                    <span className="text-[12px] text-dim">{e.kind}</span>
                  </span>
                  <span className="shrink-0 text-[12px] tabular-nums text-muted">{e.day}</span>
                </ContestLink>
              </li>
            ))}
          </ul>
          <div className="relative z-[4] mt-2 flex items-center justify-between border-t border-rim/12 px-4 pb-1 pt-3 text-[13px]">
            <span className="text-muted">{events.length} competitions · finals on campus, {fest.dates}</span>
            <a href="/#schedule" onClick={() => setOpen(false)} className="font-medium text-orange transition-opacity hover:opacity-80">Key dates →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The site's one navigation bar. Event pages pass their own section links, a page name and a CTA. */
export default function HomeNav({ links = HOME_LINKS, sub, cta = { href: "#schedule", label: "Register" } }: { links?: NavLink[]; sub?: string; cta?: NavLink } = {}) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${open ? "border-b border-line bg-bg" : solid ? "border-b border-line bg-bg/95" : "border-b border-transparent"}`}>
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 md:px-14">
        <a href="/" aria-label={`${fest.name} ${fest.year}, KUET CSE Innovation Fest, home`} className="flex items-center gap-3">
          <BitfestLogo />
          {/* KUET's crest after the BitFest logo. */}
          <KuetLogo className="h-[32px] w-auto sm:h-[40px]" />
          {/* The fest's full name in a small box beside the logo, running as a ticker. */}
          <span aria-hidden className="name-ticker hidden sm:flex">
            <span className="name-ticker-win">
              <span className="tk-mask">
                <span className="name-ticker-row">
                  {Array.from({ length: 4 }, (_, i) => <span key={i}>KUET CSE Innovation Fest<i /></span>)}
                </span>
              </span>
            </span>
          </span>
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-8 text-[15px] font-medium lg:flex">
          <EventsMenu />
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-muted transition hover:text-ink">{l.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button href={cta.href} size="sm" className="nav-btn">
            {/* The narrowest phones get the first word only, so the button clears the logo. */}
            <span className="min-[400px]:hidden">{cta.label.split(" ")[0]}</span>
            <span className="hidden min-[400px]:inline">{cta.label}</span>
          </Button>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="home-menu"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="grid h-11 w-11 place-items-center border border-line-2 transition hover:border-orange lg:hidden"
          >
            <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden>
              <path d={open ? "M3 1l12 10M15 1L3 11" : "M0 1h18M0 6h18M0 11h18"} stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="home-menu" aria-label="Sections" className="flex max-h-[calc(100svh-72px)] flex-col overflow-y-auto border-t border-line px-6 py-4 lg:hidden">
          <p className="pb-1 pt-2 text-[13px] font-medium text-dim">Events</p>
          <ul className="grid grid-cols-2 gap-x-4 border-b border-line pb-3">
            {events.map((e) => (
              <li key={e.slug}><ContestLink e={e} onClick={() => setOpen(false)} className="block py-2 text-[15px] text-soft transition hover:text-ink">{e.name}</ContestLink></li>
            ))}
          </ul>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 text-lg text-soft transition hover:text-ink">{l.label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}
