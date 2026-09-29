"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { MiraiAvatar } from "./MiraiAvatar";

// A light, warm panel — the same ambient gradient + dot-grid texture as the
// hero (src/components/miraee/MiraiScrollExperience.tsx) — deliberately
// breaks the run of dark sections (TravelCardStack, BusinessCaseJourney,
// ExperiencesSection) right before the dark footer. Bookending the page on
// the hero's own tone, instead of one more dark panel, is what makes this
// read as a closing moment rather than another identical section. The
// avatar reappears here for the same reason: she's the one visual through
// -line of the page, so closing on her (instead of a generic stock photo or
// icon) is what makes the panel feel like it belongs to this product rather
// than a template.
export function CtaSection() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const panel = section.current?.querySelector<HTMLElement>("[data-cta-panel]");
      if (!panel) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          panel,
          { autoAlpha: 0, y: 40, scale: 0.98 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: panel, start: "top 82%" } },
        );
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} className="bg-paper py-[clamp(64px,9vw,120px)] text-ink">
      <div className="mx-auto w-[min(1200px,100%-2*clamp(20px,4vw,64px))]">
        <div
          data-cta-panel
          className="invisible relative isolate overflow-hidden rounded-[40px] opacity-0 motion-reduce:visible motion-reduce:opacity-100"
        >
          <div className="absolute inset-0 -z-2" aria-hidden="true">
            <div className="absolute inset-0 bg-[linear-gradient(155deg,var(--color-mi-cream)_0%,color-mix(in_srgb,var(--color-brand)_10%,var(--color-mi-cream))_44%,color-mix(in_srgb,var(--color-brand)_26%,var(--color-mi-cream))_100%)]" />
            <div className="absolute -left-[8%] -top-[30%] h-[80%] w-[42%] rounded-[50%] bg-white/60 blur-3xl" />
            <div className="absolute -right-[10%] -bottom-[32%] h-[95%] w-[52%] rounded-[50%] bg-[color-mix(in_srgb,var(--color-mi-amber)_55%,var(--color-brand))] opacity-55 blur-3xl" />
          </div>
          <div
            className="absolute inset-0 -z-1 opacity-25 [background-image:linear-gradient(rgba(25,20,30,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(25,20,30,.06)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(circle_at_30%_40%,black,transparent_72%)] max-md:hidden"
            aria-hidden="true"
          />

          <div className="relative grid items-center gap-8 p-[clamp(40px,6vw,88px)] lg:grid-cols-[1.25fr_.85fr] lg:gap-4">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-white/50 px-3.5 py-1.5 font-mi-body text-[.68rem] font-bold tracking-[.14em] text-[var(--color-mi-amber-text)]">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand/60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
                </span>
                YOUR AGENT IS READY
              </div>
              <h2 className="mx-auto mt-5 max-w-[16ch] text-balance font-display text-[clamp(34px,5vw,58px)] font-bold leading-[1.03] tracking-[-.03em] lg:mx-0">
                Give your team their time back.
              </h2>
              <p className="mx-auto mt-5 max-w-[42ch] text-pretty text-base leading-[1.6] text-ink/70 sm:text-lg lg:mx-0">
                See how Miraee handles your company&apos;s travel, from booking to expenses.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5 lg:justify-start">
                <a
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-[15px] font-bold text-white no-underline transition-transform duration-150 active:scale-95"
                  href="#journey"
                >
                  Request a Demo
                  <span aria-hidden="true">→</span>
                </a>
                <a
                  className="rounded-full border border-ink/16 px-7 py-3.5 text-[15px] font-bold text-ink no-underline transition-colors duration-200 hover:border-ink/30 hover:bg-white/40"
                  href="#journey"
                >
                  Prove the savings first
                </a>
              </div>
            </div>

            <div className="relative mx-auto h-[240px] w-[200px] sm:h-[300px] sm:w-[240px] lg:mx-0 lg:h-[340px] lg:w-[270px] lg:justify-self-end">
              <MiraiAvatar variant="hero" />
              <div className="absolute -left-6 bottom-8 flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-2 text-xs font-bold text-ink shadow-[0_14px_32px_-10px_rgba(34,25,45,.3)] backdrop-blur-sm max-sm:left-1 max-sm:px-3">
                <span className="size-1.5 rounded-full bg-[#2ecc71]" />
                Always on, day or night
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
