"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Lenis smooth scrolling driven by GSAP's ticker, plus global [data-reveal] fade-ups.
    The glide is a long exponential ease-out (Apple-like); touch scrolling stays native. In-page links
    and links that arrive with a #hash glide to their section; each section's scroll-margin keeps it
    clear of the fixed nav (Lenis honours scroll-margin). */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    let raf: ((t: number) => void) | null = null;
    if (!reduce) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
        syncTouch: false,
      });
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      raf = (t: number) => lenis!.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    // Anchor links go through Lenis so they glide instead of jump.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!a || !lenis) return;
      const url = new URL(a.href, location.href);
      // Same page with a #hash (written as "#x" or "/#x" while on "/"): glide instead of jumping.
      if (url.pathname !== location.pathname || !url.hash || url.hash.length < 2) return;
      const el = document.querySelector(url.hash);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement);
      history.replaceState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);
    if (location.hash.length > 1) {
      const target = document.querySelector(location.hash);
      if (target) window.setTimeout(() => {
        if (lenis) lenis.scrollTo(target as HTMLElement, { immediate: true });
        else (target as HTMLElement).scrollIntoView();
      }, 60);
    }

    const ctx = gsap.context(() => {
      if (reduce) return;
      // Reveals start as soon as a block's top enters the window (plus a little ahead), and are short:
      // a long, late, staggered fade made sections look as if they were still loading.
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 102%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: { each: 0.03, amount: Math.min(0.18, els.length * 0.03) } }),
      });
    });

    return () => {
      document.removeEventListener("click", onClick);
      ctx.revert();
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
    };
  }, []);

  return null;
}
