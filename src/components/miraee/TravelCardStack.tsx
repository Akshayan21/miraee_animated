"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";

const cards = [
  {
    eyebrow: "BUILT FOR",
    title: "Travelers",
    subtitle: "A personal executive assistant",
    bullets: [
      "Voice, text and avatar-driven assistant",
      "Calendar-aware, completely hands-free",
      "Auto-rebooks during flight delays",
    ],
    metric: "24/7",
    metricLabel: "Hands-free, always on",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2.5&w=600&h=800&q=80",
    color: "color-mix(in srgb, var(--color-brand) 13%, var(--color-mi-cream))",
    mark: "traveler",
  },
  {
    eyebrow: "BUILT FOR",
    title: "Finance",
    subtitle: "Zero-touch expenses",
    bullets: [
      "Receipts captured and GL-coded automatically",
      "Policy-checked and reconciled without forms",
      "Reports filed by the time you land",
    ],
    metric: "0",
    metricLabel: "Manual expense forms",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=facearea&facepad=2.5&w=600&h=800&q=80",
    color: "color-mix(in srgb, var(--color-mi-rust) 22%, var(--color-mi-cream))",
    mark: "finance",
  },
  {
    eyebrow: "BUILT FOR",
    title: "Travel Admins",
    subtitle: "Stacked savings",
    bullets: [
      "Four contract sources stacked per search",
      "Tabhi wholesale plus your negotiated rates",
      "The best bookable fare always wins",
    ],
    metric: "20–30%",
    metricLabel: "Fare savings, validated",
    image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?auto=format&fit=facearea&facepad=2.5&w=600&h=800&q=80",
    color: "color-mix(in srgb, var(--color-mi-amber) 45%, var(--color-mi-cream))",
    mark: "admin",
  },
  {
    eyebrow: "BUILT FOR",
    title: "HR Teams",
    subtitle: "Proactive duty of care",
    bullets: [
      "Every traveler located by their itinerary",
      "Weather and disruption monitoring per PNR",
      "Managers notified only when it matters",
    ],
    metric: "100%",
    metricLabel: "Travelers located, always",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=facearea&facepad=2.5&w=600&h=800&q=80",
    color: "color-mix(in srgb, var(--color-brand-dark) 14%, var(--color-mi-cream))",
    mark: "care",
  },
] as const;

function CardMark({ type }: { type: (typeof cards)[number]["mark"] }) {
  const iconClass = "h-20 w-20 overflow-visible text-ink";
  const strokeProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "traveler") {
    return (
      <svg viewBox="0 0 80 80" className={iconClass} aria-hidden="true">
        <path {...strokeProps} d="M28 58V32a7 7 0 0 1 7-7h10a7 7 0 0 1 7 7v26" />
        <path {...strokeProps} d="M35 25v-6h10v6M23 58h34M33 58v4M47 58v4" />
        <path {...strokeProps} d="M40 16V5m0 0-4 5m4-5 4 5" />
        <path {...strokeProps} d="m40 5 14 7-14 4-14-4 14-7Z" />
      </svg>
    );
  }
  if (type === "finance") {
    return (
      <svg viewBox="0 0 80 80" className={iconClass} aria-hidden="true">
        <path {...strokeProps} d="M24 13h32v54l-5-4-5 4-6-4-6 4-5-4-5 4V13Z" />
        <path {...strokeProps} d="M32 25h16M32 33h10" />
        <circle {...strokeProps} cx="40" cy="48" r="8" />
        <path {...strokeProps} d="M40 43v10m3-8.5c-1-2-6-2-6 .5s6 1.5 6 4-5 3-6 .5" />
      </svg>
    );
  }
  if (type === "admin") {
    return (
      <svg viewBox="0 0 80 80" className={iconClass} aria-hidden="true">
        <rect {...strokeProps} x="13" y="16" width="54" height="44" rx="2" />
        <path {...strokeProps} d="M13 27h54M27 60v7m26-7v7M22 67h36" />
        <path {...strokeProps} d="M24 39h32M24 49h32" />
        <circle cx="34" cy="39" r="4" fill="var(--card-color)" stroke="currentColor" strokeWidth="2.8" />
        <circle cx="49" cy="49" r="4" fill="var(--card-color)" stroke="currentColor" strokeWidth="2.8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 80" className={iconClass} aria-hidden="true">
      <path {...strokeProps} d="M40 9 62 18v16c0 16-9 28-22 37-13-9-22-21-22-37V18l22-9Z" />
      <path {...strokeProps} d="M40 54S26 46 26 35c0-8 10-11 14-4 4-7 14-4 14 4 0 11-14 19-14 19Z" />
    </svg>
  );
}

