"use client";

import { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";

// Deliberately NOT scroll-jacking (no `pin`, no `position: sticky`, no
// scroll-distance math tied to window.innerHeight). Both of those were
// tried here and broke in ways that couldn't be reproduced or safely
// diagnosed (a sticky+transform bug, then a pin that froze the whole page —
// pinning combined with a smooth-scroll library is a known source of
// feedback loops where the page's height changes while pinned, which
// re-triggers layout, which fights the scroll position).
//
// The "immersive" feel instead comes from two effects that only ever READ
// scroll position, never hold it:
//   1. A one-time reveal as each tile enters the viewport.
//   2. A continuous `scrub` parallax drift (`data-depth`, set per tile in
//      miraiExperience.ts) tied directly to scroll progress — as the user
//      scrolls, tiles drift at different rates, which is what makes a
//      static masonry grid read as an "immersive scroll" section. `scrub`
//      just maps animation progress to scroll position; it never takes
//      control of the scrollbar the way `pin` does, so it can't freeze.
export function useExperiencesTimeline(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const panels = gsap.utils.toArray<HTMLElement>("[data-reveal-panel]", el);
      if (!panels.length) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const revealTriggers = panels.map((panel, i) =>
          gsap.fromTo(
            panel,
            { autoAlpha: 0, y: 60, scale: 0.96 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              delay: (i % 2) * 0.08,
              scrollTrigger: { trigger: panel, start: "top 90%", toggleActions: "play none none reverse" },
            },
          ).scrollTrigger,
        );

        const parallaxTriggers = panels.map((panel) => {
          const depth = Number(panel.dataset.depth ?? 0);
          if (!depth) return undefined;
          return gsap.to(panel.querySelector("[data-parallax-layer]"), {
            yPercent: depth * 18,
            ease: "none",
            scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true },
          }).scrollTrigger;
        });

        return () => {
          revealTriggers.forEach((t) => t?.kill());
          parallaxTriggers.forEach((t) => t?.kill());
        };
      });

      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: root },
  );
}
