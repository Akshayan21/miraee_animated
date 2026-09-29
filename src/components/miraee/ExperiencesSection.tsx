"use client";

import { useRef } from "react";
import { experienceGallery, experienceHighlights } from "@/data/miraiExperience";
import { useExperiencesTimeline } from "./hooks/useExperiencesTimeline";

export function ExperiencesSection() {
  const gallery = useRef<HTMLDivElement>(null);
  useExperiencesTimeline(gallery);

  return (
    <section className="bg-background-deep py-[clamp(72px,10vw,140px)] pb-[clamp(48px,7vw,88px)] text-white">
      <div className="mx-auto w-[min(1360px,100%-2*clamp(20px,4vw,64px))]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 font-mi-body text-[.72rem] font-bold tracking-[.14em] text-white/45">EXPERIENCES</div>
            <h2 className="mt-5 max-w-[24ch] text-balance font-display text-[clamp(30px,3.6vw,48px)] font-semibold leading-[1.05] tracking-[-.03em]">
              Business travel, meet the trips people love.
            </h2>
          </div>
          <div className="flex items-center gap-2.5 font-mi-body text-[.7rem] font-bold tracking-[.14em] text-white/45">
            SCROLL TO EXPLORE
            <i className="block h-0.5 w-7 bg-gradient-to-r from-brand to-[var(--color-mi-amber)]" />
          </div>
        </div>

        <div className="mt-[clamp(32px,4vw,56px)] grid grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))] items-start gap-6">
          <div className="rounded-[32px] border border-brand/35 bg-[linear-gradient(140deg,rgba(242,92,5,.14),rgba(17,14,9,0)_72%)] p-7">
            <div className="font-mi-body text-[.62rem] font-bold tracking-[.14em] text-[var(--color-mi-amber-text)]">ONE TAP AWAY</div>
            <p className="mt-4 text-pretty text-base leading-[1.6] text-white/80">
              Not bookable anywhere else. The city after hours, a detour worth taking, a weekend bolted onto the trip — request it in the same conversation as the flight.
            </p>
          </div>
          <div className="grid grid-cols-1 self-stretch border-t border-white/14 sm:grid-cols-3">
            {experienceHighlights.map((item, i) => (
              <div key={item.label} className={`py-6 px-4 first:pl-0 ${i < experienceHighlights.length - 1 ? "border-r border-white/14" : ""}`}>
                <b className="block font-display text-[clamp(1.4rem,2.2vw,1.9rem)] leading-tight font-bold tracking-[-.02em] text-brand">{item.label}</b>
                <span className="mt-2.5 block text-[13px] leading-[1.5] text-white/70">{item.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CSS multi-column masonry, not a grid with row-spans — a grid
            forces every item in a row to share that row's track height, so
            mixing a wide 4:3 tile with a tall 3:4.4 tile in the same row
            left unfillable gaps (the dead space this was rebuilt to fix).
            Columns instead let each tile keep its own height and stack
            top-down per column, so nothing is ever forced to match a
            neighbour's size. "Immersive scroll" comes from two effects that
            only ever READ scroll position, never hold it: a one-time reveal
            as each tile enters view, and a continuous per-tile parallax
            drift (`data-depth`, scaled up here so it's clearly visible) —
            see useExperiencesTimeline. No pin/sticky/scroll-jack, so there's
            no way for this to hold or freeze the page's scroll. */}
        <div ref={gallery} className="mt-[clamp(48px,6vw,80px)] columns-2 gap-3.5 sm:gap-4 lg:columns-3">
          {experienceGallery.map((item) => (
            <figure
              key={item.caption}
              data-reveal-panel
              data-depth={item.depth}
              className={`relative mb-3.5 break-inside-avoid overflow-hidden rounded-[24px] border border-white/12 bg-white/4 sm:mb-4 ${item.aspect}`}
            >
              <div data-parallax-layer className="absolute inset-[-20%]">
                {/* eslint-disable-next-line @next/next/no-img-element -- hotlinked Unsplash source, no local optimization needed */}
                <img src={item.image} alt={item.caption} loading="lazy" className="size-full object-cover" />
              </div>
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <figcaption className="pointer-events-none absolute right-4 bottom-5 left-4 font-display text-[clamp(15px,1.6vw,20px)] font-bold leading-[1.15] tracking-[-.02em] text-white">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
