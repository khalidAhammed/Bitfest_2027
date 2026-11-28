"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { heroPhotos as P } from "@/lib/pastPhotos";
import { pad2 } from "./GalleryHead";

/* BitFest 2025 as an endless strip (the opening, the stage and the Project Showcase; lib/pastPhotos
   heroPhotos): two rows of photos drift on their own in opposite directions.
   Pointing at the strip stops both rows; clicking a photo opens it large (arrows and Esc work there).
   The rows are one CSS animation each (transform only); they rest while off screen, and stand still
   under reduced motion. Photos load once the strip comes near. */

const ROWS = [P.slice(0, Math.ceil(P.length / 2)), P.slice(Math.ceil(P.length / 2))];

type Lenis = { stop: () => void; start: () => void };

export default function PrizeStrip({ variant = "gallery" }: { variant?: "gallery" | "hero" }) {
  const hero = variant === "hero";
  // In the hero it is one row of every photo (twice, so it outruns wide screens), on screen from the first moment.
  const rows = hero ? [[...P, ...P]] : ROWS;
  const root = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(hero);
  const [onScreen, setOnScreen] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      setOnScreen(e.isIntersecting);
      if (e.isIntersecting) setNear(true);
    }, { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={root} className={`ps-strip flex flex-col gap-3 md:gap-4 ${hero ? "ps-hero" : ""}`} data-run={onScreen && open === null}>
        {rows.map((row, r) => (
          <div key={r} className="overflow-hidden">
            <ul className={`ps-row ${r ? "ps-right" : "ps-left"}`}>
              {/* The row twice over, so the drift loops without a seam. */}
              {[...row, ...row].map((p, k) => {
                const idx = P.indexOf(p);
                const copy = k >= row.length;
                return (
                  <li key={k} className="ps-tile">
                    <button
                      type="button"
                      tabIndex={copy ? -1 : 0}
                      aria-hidden={copy || undefined}
                      aria-label={`Open photo ${idx + 1}: ${p.alt}`}
                      onClick={() => setOpen(idx)}
                      className="absolute inset-0"
                    >
                      {near && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.src} srcSet={`${p.small} 400w, ${p.src} 680w`} sizes={hero ? "(max-width: 1023px) 220px, 320px" : "(max-width: 767px) 220px, 340px"} alt="" draggable={false} loading={hero && k < P.length ? "eager" : "lazy"} fetchPriority={hero && k < P.length ? "auto" : "low"} decoding="async" className="h-full w-full object-cover" />
                      )}
                    </button>
                    {hero && <span aria-hidden className="ps-cap"><span className="tabular-nums text-orange">{pad2(idx + 1)}</span>{p.cap} · 2025</span>}
                    <span className="lx lx-rim z-[2]" />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      {open !== null && <Viewer i={open} setI={setOpen} />}
    </>
  );
}

/** The large view: one photo over the dimmed page, with its caption, count and steps. */
function Viewer({ i, setI }: { i: number; setI: (i: number | null) => void }) {
  const close = useCallback(() => setI(null), [setI]);
  const step = useCallback((d: number) => setI((i + d + P.length) % P.length), [i, setI]);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    const prev = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      prev?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, step]);

  const p = P[i];
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Prize night photo" className="ps-viewer fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-bg/92 px-4 py-6" onClick={close}>
      <button ref={closeBtn} type="button" aria-label="Close" onClick={close} className="ts-step faq-toggle absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-[10px] md:right-8 md:top-8" data-on="false">
        <svg aria-hidden width="16" height="16" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" /></svg>
      </button>
      <div className="relative w-full max-w-[min(1200px,calc((100svh-180px)*4/3))] overflow-hidden rounded-[18px]" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={p.large} src={p.large} srcSet={`${p.src} 680w, ${p.large} 1440w`} sizes="min(1200px, 92vw)" alt={p.alt} className="ps-big block aspect-[4/3] w-full object-cover" />
        <span className="lx lx-rim z-[2]" />
      </div>
      <div className="flex w-full max-w-[min(1200px,calc((100svh-180px)*4/3))] items-center justify-between gap-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="truncate text-[16px] font-medium text-ink md:text-[18px]">{p.alt}</p>
          <span className="text-[13px] tabular-nums text-muted">{pad2(i + 1)} / {pad2(P.length)}</span>
        </div>
        <div className="flex shrink-0 gap-2">
          {[-1, 1].map((d) => (
            <button key={d} type="button" aria-label={d < 0 ? "Previous photo" : "Next photo"} onClick={() => step(d)} className="ts-step faq-toggle relative grid h-11 w-11 place-items-center rounded-[10px]" data-on="false">
              <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" className={d < 0 ? "rotate-180" : ""}><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
