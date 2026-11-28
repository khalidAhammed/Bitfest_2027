"use client";

import { useEffect, useRef } from "react";
import { CONTEST_PAGES_LIVE, eventHref, events, fest, isExternal } from "@/lib/fest";
import TraceWordmark from "./TraceWordmark";
import BottomLight from "./heroes/BottomLight";

/* The footer is one lit lid that the page lifts off: on wide screens it is fixed behind the page,
   so as the last section scrolls up it is revealed underneath. While it is revealed, the wordmark
   rises and grows into place, the columns follow at a slower rate, and the hero's bottom lights
   (two corner lights and a band, following the cursor) fade up. Where the footer is taller than the
   screen (phones), it simply scrolls. Only transform and opacity move, driven by one CSS variable. */

export default function HomeFooter() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, fits = false, fh = 0, vh = 0, top = 0, lastR = -1;
    // Layout is read only here (on resize), never while scrolling.
    const measure = () => {
      fh = el.offsetHeight;
      vh = window.innerHeight;
      fits = fh <= vh && window.innerWidth >= 768 && !reduce;
      el.style.position = fits ? "sticky" : "relative";
      el.style.bottom = fits ? "0px" : "";
      top = document.documentElement.scrollHeight - fh;
      lastR = -1;
      update();
    };
    const update = () => {
      raf = 0;
      const r = fits ? Math.min(1, Math.max(0, (window.scrollY + vh - top) / fh)) : 1;
      if (Math.abs(r - lastR) < 0.002) return;
      lastR = r;
      el.style.setProperty("--reveal", r.toFixed(3));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    measure();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  const cols = [
    { h: "Fest", l: [["Key dates", "/#schedule"], ["Gallery", "/#gallery"], ["Partners", "/#partners"]] },
    // Contest names link to their pages once those are public; until then they only light on hover.
    { h: "Contests", l: events.map((e) => [e.name, CONTEST_PAGES_LIVE ? eventHref(e) : "", isExternal(e) ? "ext" : ""]) },
    { h: "Contact", l: [[fest.email, `mailto:${fest.email}`, ""], [fest.phone, `tel:${fest.phone.replace(/[^+\d]/g, "")}`, ""], ["Facebook", fest.facebook, "ext"], ["KUET, Khulna 9203", "https://www.kuet.ac.bd", "ext"]] },
  ];
  return (
    <footer ref={ref} className="footer-reveal relative z-0 px-3 pb-3 pt-3 md:px-4 md:pb-4">
      <div className="lidx relative rounded-[24px] md:rounded-[32px]">
        <div className="fr-light absolute inset-0"><BottomLight contained /></div>
        <span className="lx lx-rim" />
        <div className="relative z-[4] mx-auto flex max-w-[1408px] flex-col gap-12 px-6 pb-8 pt-12 md:px-10 md:pt-14">
          <div className="fr-word">
            <TraceWordmark look="chamfer" className="relative h-[clamp(84px,15vw,250px)]" />
          </div>
          <div className="fr-cols grid gap-10 border-t border-rim/12 pt-10 md:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
            <div className="flex flex-col gap-4">
              <span className="text-xl font-bold tracking-[0.04em]">BITFEST<span className="text-orange"> 4.0</span></span>
              <p className="max-w-[320px] leading-relaxed text-soft">
                The 4th KUET CSE Innovation Festival. Organised by the Department of Computer Science and Engineering, KUET, Khulna.
              </p>
            </div>
            {cols.map((c) => (
              <nav key={c.h} aria-label={c.h} className="flex flex-col gap-0.5 md:gap-1">
                <span className="mb-1 text-[13px] font-medium text-dim">{c.h}</span>
                {c.l.map(([t, h, ext]) => h ? (
                  <a key={t} href={h} {...(ext ? { target: "_blank", rel: "noreferrer" } : {})} className="w-fit py-2 text-[15px] text-soft transition-colors hover:text-ink md:py-1">
                    {t}
                  </a>
                ) : (
                  <span key={t} className="w-fit py-2 text-[15px] text-soft transition-colors hover:text-ink md:py-1">{t}</span>
                ))}
              </nav>
            ))}
          </div>
          <div className="fr-cols flex flex-wrap justify-between gap-4 border-t border-rim/12 pt-6 text-[14px] text-cream/60">
            <span>© 2027 BitFest · Department of CSE, KUET</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
