"use client";

import { useEffect, useRef, useState } from "react";
import { events, fest, pad2 } from "@/lib/fest";
import BitfestLogo from "@/components/redesign/ui/BitfestLogo";
import KuetLogo from "@/components/redesign/ui/KuetLogo";
import { Button } from "@/components/redesign/ui/Button";

/* The site's navigation on the landing page and every contest page: one lit panel down the left, like the hero chip's board. The ten
   contests hang off a circuit trace as pins; the one you are on is lit green. The fest's home-page links and Register sit at the foot.
   Phones get a top bar whose menu slides the same panel in from the left. */

const HOME = [
  { href: "/#hero", label: "Home" },
  { href: "/#schedule", label: "Dates" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#partners", label: "Partners" },
];

function Panel({ slug, register, onPick }: { slug?: string; register: { href: string; label: string }; onPick?: () => void }) {
  const list = useRef<HTMLElement>(null);
  // On short screens the list scrolls: bring the contest you are on into view inside it.
  useEffect(() => {
    const nav = list.current, cur = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !cur) return;
    const n = nav.getBoundingClientRect(), c = cur.getBoundingClientRect();
    if (c.bottom > n.bottom) nav.scrollTop += c.top - n.top - n.height / 2 + c.height / 2;
  }, []);
  return (
    <div className="es-ring flex h-full w-full">
      <div className="es-well flex min-h-0 w-full flex-col">
        <a href="/" onClick={onPick} aria-label={`${fest.name} ${fest.year}, KUET CSE Innovation Fest, home`} className="es-head flex flex-col items-start gap-3 px-4 pb-3 pt-4">
          <span className="ml-1 flex items-center gap-3">
            <BitfestLogo className="h-[42px] w-auto" />
            <KuetLogo className="h-[36px] w-auto" />
          </span>
          {/* The landing page's name ticker, under the logo. */}
          <span aria-hidden className="name-ticker flex">
            <span className="name-ticker-win">
              <span className="tk-mask">
                <span className="name-ticker-row">
                  {Array.from({ length: 4 }, (_, i) => <span key={i}>KUET CSE Innovation Fest<i /></span>)}
                </span>
              </span>
            </span>
          </span>
        </a>

        <nav ref={list} aria-label="Contests" data-lenis-prevent className="es-scroll min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          <p className="flex items-center justify-between px-2 pb-2 pt-1 text-[12px] font-medium text-muted">
            <span>Contests</span>
            <span className="tabular-nums">{pad2(events.length)}</span>
          </p>
          <ul className="es-rail relative flex flex-col gap-0.5">
            {events.map((e) => {
              const here = e.slug === slug;
              return (
                <li key={e.slug} className="relative">
                  <a href={here ? "#hero" : `/events/${e.slug}`} onClick={onPick} aria-current={here ? "page" : undefined} className="es-pin group relative flex flex-col gap-0.5 rounded-[10px] py-[9px] pl-9 pr-2" data-on={here}>
                    <span aria-hidden className="es-dot" />
                    <span className="text-[11.5px] tabular-nums text-muted">
                      <span className={here ? "text-orange" : ""}>{e.kind}</span> · {e.day}
                    </span>
                    <span className={`text-[15px] font-semibold leading-[1.25] tracking-[-0.01em] transition-colors ${here ? "text-orange" : "text-cream-hi group-hover:text-ink"}`}>{e.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="es-foot flex flex-col gap-3.5 px-5 pb-5 pt-4">
          <ul className="flex justify-between gap-2 text-[13px] font-medium">
            {HOME.map((l) => (
              <li key={l.href}><a href={l.href} onClick={onPick} className="text-muted transition-colors hover:text-ink">{l.label}</a></li>
            ))}
          </ul>
          <Button href={register.href} size="sm" className="nav-btn es-cta">Register</Button>
        </div>
      </div>
    </div>
  );
}

/** `mobileOnly`: just the phone and tablet bar and its menu (the landing page keeps its own top nav on
    wide screens). */
export default function EventSidebar({ slug, register, mobileOnly = false }: { slug?: string; register: { href: string; label: string }; mobileOnly?: boolean }) {
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  // While the menu is open the page under it stays still (smooth scroll paused, page scroll locked),
  // focus moves into the menu, Escape closes it, and focus returns to the menu button after.
  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    const root = document.documentElement;
    const prev = root.style.overflow;
    lenis?.stop();
    root.style.overflow = "hidden";
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = prev;
      lenis?.start();
      menuBtn.current?.focus({ preventScroll: true });
    };
  }, [open]);
  // A link in the menu: unlock the page first, in the same tap, so an in-page link can glide to its
  // section (smooth scroll ignores scrollTo while paused), then close.
  const pick = () => {
    document.documentElement.style.overflow = "";
    (window as unknown as { __lenis?: { start(): void } }).__lenis?.start();
    setOpen(false);
  };
  // Leaving for a wider screen with the menu open: close it, so the page is never left locked.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => { if (mq.matches) setOpen(false); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      {/* Wide screens: the panel stays put down the left. */}
      {!mobileOnly && (
        <aside className="es-side fixed bottom-4 left-4 top-4 z-50 hidden w-[272px] lg:flex">
          <Panel slug={slug} register={register} />
        </aside>
      )}

      {/* Phones and tablets: a top bar; the menu slides the same panel in. */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/95 lg:hidden">
        <div className="flex h-[72px] items-center justify-between px-6 md:px-14">
          <a href="/" aria-label={`${fest.name} ${fest.year} home`} className="flex items-center gap-3"><BitfestLogo className="h-[40px] w-auto" /><KuetLogo className="h-[32px] w-auto" /></a>
          <div className="flex items-center gap-3">
            <Button href={register.href} size="sm" className="nav-btn">Register</Button>
            <button ref={menuBtn} type="button" aria-expanded={open} aria-controls="event-menu" aria-label="Contests and pages" onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center rounded-[10px] border border-line-2 text-ink">
              <svg aria-hidden width="18" height="18" viewBox="0 0 18 18"><path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.6" /></svg>
            </button>
          </div>
        </div>
      </header>
      <div id="event-menu" role="dialog" aria-modal="true" aria-label="Contests and pages" data-lenis-prevent className="es-drawer fixed inset-0 z-[60] lg:hidden" data-open={open} aria-hidden={!open} inert={!open}>
        <button type="button" tabIndex={-1} aria-label="Close menu" className="absolute inset-0 bg-[#02060d]/60" onClick={() => setOpen(false)} />
        <div className="es-drawer-panel absolute bottom-3 left-3 top-3 w-[min(320px,calc(100vw-24px))]">
          <button ref={closeBtn} type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-[10px] text-muted hover:text-ink">
            <svg aria-hidden width="16" height="16" viewBox="0 0 16 16"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" /></svg>
          </button>
          <Panel slug={slug} register={register} onPick={pick} />
        </div>
      </div>
    </>
  );
}
