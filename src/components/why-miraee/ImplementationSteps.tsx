"use client";

// "Live in weeks, not quarters." — 4-step rollout (Policy/Connect/Pilot/
// Roll out). Was a vertical rail list; rebuilt as a horizontal-scroll card
// track — the exact same rig as PlatformCapabilities.tsx on the Product
// page (vertical scroll drives a GSAP-scrubbed `x` on a flex row, active
// card at full scale/opacity, neighbours dimmed, dot rail tracks
// position). Reusing that proven rig rather than inventing a new one:
// same product, same site, same motif. Scroll distance is computed from
// the track's real pixel width (not a guessed vh value) — a fixed-vh
// guess is what made an earlier horizontal section on this site feel too
// fast/compressed.
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { implementationIntro, implementationSteps } from "@/data/whyMiraee";

export function ImplementationSteps() {
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

        // This section uses CSS `position: sticky`, not GSAP `pin` — no
        // spacer GSAP can insert for us — so the outer section's height IS
        // the scroll distance and must equal one viewport of sticky dwell
        // plus however many pixels the track actually needs to travel.
        const setHeight = () => { el.style.height = `calc(100vh + ${getMax()}px)`; };
        setHeight();

        const tween = gsap.to(track, {
          x: () => -getMax(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1)));
              dots.forEach((dot, i) => {
                dot.style.opacity = i === idx ? "1" : "0.32";
                dot.style.transform = i === idx ? "scale(1.4)" : "scale(1)";
              });
              cards.forEach((card, i) => {
                card.style.opacity = i === idx ? "1" : "0.5";
                card.style.transform = i === idx ? "scale(1)" : "scale(0.96)";
                card.style.borderLeftColor = i === idx ? "var(--color-brand)" : "transparent";
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
        cards.forEach((card) => {
          card.style.opacity = "";
          card.style.transform = "";
          card.style.borderLeftColor = "var(--color-brand)";
        });
        el.style.height = "";
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section ref={root} className="relative bg-paper text-ink max-md:h-auto">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden max-md:static max-md:h-auto max-md:overflow-visible max-md:py-[clamp(48px,6vw,88px)]">
        <div
          ref={trackRef}
          className="flex items-center gap-8 pl-[clamp(20px,6vw,96px)] will-change-transform max-md:flex-col max-md:items-stretch max-md:gap-8 max-md:pl-0"
        >
          <div className="w-[min(480px,86vw)] flex-none max-md:mx-[clamp(20px,6vw,96px)] max-md:w-auto">
            <p className="m-0 text-[11px] font-bold uppercase tracking-[.16em] text-muted">{implementationIntro.eyebrow}</p>
            <h2 className="mt-5 mb-0 text-balance font-display text-[clamp(34px,4.2vw,58px)] font-bold leading-[1.02] tracking-[-.03em]">
              {implementationIntro.title}
            </h2>
            <p className="mt-4 max-w-[46ch] text-[clamp(15px,1.15vw,18px)] leading-[1.55] text-muted">{implementationIntro.lede}</p>
          </div>

          {implementationSteps.map((step, i) => (
            <div
              key={step.index}
              ref={(node) => {
                cardRefs.current[i] = node;
              }}
              className="min-h-[280px] w-[min(440px,84vw)] flex-none border-l-2 bg-[color-mix(in_srgb,var(--color-mi-cream)_82%,white)] p-9 shadow-[0_20px_48px_-24px_rgba(15,4,7,.16)] transition-[opacity,transform,border-color] duration-300 max-md:mx-[clamp(20px,6vw,96px)] max-md:w-auto max-md:min-h-0"
              style={{ borderLeftColor: i === 0 ? "var(--color-brand)" : "transparent" }}
            >
              <span className="font-mono text-[13px] font-bold text-brand">{step.index}</span>
              <h3 className="mt-3 mb-0 font-display text-[clamp(20px,2vw,26px)] font-bold tracking-[-.01em]">{step.label}</h3>
              <p className="mt-3 max-w-[40ch] text-[15px] leading-[1.55] text-ink/75">{step.body}</p>
              <p className="mt-6 font-mono text-[12px] font-bold whitespace-nowrap text-ink/45">Who: {step.who}</p>
            </div>
          ))}
        </div>

        <div className="absolute right-[clamp(20px,4vw,56px)] bottom-[clamp(20px,4vw,56px)] flex gap-3 max-md:hidden" aria-hidden="true">
          {implementationSteps.map((step, i) => (
            <span
              key={step.index}
              ref={(node) => {
                dotRefs.current[i] = node;
              }}
              className="block size-2 rounded-full bg-brand transition-transform"
              style={{ opacity: i === 0 ? 1 : 0.32 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
