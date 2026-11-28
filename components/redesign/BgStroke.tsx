"use client";

import { useEffect, useRef } from "react";

/* Landing page background stroke: one long curve sweeps side to side behind every section below the
   hero, barely visible (SVG, so it stays crisp at any size). A short bright comet glides along it with
   the scroll: its head eases toward where the scroll says it should be, so it trails behind and
   settles slowly rather than jumping. The comet is drawn on a window-sized canvas at the screen's
   pixel density, its tail fading and thinning continuously from the head (no stepped layers), with a
   soft glow under it. The loop runs only while scrolling or while the comet is still moving. Reduced
   motion: no comet, only the faint path. */

const EASE = 0.045; // share of the remaining distance the head covers each frame: lower is slower
const TAIL = 560;   // tail length in px (desktop)
const STEP = 2;     // spacing of the sampled points along the line, px

export default function BgStroke() {
  const box = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = box.current!, s = svg.current!, p = path.current!, cv = cvs.current!;
    const cx = cv.getContext("2d")!;
    const main = host.parentElement!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let len = 0, ys: number[] = [], px: Float32Array = new Float32Array(0), py: Float32Array = new Float32Array(0);
    let raf = 0, head = -1, scale = 1, dpr = 1, settled = false;
    const N = 500;

    const sizeCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr);
      cv.style.width = `${innerWidth}px`; cv.style.height = `${innerHeight}px`;
    };

    const build = () => {
      const w = main.clientWidth, h = main.clientHeight;
      const hero = main.querySelector<HTMLElement>("#hero");
      const top0 = hero ? hero.offsetHeight - 40 : 0;
      const end = h - 60;
      const phone = w < 768;
      scale = phone ? 0.6 : 1;
      // Swings: one per ~900px of page (fewer on phones, where each swing is taller).
      const swings = Math.max(3, Math.round((end - top0) / (phone ? 1100 : 900)));
      const step = (end - top0) / swings;
      const L = w * (phone ? 0.08 : 0.06), R = w * (phone ? 0.92 : 0.94);
      let d = `M ${-w * 0.04} ${top0} C ${w * 0.45} ${top0 + step * 0.05}, ${R + w * 0.04} ${top0 + step * 0.2}, ${R} ${top0 + step * 0.5}`;
      for (let i = 1; i <= swings; i++) {
        const y = top0 + step * (i + 0.5) - (i === swings ? step * 0.5 : 0);
        const x = i === swings ? (i % 2 ? -w * 0.04 : w * 1.04) : i % 2 ? L : R;
        d += ` S ${i % 2 ? L - w * 0.06 : R + w * 0.06} ${y - step * 0.55}, ${x} ${y}`;
      }
      s.setAttribute("viewBox", `0 0 ${w} ${h}`);
      s.setAttribute("width", String(w)); s.setAttribute("height", String(h));
      p.setAttribute("d", d);
      p.setAttribute("stroke", `rgba(34, 197, 94, ${phone ? 0.06 : 0.08})`);
      p.setAttribute("stroke-width", phone ? "1" : "1.25");
      len = p.getTotalLength();
      // Furthest y reached by each slice of the line, so the comet follows the page downward.
      ys = [];
      let m = -Infinity;
      for (let i = 0; i <= N; i++) { m = Math.max(m, p.getPointAtLength((len * i) / N).y); ys.push(m); }
      if (still) return;
      // The line as points every STEP px, for drawing the comet.
      const n = Math.ceil(len / STEP) + 1;
      px = new Float32Array(n); py = new Float32Array(n);
      for (let i = 0; i < n; i++) { const q = p.getPointAtLength(Math.min(len, i * STEP)); px[i] = q.x; py[i] = q.y; }
      sizeCanvas();
      if (head < 0) head = target();
      kick();
    };

    // Where the head belongs: the point on the line level with 72% down the window.
    const target = () => {
      const reveal = window.scrollY + window.innerHeight * 0.72 - (main.getBoundingClientRect().top + window.scrollY);
      if (reveal <= ys[0]) return 0;
      let lo = 0, hi = N;
      while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (ys[mid] <= reveal) lo = mid; else hi = mid - 1; }
      return (len * lo) / N;
    };

    const draw = () => {
      cx.setTransform(1, 0, 0, 1, 0, 0);
      cx.clearRect(0, 0, cv.width, cv.height);
      if (head <= 1 || head >= len - 1 || !px.length) return;
      const top = main.getBoundingClientRect().top;
      cx.setTransform(dpr, 0, 0, dpr, 0, top * dpr);
      // Butt ends: round ends overlap at every joint and stack up into beads.
      cx.lineCap = "butt";
      const hi = Math.min(px.length - 1, Math.floor(head / STEP));
      const tail = Math.round((TAIL * scale) / STEP);
      const lo = Math.max(0, hi - tail);
      // Skip if the whole comet is off screen.
      const vy0 = -top - 40, vy1 = -top + innerHeight + 40;
      let any = false;
      for (let i = lo; i <= hi; i += 8) if (py[i] > vy0 && py[i] < vy1) { any = true; break; }
      if (!any) return;
      // Glow, then the line: short segments whose alpha and width fall off smoothly from the head.
      for (const pass of [0, 1]) {
        for (let i = hi; i > lo; i--) {
          const t = (hi - i) / tail; // 0 at the head, 1 at the tail's end
          const k = Math.pow(1 - t, 1.8);
          if (pass === 0) {
            if (t > 0.45) break;
            cx.strokeStyle = `rgba(34, 197, 94, ${0.05 * Math.pow(1 - t / 0.45, 1.5)})`;
            cx.lineWidth = 14 * scale;
          } else {
            cx.strokeStyle = `rgba(34, 197, 94, ${0.7 * k})`;
            cx.lineWidth = (0.8 + 1.4 * k) * (scale < 1 ? 0.8 : 1);
          }
          cx.beginPath(); cx.moveTo(px[i], py[i]); cx.lineTo(px[i - 1], py[i - 1]); cx.stroke();
        }
      }
    };

    const frame = () => {
      raf = 0;
      const t = target(), dist = t - head;
      head = Math.abs(dist) < 0.5 ? t : head + dist * EASE;
      draw();
      settled = head === t;
      if (!settled) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf && !still) raf = requestAnimationFrame(frame); };
    // On scroll, redraw at once so the comet moves with the page in the same frame (no lag against
    // the faint path), then let the loop ease the head.
    const onScroll = () => { if (still) return; draw(); kick(); };
    const onResize = () => { if (!still) { sizeCanvas(); kick(); } };

    build();
    const ro = new ResizeObserver(() => build());
    ro.observe(main);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <div ref={box} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg ref={svg} fill="none" strokeLinecap="round" className="absolute left-0 top-0">
        <path ref={path} />
      </svg>
      <canvas ref={cvs} className="fixed left-0 top-0" />
    </div>
  );
}
