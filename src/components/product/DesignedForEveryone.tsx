"use client";

// Content adapted from the reference site's "Designed for everyone" section
// — same headline, photo and three audience cards. Rebuilt a second time
// with a different scroll mechanic (first pass was a simple clip-reveal;
// this is a cinematic zoom instead, so the page doesn't repeat the same
// entrance twice): the photo starts as a framed card beside the headline,
// then scroll expands it to fill the entire screen — the headline fades
// out as it takes over — and once full-bleed, a scrim fades in and the
// three audience cards land on top of it.
//
// Scroll rig: CSS `position: sticky` on a tall section + a GSAP scrub
// timeline (scrub, not once) — same technique used elsewhere on this site.
// GSAP's own `pin` is deliberately not used: ProductHero.tsx documents a
// past page-freeze when `pin` combined with this project's Lenis
// smooth-scroll.
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { designedForEveryoneIntro, travelerAudiences } from "@/data/productAudiences";

export function DesignedForEveryone() {
  const root = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const cardsWrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const el = root.current;
      const eyebrow = eyebrowRef.current;
      const title = titleRef.current;
      const frame = frameRef.current;
      const image = imageRef.current;
      const scrim = scrimRef.current;
      const cardsWrap = cardsWrapRef.current;
      const cards = cardRefs.current.filter((c): c is HTMLDivElement => !!c);
      if (!el || !eyebrow || !title || !frame || !image || !scrim || !cardsWrap || !cards.length) return;

      // Framed-card starting geometry — the photo sits in the right two
      // thirds of the stage, inset from every edge, still rounded.
      gsap.set(frame, { top: "16%", right: "6%", bottom: "16%", left: "46%", borderRadius: 28 });
      gsap.set(image, { scale: 1.15 });
      gsap.set(scrim, { autoAlpha: 0 });
      gsap.set(cardsWrap, { autoAlpha: 0, y: 40 });
      gsap.set([eyebrow, title], { autoAlpha: 0, y: 24 });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 769px)", () => {
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true },
        });

        timeline
          .to([eyebrow, title], { autoAlpha: 1, y: 0, duration: 0.1, stagger: 0.03 }, 0)
          // The photo swallows the whole stage: every inset tweens to 0 and
          // the radius flattens, so a framed card becomes a full-bleed
          // backdrop rather than just scaling up inside its own box.
          .to(frame, { top: 0, right: 0, bottom: 0, left: 0, borderRadius: 0, duration: 0.4, ease: "power2.inOut" }, 0.16)
          .to(image, { scale: 1, duration: 0.4, ease: "power2.inOut" }, 0.16)
          .to([eyebrow, title], { autoAlpha: 0, y: -16, duration: 0.14 }, 0.16)
          .to(scrim, { autoAlpha: 1, duration: 0.12 }, 0.5)
          .to(cardsWrap, { autoAlpha: 1, y: 0, duration: 0.14 }, 0.58)
          .from(cards, { autoAlpha: 0, y: 24, duration: 0.16, stagger: 0.06 }, 0.6);
      });

      mm.add("(prefers-reduced-motion: reduce), (max-width: 768px)", () => {
        gsap.set([eyebrow, title, frame, image, scrim, cardsWrap, ...cards], { clearProps: "all" });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section ref={root} className="relative h-[280vh] bg-background-deep text-white max-md:h-auto">
      <div className="sticky top-0 h-[100svh] overflow-hidden max-md:static max-md:h-auto max-md:overflow-visible max-md:py-[clamp(48px,6vw,88px)]">
        <div className="absolute inset-0 z-10 flex items-center px-[clamp(24px,6vw,96px)] max-md:static max-md:px-0">
          <div className="max-w-[520px]">
            <p ref={eyebrowRef} className="m-0 text-[11px] font-bold uppercase tracking-[.16em] text-white/50">
              {designedForEveryoneIntro.eyebrow}
            </p>
            <h2 ref={titleRef} className="mt-5 mb-0 font-display text-[clamp(38px,4.6vw,64px)] font-bold leading-[1.02] tracking-[-.03em] text-balance">
              {designedForEveryoneIntro.title}
            </h2>
          </div>
        </div>

        <div ref={frameRef} className="absolute overflow-hidden max-md:static max-md:mt-8 max-md:aspect-[16/10] max-md:rounded-[24px]">
          {/* eslint-disable-next-line @next/next/no-img-element -- existing project asset, GSAP-animated */}
          <img
            ref={imageRef}
            src={designedForEveryoneIntro.image}
            alt={designedForEveryoneIntro.imageAlt}
            className="size-full object-cover object-top will-change-transform"
          />
          <div ref={scrimRef} className="absolute inset-0 bg-[linear-gradient(0deg,rgba(15,4,7,.86)_0%,rgba(15,4,7,.25)_42%,transparent_72%)] max-md:hidden" />
        </div>

        <div
          ref={cardsWrapRef}
          className="absolute inset-x-0 bottom-0 z-20 grid grid-cols-3 gap-6 p-[clamp(24px,5vw,64px)] max-md:static max-md:mt-8 max-md:grid-cols-1"
        >
          {travelerAudiences.map((aud, i) => (
            <div
              key={aud.id}
              ref={(node) => {
                cardRefs.current[i] = node;
              }}
              className="rounded-[20px] bg-[color-mix(in_srgb,var(--color-mi-cream)_92%,white)] p-7 text-ink"
            >
              <p className="m-0 text-[13px] font-bold uppercase tracking-[.1em] text-brand">{aud.label}</p>
              <p className="mt-3 mb-0 text-[clamp(15px,1.1vw,17px)] leading-[1.5] text-ink/80">{aud.body}</p>
              <div className="mt-5 border-t border-[rgba(15,4,7,.1)] pt-4">
                <span className="text-[24px] leading-none font-bold text-ink">{aud.statValue}</span>
                <span className="ml-2 text-[11px] font-semibold tracking-[.02em] text-muted uppercase">{aud.statLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