export function TravelCardStack() {
  const section = useRef<HTMLElement>(null);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  useGSAP(() => {
    const root = section.current;
    if (!root) return;
    const cardEls = gsap.utils.toArray<HTMLElement>("[data-travel-card]", root);
    const copy = root.querySelector<HTMLElement>("[data-card-copy]");
    const center = (cardEls.length - 1) / 2;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(cardEls, { x: (i) => (i - center) * 280, y: 0, rotation: (i) => (i - center) * 3.6, scale: 1 });
      return;
    }

    const mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
      gsap.set(cardEls, {
        x: (i) => (i - center) * 12,
        y: (i) => 150 + Math.abs(i - center) * 12,
        rotation: (i) => (i - center) * 0.8,
        scale: 0.72,
        transformOrigin: "50% 92%",
      });
      gsap.set(copy, { y: 36, autoAlpha: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.85,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(copy, { y: 0, autoAlpha: 1, duration: 0.18 }, 0)
        .to(cardEls, { y: 0, scale: 0.88, duration: 0.2, stagger: 0.025 }, 0.03)
        .to(cardEls, {
          x: (i) => (i - center) * Math.min(290, Math.max(210, (window.innerWidth - 320) / 3)),
          rotation: (i) => (i - center) * 3.6,
          scale: () => window.innerWidth < 1000 ? 0.78 : 1,
          duration: 0.3,
          stagger: 0.012,
        }, 0.16)
        .to("[data-card-detail]", { y: 0, autoAlpha: 1, duration: 0.18, stagger: 0.02 }, 0.36)
        .to({}, { duration: 0.44 });
    });

    mm.add("(max-width: 768px)", () => {
      gsap.from(cardEls, {
        y: 70,
        rotation: (i) => (i - center) * 2.4,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 72%", toggleActions: "play none none reverse" },
      });
    });

    return () => mm.revert();
  }, { scope: section });

  return (
    <section ref={section} className="relative h-[250svh] bg-[#f6f3ed] max-md:h-auto" aria-labelledby="travel-card-title">
      <div className="sticky top-0 flex h-[100svh] min-h-[720px] flex-col items-center justify-center overflow-hidden px-6 max-md:relative max-md:h-auto max-md:min-h-0 max-md:py-24">
        <div data-card-copy className="absolute top-[12vh] z-10 text-center max-md:relative max-md:top-auto max-md:mb-14">
          <p className="m-0 text-[11px] font-bold tracking-[.17em] text-brand uppercase">ONE PLATFORM, EVERY MOMENT</p>
          <h2 id="travel-card-title" className="mx-auto mt-4 mb-0 max-w-[680px] font-display text-[clamp(40px,4.2vw,64px)] font-bold leading-[.98] tracking-[-.055em] text-ink max-md:text-[42px]">Business travel, moving as one.</h2>
        </div>

        <div className="relative mt-[27vh] h-[430px] w-[260px] max-md:mt-0 max-md:grid max-md:h-auto max-md:w-full max-md:max-w-[380px] max-md:gap-5">
          {cards.map((card, index) => (
            <article
              key={card.title}
              data-travel-card
              tabIndex={0}
              aria-label={`${card.title}: flip card to view portrait`}
              aria-pressed={flippedCard === index}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setFlippedCard((current) => current === index ? null : index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setFlippedCard((current) => current === index ? null : index);
                }
              }}
              className="group absolute inset-0 [perspective:1200px] [will-change:transform] focus:outline-none max-md:relative max-md:inset-auto max-md:min-h-[500px]"
              style={{ zIndex: index + 1, "--card-color": card.color } as React.CSSProperties}
            >
              <div className={`relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus:[transform:rotateY(180deg)] motion-reduce:transition-none max-md:min-h-[500px] ${flippedCard === index ? "[transform:rotateY(180deg)]" : ""}`}>
                <div
                  className="absolute inset-0 flex flex-col border border-ink/10 p-6 shadow-[0_28px_60px_-34px_rgba(31,16,10,.36)] [backface-visibility:hidden] max-md:p-7"
                  style={{ backgroundColor: card.color }}
                >
                  <div className="text-[10px] font-bold tracking-[.15em] text-ink/70">
                    <span>{card.eyebrow}</span>
                  </div>

                  <div className="grid min-h-[96px] flex-1 place-items-center scale-75 max-md:min-h-[150px] max-md:scale-100"><CardMark type={card.mark} /></div>

                  <div data-card-detail className="translate-y-5 opacity-0 max-md:translate-y-0 max-md:opacity-100">
                    <h3 className="m-0 font-display text-[27px] font-bold leading-none tracking-[-.05em] text-ink max-md:text-[40px]">{card.title}</h3>
                    <p className="mt-2 mb-0 text-[11px] font-semibold leading-[1.35] text-ink/80 max-md:text-[14px]">{card.subtitle}</p>
                    <ul className="mt-4 mb-0 space-y-1.5 pl-3.5 text-[9px] leading-[1.35] text-ink/68 marker:text-ink/55 max-md:space-y-2 max-md:text-[12px]">
                      {card.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                    </ul>
                    <div className="mt-4 flex items-end gap-2 border-t border-ink/15 pt-3">
                      <strong className="font-display text-[23px] leading-none tracking-[-.04em] text-ink max-md:text-[30px]">{card.metric}</strong>
                      <span className="pb-0.5 text-[8px] font-medium leading-[1.2] text-ink/62 max-md:text-[10px]">{card.metricLabel}</span>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 overflow-hidden border border-ink/10 bg-ink shadow-[0_28px_60px_-34px_rgba(31,16,10,.5)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <img src={card.image} alt={`${card.title} at work`} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(16,10,12,.9)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white max-md:p-7">
                    <p className="m-0 text-[10px] font-bold tracking-[.15em] text-white/70">{card.eyebrow}</p>
                    <h3 className="mt-2 mb-0 font-display text-[31px] font-bold leading-none tracking-[-.05em]">{card.title}</h3>
                    <p className="mt-2 mb-0 text-[11px] font-medium text-white/78 max-md:text-[14px]">{card.subtitle}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
