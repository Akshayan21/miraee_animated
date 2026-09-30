"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";

type Props = {
  primaryHref?: string;
  secondaryHref?: string;
};

function RoutePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[470px] lg:mr-0">
      <div className="absolute -inset-10 rounded-full bg-[#f05a16]/20 blur-3xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-[26px] border border-white/15 bg-[#fffaf3] p-5 text-[#16090b] shadow-[0_32px_70px_-28px_rgba(0,0,0,.72)] sm:p-6">
        <div className="flex items-center justify-between gap-4 border-b border-[#16090b]/10 pb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#16090b]/45">Your trip</p>
            <p className="mt-1 text-sm font-bold">New York → San Francisco</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#e55602]/10 px-2.5 py-1 text-[10px] font-bold text-[#c74400]">
            <span className="size-1.5 rounded-full bg-[#e55602]" /> In policy
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-7 sm:gap-5">
          <div>
            <p className="text-[30px] font-bold leading-none tracking-[-.04em] sm:text-[36px]">JFK</p>
            <p className="mt-2 text-xs text-[#16090b]/55">08:20 · New York</p>
          </div>
          <div className="flex min-w-16 items-center gap-2 text-[#e55602] sm:min-w-20" aria-hidden="true">
            <span className="h-px flex-1 bg-[#e55602]/35" />
            <svg viewBox="0 0 24 24" className="size-5" fill="none">
              <path d="m3 13 7 1 4.5 6 1.5-.5-2-6 5-2.5c1.5-.7 2-1.8 1.5-2.7-.5-.8-1.7-.9-3.1-.1L12.5 11 7 8l-1.4.7L9 12l-6 .2V13Z" fill="currentColor" />
            </svg>
            <span className="h-px flex-1 bg-[#e55602]/35" />
          </div>
          <div className="text-right">
            <p className="text-[30px] font-bold leading-none tracking-[-.04em] sm:text-[36px]">SFO</p>
            <p className="mt-2 text-xs text-[#16090b]/55">11:42 · San Francisco</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-[16px] bg-[#16090b] px-4 py-3 text-white">
          <div className="flex items-center gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e55602] text-xs font-bold">M</span>
            <div>
              <p className="text-[10px] text-white/55">Miraee checked your policy</p>
              <p className="mt-0.5 text-xs font-semibold">Best compliant route found</p>
            </div>
          </div>
          <span className="hidden text-xs font-bold text-[#ff9b61] sm:block">Ready</span>
        </div>
      </div>

      <div className="absolute -bottom-5 -left-3 hidden items-center gap-2.5 rounded-[14px] border border-white/15 bg-white px-3.5 py-3 text-[#16090b] shadow-[0_18px_44px_-18px_rgba(0,0,0,.65)] sm:flex">
        <span className="grid size-8 place-items-center rounded-full bg-[#e55602]/10 text-[#e55602]">
          <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true">
            <path d="M4 10.5 8 14l8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="text-[10px] font-medium text-[#16090b]/45">Policy applied</p>
          <p className="text-xs font-bold">before booking</p>
        </div>
      </div>
    </div>
  );
}

export function CtaSection({ primaryHref = "#journey", secondaryHref = "#journey" }: Props) {
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
      <div className="mx-auto w-[min(1320px,100%-2*clamp(20px,4vw,64px))]">
        <div
          data-cta-panel
          className="invisible relative isolate overflow-hidden rounded-[28px] bg-[#1b0d0f] px-[clamp(24px,5vw,72px)] py-[clamp(54px,6.5vw,84px)] opacity-0 shadow-[0_32px_80px_-48px_rgba(22,5,8,.75)] motion-reduce:visible motion-reduce:opacity-100"
        >
          <div className="pointer-events-none absolute inset-0 -z-1" aria-hidden="true">
            <div className="absolute inset-0 opacity-[.08] [background-image:linear-gradient(rgba(255,255,255,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.22)_1px,transparent_1px)] [background-size:48px_48px]" />
            <div className="absolute -bottom-44 right-[4%] size-[460px] rounded-full bg-[#e55602]/25 blur-[90px]" />
            <div className="absolute left-[44%] top-0 h-px w-[42%] bg-gradient-to-r from-transparent via-[#ff7a31] to-transparent" />
          </div>

          <div className="relative grid items-center gap-14 lg:grid-cols-[.88fr_1.12fr] lg:gap-[clamp(64px,8vw,120px)]">
            <div className="max-w-[560px] text-center text-white lg:text-left">
              <div className="inline-flex items-center gap-2 font-mi-body text-[.68rem] font-bold tracking-[.16em] text-[#ff9b61]">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#e55602]/60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-[#e55602]" />
                </span>
                YOUR AGENT IS READY
              </div>
              <h2 className="mx-auto mt-5 max-w-[13ch] text-balance font-display text-[clamp(40px,5.2vw,72px)] font-bold leading-[.96] tracking-[-.045em] lg:mx-0">
                Give your team their time back.
              </h2>
              <p className="mx-auto mt-6 max-w-[42ch] text-pretty text-base leading-[1.6] text-white/65 sm:text-lg lg:mx-0">
                See how Miraee handles your company&apos;s travel, from booking to expenses.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-5 lg:justify-start">
                <a
                  className="group inline-flex min-h-14 items-center gap-3 rounded-full bg-[#e55602] px-7 text-[15px] font-bold text-white no-underline shadow-[0_14px_34px_-14px_rgba(229,86,2,.9)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[#f06410] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff9b61] active:translate-y-0"
                  href={primaryHref}
                >
                  Request a Demo
                  <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                </a>
                <a
                  className="text-[15px] font-bold text-white/62 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white"
                  href={secondaryHref}
                >
                  Prove the savings first
                </a>
              </div>
            </div>

            <RoutePreview />
          </div>
        </div>
      </div>
    </section>
  );
}
