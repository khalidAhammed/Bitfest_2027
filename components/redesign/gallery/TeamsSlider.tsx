"use client";

import { useEffect, useRef, useState } from "react";
import { teamPhotos as P } from "@/lib/pastPhotos";
import { useLiveTick } from "@/components/event/useLiveTick";
import { pad2 } from "./GalleryHead";

/* The teams of BitFest 2025, first in the gallery: one large photo in the middle with its neighbours
   dimmed at the sides, fading into the page at both edges. It loops without end: every photo sits at
   its place relative to the one in view, counted the short way round, so the last photo stands to the
   left of the first and stepping past either end carries on rather than rewinding. It moves on by
   itself every few seconds (not while pointed at or just after a visitor moved it), and can be dragged
   or swiped, stepped with the arrow buttons or the keyboard, or moved by clicking a neighbour. Slides
   move by transform only; photos load as they come near. */

const N = P.length;
const AUTO_MS = 5200;
const HALF = Math.floor(N / 2);
// Photos further than this from the one in view are off screen: they move without a transition, so
// the one that wraps from one end to the other never sweeps across the view.
const NEAR = 2;

/** Where photo k stands relative to photo i, the short way round: -HALF .. N - HALF - 1. */
const offsetOf = (k: number, i: number) => ((k - i + N + HALF) % N) - HALF;

export default function TeamsSlider() {
  // An endless count of steps; the photo in view is that count round the loop.
  const [pos, setPos] = useState(0);
  const i = ((pos % N) + N) % N;
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [loaded, setLoaded] = useState(() => new Set([0, 1, 2, N - 1]));
  const root = useRef<HTMLDivElement>(null);
  const hover = useRef(false);
  const touched = useRef(0);
  const justDragged = useRef(false);
  const drag = useRef<{ x: number; y: number; id: number; moved: boolean; locked: boolean } | null>(null);

  const go = (next: number, byHand = true) => {
    setPos(next);
    if (byHand) touched.current = Date.now();
  };

  // Once the page has finished loading and the browser is idle, fetch the first few photos in
  // advance, so the slider is ready by the time it is scrolled to.
  useEffect(() => {
    const warm = () => setLoaded((s) => new Set([...s, 0, 1, 2, N - 1, N - 2]));
    const idle = (window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const start = () => (idle ? idle(warm, { timeout: 2500 }) : window.setTimeout(warm, 1200));
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  // Photos within two of the one in view (both ways round) are fetched; the rest wait.
  useEffect(() => {
    setLoaded((s) => {
      const near = [-2, -1, 0, 1, 2].map((d) => (i + d + N) % N);
      if (near.every((k) => s.has(k))) return s;
      return new Set([...s, ...near]);
    });
  }, [i]);

  useLiveTick(AUTO_MS, () => {
    if (hover.current || drag.current || Date.now() - touched.current < AUTO_MS * 1.6) return;
    go(pos + 1, false);
  }, root);

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false, locked: false };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const mx = e.clientX - d.x;
    const my = e.clientY - d.y;
    // Decide once whether this is a sideways drag (ours) or a page scroll (the browser's).
    if (!d.locked) {
      if (Math.abs(mx) < 6 && Math.abs(my) < 6) return;
      if (Math.abs(my) > Math.abs(mx)) { drag.current = null; return; }
      d.locked = true;
      d.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setDragging(true);
    }
    setDx(mx);
  };
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== e.pointerId || !d.moved) return;
    const w = (e.currentTarget as HTMLElement).clientWidth;
    const step = Math.abs(dx) > Math.min(90, w * 0.12) ? (dx < 0 ? 1 : -1) : 0;
    setDragging(false);
    setDx(0);
    // The click that follows a drag must not also jump to the slide under the pointer.
    justDragged.current = true;
    window.setTimeout(() => { justDragged.current = false; }, 0);
    if (step) go(pos + step);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(pos + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(pos - 1); }
  };

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label="BitFest 2025 teams"
      onKeyDown={onKey}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") hover.current = true; }}
      onPointerLeave={() => { hover.current = false; }}
      className="ts-root flex flex-col gap-6"
    >
      <div
        className={`ts-view ${dragging ? "is-drag" : ""}`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <ul className="ts-track" style={{ ["--dx" as string]: `${dx}px` }}>
          {P.map((p, k) => {
            const on = k === i;
            const o = offsetOf(k, i);
            return (
              <li
                key={p.md}
                className="ts-slide"
                style={{ ["--o" as string]: o }}
                data-on={on}
                data-far={Math.abs(o) > NEAR}
                aria-roledescription="slide"
                aria-label={`${k + 1} of ${N}: ${p.caption}`}
                aria-hidden={!on}
                onClick={() => { if (!on && !justDragged.current) go(pos + o); }}
              >
                {loaded.has(k) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.md}
                    srcSet={`${p.sm} 640w, ${p.md} 1080w, ${p.lg} 1600w`}
                    sizes="(max-width: 767px) 88vw, min(68vw, 1000px)"
                    alt={p.caption}
                    draggable={false}
                    loading="eager"
                    fetchPriority="low"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <span aria-hidden className="ts-shade" />
                <span className="lx lx-rim z-[2]" />
                {/* The honour board's title band and the light at its foot (styles: .hof in globals.css). */}
                <span aria-hidden className="hof">
                  <span className="hof-bar"><span className="hof-dot" />Hall of fame<span className="hof-yr">BitFest 2025 · {pad2(k + 1)}</span></span>
                  <span className="hof-glow" />
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Caption and place on the left; the steps on the right. */}
      <div className="ts-caprow mx-auto flex items-center justify-between gap-6 px-6 md:px-0">
        <div className="flex min-w-0 flex-col gap-2">
          <p key={i} aria-live="polite" className="ts-caption truncate text-[17px] font-medium tracking-[-0.01em] text-ink md:text-[19px]">{P[i].caption}</p>
          <div className="flex items-center gap-3">
            <span className="text-[13px] tabular-nums text-muted">{pad2(i + 1)} / {pad2(N)}</span>
            <span aria-hidden className="relative h-[2px] w-24 overflow-hidden rounded-full bg-rim/12 md:w-40">
              <span className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-orange transition-transform duration-700 ease-[cubic-bezier(.2,.75,.2,1)]" style={{ transform: `scaleX(${(i + 1) / N})` }} />
            </span>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              aria-label={d < 0 ? "Previous photo" : "Next photo"}
              onClick={() => go(pos + d)}
              className="ts-step faq-toggle relative grid h-11 w-11 place-items-center rounded-[10px]"
              data-on="false"
            >
              <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" className={d < 0 ? "rotate-180" : ""}>
                <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
