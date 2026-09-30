"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";

const metrics = [
  { value: "20–30%", label: "Travel savings, compared like for like", index: "01" },
  { value: "100%", label: "Of the journey managed by the agent", index: "02" },
  { value: "1", label: "Platform for business and personal travel", index: "03" },
] as const;

export function BusinessCaseJourney() {
  const section = useRef<HTMLElement>(null);

  useGSAP(() => {
    const root = section.current;
    if (!root) return;
    const track = root.querySelector<HTMLElement>("[data-business-track]");
    const image = root.querySelector<HTMLElement>("[data-business-image]");
    const platformImage = root.querySelector<HTMLElement>("[data-business-platform-image]");
    const panels = gsap.utils.toArray<HTMLElement>("[data-business-panel]", root);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!track || reduced) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
      gsap.set(panels.slice(1).map((panel) => panel.querySelector("[data-business-copy]")), { x: 90, autoAlpha: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(track, { x: () => -3 * window.innerWidth, duration: 3 }, 0)
        .to(image, { xPercent: 24, scale: 1.08, duration: 1 }, 0)
        .fromTo(platformImage, { xPercent: 18, scale: 1.08 }, { xPercent: 0, scale: 1, duration: 0.75, ease: "power2.out" }, 2.65)
        .to(panels[0].querySelector("[data-business-copy]"), { x: -80, autoAlpha: 0.2, duration: 0.6 }, 0.35);

      panels.slice(1).forEach((panel, index) => {
        const copy = panel.querySelector("[data-business-copy]");
        const value = panel.querySelector("[data-business-value]");
        const at = index + 0.7;
        timeline
          .fromTo(copy, { x: 90, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.35, ease: "power3.out" }, at)
          .fromTo(value, { scale: 0.72, xPercent: 12 }, { scale: 1, xPercent: 0, duration: 0.45, ease: "power3.out" }, at);
      });
    });

    mm.add("(max-width: 768px)", () => {
      gsap.from("[data-business-copy]", {
        y: 65,
        autoAlpha: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 75%", toggleActions: "play none none reverse" },
      });
    });

    return () => mm.revert();
  }, { scope: section });

  return (
    <section ref={section} id="business-case" className="relative h-[420svh] bg-[#f5f1eb] text-ink max-md:h-auto" aria-labelledby="business-case-title">
      <div className="sticky top-0 h-[100svh] min-h-[680px] overflow-hidden max-md:relative max-md:h-auto max-md:min-h-0">
        <div data-business-track className="flex h-full w-[400vw] max-md:block max-md:w-full">
          <article data-business-panel className="relative h-full w-screen flex-none overflow-hidden px-[5vw] pt-[12vh] pb-[10vh] max-md:min-h-[100svh] max-md:px-5 max-md:pt-24 max-md:pb-20">
            <div className="absolute inset-0 opacity-50 [background:radial-gradient(circle_at_76%_35%,rgba(229,86,2,.12),transparent_28%)]" />
            <div data-business-copy className="relative z-10 flex h-full flex-col justify-between">
              <p className="m-0 text-[11px] font-bold uppercase tracking-[.2em] text-[#756a68]">The business case</p>
              <h2 id="business-case-title" className="m-0 max-w-[11ch] font-display text-[clamp(54px,6vw,96px)] font-bold leading-[.91] tracking-[-.07em] text-balance max-md:text-[52px]">
                Loved by employees.<br /><span className="text-[#817572]">Trusted by finance.</span>
              </h2>
              <div className="flex items-end justify-between gap-8 max-md:block">
                <span className="block h-px w-28 bg-brand" />
              </div>
            </div>

            <div className="absolute right-[4vw] top-[13vh] h-[68vh] w-[52vw] max-md:relative max-md:right-auto max-md:top-auto max-md:mt-14 max-md:h-[48vh] max-md:w-full">
              <div className="absolute -inset-5 translate-x-5 translate-y-5 border border-brand/25" />
              <div className="absolute inset-0 overflow-hidden bg-[#d9cec2] shadow-[0_36px_90px_-42px_rgba(69,14,20,.42)]">
                <img
                  data-business-image
                  src="/product/business-case-us-team-v2.png"
                  alt="Three U.S. business travelers moving through an airport lounge together"
                  className="h-full w-full object-cover object-center [will-change:transform]"
                />
              </div>
            </div>
          </article>

          {metrics.map((metric, index) => (
            <article
              key={metric.value}
              data-business-panel
              className={`relative h-full w-screen flex-none overflow-hidden px-[7vw] py-[11vh] max-md:min-h-[100svh] max-md:px-5 max-md:py-24 ${index === 1 ? "bg-[#1b0c0f] text-[#f5f1eb]" : index === 2 ? "bg-[#e9e1d7]" : "bg-[#f5f1eb]"}`}
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-[#201013]/10" />

              {index === 1 && (
                <svg className="pointer-events-none absolute right-[3vw] top-1/2 h-[76vh] w-[48vw] -translate-y-1/2 opacity-55" viewBox="0 0 700 700" fill="none" aria-hidden="true">
                  <path d="M54 568C164 558 153 390 286 374C418 358 399 168 628 123" stroke="#e55602" strokeWidth="2" strokeDasharray="7 12" />
                  <circle cx="54" cy="568" r="8" fill="#1b0c0f" stroke="#e55602" strokeWidth="2" />
                  <circle cx="286" cy="374" r="8" fill="#1b0c0f" stroke="#e55602" strokeWidth="2" />
                  <circle cx="628" cy="123" r="8" fill="#1b0c0f" stroke="#e55602" strokeWidth="2" />
                </svg>
              )}

              {index === 2 && (
                <div className="absolute right-[5vw] top-[23vh] h-[54vh] w-[48vw] max-w-[780px] max-md:relative max-md:right-auto max-md:top-auto max-md:mt-12 max-md:h-[42vh] max-md:w-full">
                  <div className="absolute -inset-4 translate-x-4 translate-y-4 border border-brand/25" aria-hidden="true" />
                  <div className="absolute inset-0 overflow-hidden bg-[#d7c8b7] shadow-[0_36px_90px_-42px_rgba(69,14,20,.46)]">
                    <img
                      data-business-platform-image
                      src="/product/business-personal-us-traveler-v3.png"
                      alt="A U.S. business traveler extending her work trip into a coastal stay"
                      className="h-full w-full object-cover object-center [will-change:transform]"
                    />
                  </div>
                </div>
              )}

              <div data-business-copy className={`relative z-10 flex h-full flex-col justify-between [will-change:transform,opacity] ${index === 2 ? "w-[43vw] max-md:w-full" : ""}`}>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] tracking-[.16em] text-brand">{metric.index}</span>
                  <span className="h-px w-14 bg-brand" />
                  <span className={`text-[10px] font-bold uppercase tracking-[.18em] ${index === 1 ? "text-[#a99a97]" : "text-[#756a68]"}`}>The business case</span>
                </div>

                <div className={`${index === 1 ? "ml-[12vw]" : ""} max-md:ml-0 max-md:block`}>
                  <strong
                    data-business-value
                    className={`block origin-left font-display font-bold leading-[.74] [font-variant-numeric:tabular-nums] [will-change:transform] max-md:text-[38vw] ${index === 0 ? "text-[clamp(120px,18vw,300px)] tracking-[-.025em] text-[#d74200]" : index === 1 ? "text-[clamp(150px,23vw,360px)] tracking-[-.075em] text-[#f5f1eb]" : "text-[clamp(170px,22vw,340px)] tracking-[-.06em] text-[#d74200]"}`}
                  >
                    {metric.value}
                  </strong>
                  <h3 className="mb-0 mt-[8vh] max-w-[17ch] font-display text-[clamp(34px,4vw,64px)] font-bold leading-[1.02] tracking-[-.045em] text-balance max-md:mt-12 max-md:text-[40px]">{metric.label}</h3>
                </div>

                {index === metrics.length - 1 ? (
                  <p className="m-0 max-w-[70ch] text-[13px] leading-[1.6] text-[#756a68]">
                    Savings depend on routes, availability and your travel mix.{" "}
                    <a href="https://miraee-final.vercel.app/pricing" className="font-semibold text-ink underline decoration-brand underline-offset-4">See how we compare fares.</a>
                  </p>
                ) : <span aria-hidden="true" />}
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
