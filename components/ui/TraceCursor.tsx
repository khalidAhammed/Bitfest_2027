"use client";

import { useEffect, useRef } from "react";

/* Circuit trace cursor: a green dot that leaves a short trail of right-angled lines, like the hero
   pins' traces, fading as it goes. It grows over links and buttons, turns into a thin bar over text
   fields, and becomes a "View" or "Drag" pill over gallery photos and the teams slider. Mouse and
   trackpad only: touch screens and reduced motion keep the normal pointer. The loop runs only while
   the pointer moves or the trail is still fading. */

type Kind = "none" | "link" | "text" | "view" | "drag";
const LABEL: Partial<Record<Kind, string>> = { view: "View", drag: "Drag" };

function kindOf(t: Element | null): Kind {
  if (!t) return "none";
  const tagged = t.closest<HTMLElement>("[data-cursor]");
  if (tagged) return tagged.dataset.cursor as Kind;
  if (t.closest("input:not([type=checkbox]):not([type=radio]):not([type=range]), textarea, [contenteditable=true]")) return "text";
  if (t.closest(".ts-slide[data-on='true']")) return "drag";
  if (t.closest(".ps-tile")) return "view";
  if (t.closest("a, button, [role=button], label, select, summary, .ts-slide")) return "link";
  return "none";
}

export default function TraceCursor() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;
    const cv = canvas.current!, d = dot.current!, p = pill.current!;
    const cx = cv.getContext("2d")!;
    const root = document.documentElement;
    root.classList.add("tc-on");

    let x = -100, y = -100, kind: Kind = "none", shown = false, raf = 0, dpr = 1;
    let lastT: EventTarget | null = null;
    let pts: { x: number; y: number; life: number }[] = [];

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    const setKind = (k: Kind) => {
      if (k === kind) return;
      kind = k;
      d.dataset.k = k;
      const l = LABEL[k];
      p.dataset.on = l ? "true" : "false";
      if (l) p.firstElementChild!.textContent = l;
    };

    const frame = () => {
      raf = 0;
      cx.clearRect(0, 0, innerWidth, innerHeight);
      for (const q of pts) q.life -= 0.05;
      pts = pts.filter((q) => q.life > 0);
      if (kind !== "view" && kind !== "drag") {
        cx.lineWidth = 1.5; cx.lineCap = "round"; cx.lineJoin = "round";
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1], b = pts[i];
          cx.strokeStyle = `rgba(34, 197, 94, ${b.life * 0.65})`;
          cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, a.y); cx.lineTo(b.x, b.y); cx.stroke();
        }
      }
      if (pts.length) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX; y = e.clientY;
      // Move the dot here, not in the next animation frame, so it keeps pace with the real pointer.
      const tf = `translate3d(${x}px, ${y}px, 0)`;
      d.style.transform = tf; p.style.transform = tf;
      const last = pts[pts.length - 1];
      if (!last || Math.abs(last.x - x) + Math.abs(last.y - y) > 6) pts.push({ x, y, life: 1 });
      if (pts.length > 28) pts.shift();
      if (!shown) { shown = true; root.dataset.tc = "on"; }
      // Look up what is under the pointer only when it crosses onto another element.
      if (e.target !== lastT) { lastT = e.target; setKind(kindOf(e.target as Element)); }
      kick();
    };
    // Scrolling moves the page under a still pointer: look again at what it is over.
    // Throttled to one look per frame.
    let looking = 0;
    const onScroll = () => {
      if (!shown || looking) return;
      looking = requestAnimationFrame(() => { looking = 0; lastT = document.elementFromPoint(x, y); setKind(kindOf(lastT as Element | null)); });
    };
    const onLeave = () => { shown = false; root.dataset.tc = "off"; pts = []; kick(); };
    const onDown = () => d.dataset.press = "true";
    const onUp = () => d.dataset.press = "false";

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", size);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf); cancelAnimationFrame(looking);
      root.classList.remove("tc-on");
      delete root.dataset.tc;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", size);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="tc">
      <canvas ref={canvas} className="tc-trail" />
      <div ref={dot} className="tc-dot" data-k="none"><i /></div>
      <div ref={pill} className="tc-pill" data-on="false"><span /></div>
    </div>
  );
}
