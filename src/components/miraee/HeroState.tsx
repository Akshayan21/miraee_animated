"use client";

import { OrbitCanvas } from "./OrbitCanvas";

export function HeroState() {
  return (
    <div
      className="absolute inset-0 grid place-items-center p-6 bg-white min-[769px]:max-[1024px]:px-[30px] max-md:relative max-md:min-h-[calc(100svh-72px)] max-md:p-[45px_18px] max-md:overflow-hidden motion-reduce:relative motion-reduce:min-h-[100svh]"
      data-gsap="hero-state"
    >
      <div
        className="absolute inset-0 z-1 pointer-events-none [transform-origin:center] [will-change:transform,opacity]"
        data-gsap="hero-visual"
        role="img"
        aria-label="Flights, hotels, ground travel, meetings, finance and expenses revolving around Miraee"
      >
        <OrbitCanvas />
      </div>
      <div
        className="relative z-5 w-[min(900px,66vw)] max-w-[900px] text-center [transform-origin:center] before:content-[''] before:absolute before:-z-1 before:-inset-x-[10%] before:-inset-y-[6%] before:[background:radial-gradient(closest-side,rgba(255,255,255,.92)_55%,rgba(255,255,255,.62)_78%,transparent_100%)] before:pointer-events-none max-md:w-[min(90vw,560px)] max-md:max-w-[560px]"
        data-gsap="hero-copy"
      >
        <p className="mx-auto mt-0 mb-5 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-[color-mix(in_srgb,var(--color-brand)_8%,white)] px-3.5 py-1.5 text-brand text-[12px] font-bold tracking-[.14em] uppercase">
          <span className="size-1.5 rounded-full bg-brand shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-brand)_20%,transparent)]" />
          A private travel assistant for every employee
        </p>
        <h1 className="m-0 font-display font-bold text-[clamp(52px,5.25vw,84px)] leading-[.98] tracking-[-.055em] text-balance max-md:text-[clamp(40px,11vw,58px)] max-md:leading-[1]">
          The travel &amp; expense platform that <span className="text-brand">actually does the work</span>.
        </h1>
        <p className="max-w-[680px] mx-auto mt-7 mb-0 text-muted text-[clamp(16px,1.25vw,20px)] leading-[1.55] text-balance max-md:max-w-[480px] max-md:mt-5 max-md:text-sm">Meet Miraee. State your intent, and our AI agents search, book, pay, coordinate, recover, and file your expenses. Effortless for travelers, strictly controlled for finance, and rewarding for everyone.</p>
        <div className="flex items-center justify-center gap-5 mt-[30px] max-md:flex-col max-md:gap-4">
          <a
            href="#meet-mirai"
            className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-[15px] text-sm font-semibold text-white no-underline shadow-[0_14px_30px_-10px_rgba(15,4,7,.45)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_38px_-10px_rgba(15,4,7,.5)]"
          >
            Meet Miraee
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
          </a>
          <a
            href="#journey"
            className="inline-flex items-center gap-2 rounded-full px-5 py-[15px] text-sm font-semibold text-ink no-underline transition-colors duration-200 hover:text-brand"
          >
            See how it works
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
