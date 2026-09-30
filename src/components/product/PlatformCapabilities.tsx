"use client";

// Content lifted from the reference site's /platform page ("Platform
// capabilities" — one H2, one lede, six items). The reference's own layout
// there is a static bento grid; per direct instruction this rebuilds only
// the CONTENT as an immersive scroll-driven sequence instead: a horizontal
// card track, pushed sideways by ordinary vertical scroll.
//
// Scroll rig: CSS `position: sticky` on a tall section + a GSAP scrub
// timeline (scrub, not once) driving the track's `x` — the same technique
// already used safely elsewhere on this site. GSAP's own `pin` is
// deliberately not used here: ProductHero.tsx documents a past page-freeze
// when `pin` combined with this project's Lenis smooth-scroll.
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { platformCapabilities, platformCapabilitiesIntro } from "@/data/platformCapabilities";
import { CapabilityGlyph } from "./CapabilityGlyph";

export function PlatformCapabilities() {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const el = root.current;
      const track = trackRef.current;
      const cards = cardRefs.current.filter((c): c is HTMLDivElement => !!c);
      const dots = dotRefs.current.filter((d): d is HTMLSpanElement => !!d);
      if (!el || !track || !cards.length) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
        const getMax = () => Math.max(0, track.scrollWidth - window.innerWidth);

        // The outer section's height IS the scroll distance (this rig uses
        // CSS `position: sticky`, not GSAP `pin`, so there's no spacer GSAP
        // can insert for us) — it must equal one viewport of sticky dwell
        // plus however many pixels the track actually needs to travel, or
        // the two rates mismatch and the motion reads as too fast (track
        // wider than the guessed scroll distance) or stalls (narrower).
        const setHeight = () => { el.style.height = `calc(100vh + ${getMax()}px)`; };
        setHeight();

        const tween = gsap.to(track, {
          x: () => -getMax(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1)));
              dots.forEach((dot, i) => {
                dot.style.opacity = i === idx ? "1" : "0.32";
                dot.style.transform = i === idx ? "scale(1.4)" : "scale(1)";
              });
              cards.forEach((card, i) => {
                card.style.opacity = i === idx ? "1" : "0.55";
                card.style.transform = i === idx ? "scale(1)" : "scale(0.96)";
              });
            },
          },
        });

        const resize = () => { setHeight(); ScrollTrigger.refresh(); };
        const observer = new ResizeObserver(resize);
        observer.observe(track);
        window.addEventListener("resize", resize);

        return () => {
          observer.disconnect();
          window.removeEventListener("resize", resize);
          tween.kill();
          el.style.height = "";
        };
      });

      mm.add("(max-width: 768px), (prefers-reduced-motion: reduce)", () => {
        gsap.set(track, { clearProps: "all" });
        cards.forEach((card) => { card.style.opacity = ""; card.style.transform = ""; });
        el.style.height = "";
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section ref={root} className="relative h-[480vh] bg-paper text-ink max-md:h-auto">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden max-md:static max-md:h-auto max-md:overflow-visible max-md:py-[clamp(48px,6vw,88px)]">
        <div
          ref={trackRef}
          className="flex items-center gap-8 pl-[clamp(20px,6vw,96px)] will-change-transform max-md:flex-col max-md:items-stretch max-md:gap-10 max-md:pl-0"
        >
          <div className="w-[min(520px,86vw)] flex-none max-md:w-full">
            <p className="m-0 text-[11px] font-bold uppercase tracking-[.16em] text-brand">{platformCapabilitiesIntro.eyebrow}</p>
            <h2 className="mt-4 mb-0 font-display text-[clamp(34px,4.2vw,58px)] font-bold leading-[1.02] tracking-[-.03em] text-balance">
              {platformCapabilitiesIntro.title}
            </h2>
            <p className="mt-5 max-w-[46ch] text-[clamp(16px,1.3vw,19px)] leading-[1.55] text-muted">{platformCapabilitiesIntro.lede}</p>
          </div>

          {platformCapabilities.map((cap, i) => (
            <div
              key={cap.id}
              ref={(node) => {
                cardRefs.current[i] = node;
              }}
              className="flex min-h-[300px] w-[min(480px,84vw)] flex-none flex-col justify-center rounded-[24px] bg-[color-mix(in_srgb,var(--color-mi-cream)_82%,white)] p-10 shadow-[0_20px_48px_-24px_rgba(15,4,7,.28)] transition-[opacity,transform] duration-300 max-md:w-full max-md:min-h-0 max-md:p-7"
            >
              <span className="grid size-16 place-items-center rounded-[18px] bg-[color-mix(in_srgb,var(--color-brand)_14%,white)] text-brand" aria-hidden="true">
                <CapabilityGlyph icon={cap.icon} className="size-8" />
              </span>
              <p className="mt-6 mb-0 text-[14px] font-bold uppercase tracking-[.1em] text-brand">{cap.label}</p>
              <p className="mt-3 text-[clamp(19px,1.8vw,24px)] leading-[1.4] text-ink">{cap.body}</p>
              {"cta" in cap && cap.cta && (
                <a href={cap.cta.href} className="mt-4 inline-flex items-center gap-1.5 text-base font-bold text-brand no-underline hover:text-brand-strong">
                  {cap.cta.label} <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="absolute right-[clamp(20px,4vw,56px)] bottom-[clamp(20px,4vw,56px)] flex gap-3 max-md:hidden" aria-hidden="true">
          {platformCapabilities.map((cap, i) => (
            <span
              key={cap.id}
              ref={(node) => {
                dotRefs.current[i] = node;
              }}
              className="block size-2 rounded-full bg-brand transition-transform"
              style={{ opacity: 0.32 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
