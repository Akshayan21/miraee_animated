"use client";

// "The Tabhi advantage" — headline/lede, a supporting editorial photo, a
// 4-stat row, and a closing two-tone statement.
//
// Design correction from the first two passes: both put a big, dramatic
// (eventually pinned-zoom) photo front and center, with the actual
// substance — real supply numbers (2M+ hotels, 500+ airlines, 125M+
// travelers, 10M+ experiences) — reduced to small type below it. That's
// backwards, and it's *why* the section read as hollow no matter how much
// motion got added to the photo: a generic travel photo has no connection
// to "wholesale contracts" or "Mondee One", so amplifying it with a zoom
// just amplified an empty asset. Every other section on this page leads
// with real product evidence (screenshots, real numbers); this was the one
// outlier leaning on decoration instead. Fix: the photo is now a
// supporting banner (smaller, quieter), and the stats are the dominant,
// large-type moment — the same oversized-numeral hierarchy SavingsFlywheel
// and ConnectedSystems already established elsewhere on this page.
//
// The "immersive" layer now serves the real content:
//   - A progress rail under the stat row fills as you scroll through it,
//     and the stat currently level with it is full-strength while the
//     others dim — same "scroll position drives an active-item highlight"
//     technique already used in ConnectedSystems, not a new pattern.
//   - Each stat still counts up from 0 on reveal (SavingsFlywheel's
//     technique).
//   - The photo keeps a modest, scrubbed parallax + one-time reveal —
//     present, but no longer the main event.
// No `position: sticky` pin-zoom this time, no GSAP `pin` anywhere.
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { tabhiAdvantageIntro, tabhiAdvantageImage, tabhiAdvantageStats, tabhiAdvantageClosing } from "@/data/productTabhiAdvantage";

const STAT_COUNT = tabhiAdvantageStats.length;

export function TabhiAdvantage() {
  const root = useRef<HTMLElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const imageLayerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const imageFrame = imageFrameRef.current;
      const imageLayer = imageLayerRef.current;
      const grid = gridRef.current;
      const railFill = railFillRef.current;
      const stats = statRefs.current.filter((s): s is HTMLDivElement => !!s);
      const values = valueRefs.current.filter((v): v is HTMLSpanElement => !!v);
      if (!imageFrame || !imageLayer || !grid || !railFill || stats.length !== STAT_COUNT || values.length !== STAT_COUNT) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Photo: present, quiet — a one-time reveal plus a light parallax,
        // not the dominant moment anymore.
        gsap.fromTo(
          imageFrame,
          { autoAlpha: 0, y: 30, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: imageFrame, start: "top 88%" } },
        );
        gsap.set(imageLayer, { yPercent: -6 });
        gsap.to(imageLayer, {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: imageFrame, start: "top bottom", end: "bottom top", scrub: 0.6 },
        });

        // The stat row is the real moment: a progress rail fills across it
        // and whichever stat is level with the fill is full-strength while
        // the rest sit at reduced opacity — attention follows the number
        // currently "in focus", not a static grid where everything competes
        // for attention equally.
        gsap.set(railFill, { scaleX: 0 });
        gsap.to(railFill, {
          scrollTrigger: {
            trigger: grid,
            start: "top 65%",
            end: "bottom 65%",
            scrub: 0.5,
            onUpdate: (self) => {
              const p = self.progress;
              railFill.style.transform = `scaleX(${p})`;
              const idx = Math.min(STAT_COUNT - 1, Math.floor(p * STAT_COUNT));
              stats.forEach((stat, i) => {
                stat.style.opacity = i === idx ? "1" : "0.4";
              });
            },
          },
        });

        stats.forEach((stat, i) => {
          gsap.fromTo(
            stat,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              delay: i * 0.06,
              scrollTrigger: {
                trigger: stat,
                start: "top 88%",
                toggleActions: "play none none reverse",
                onEnter: () => {
                  const counter = { n: 0 };
                  gsap.to(counter, {
                    n: tabhiAdvantageStats[i].target,
                    duration: 1.1,
                    ease: "power2.out",
                    onUpdate: () => {
                      values[i].textContent = `${Math.round(counter.n)}${tabhiAdvantageStats[i].suffix}`;
                    },
                  });
                },
              },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-paper pt-[clamp(28px,3.5vw,48px)] pb-[clamp(64px,9vw,120px)] text-ink">
      <div className="mx-auto w-[min(1280px,100%-2*clamp(24px,6vw,96px))]">
        <p className="m-0 text-[11px] font-bold uppercase tracking-[.16em] text-muted">{tabhiAdvantageIntro.eyebrow}</p>
        <h2 className="mt-5 max-w-[20ch] text-balance font-display text-[clamp(34px,4.2vw,58px)] font-bold leading-[1.02] tracking-[-.03em]">
          {tabhiAdvantageIntro.title}
        </h2>
        <p className="mt-4 max-w-[62ch] text-[clamp(15px,1.15vw,18px)] leading-[1.55] text-muted">{tabhiAdvantageIntro.lede}</p>

        {/* Supporting banner, not the hero — wide/short (21:9) so it reads
            as context for the numbers below, not competing with them. */}
        <div ref={imageFrameRef} className="relative mt-[clamp(32px,5vw,48px)] aspect-[21/9] overflow-hidden rounded-[20px] max-md:aspect-[16/10]">
          <div ref={imageLayerRef} className="absolute inset-[-8%]">
            {/* eslint-disable-next-line @next/next/no-img-element -- licensed Unsplash hotlink, matches sourcing used elsewhere on this site */}
            <img src={tabhiAdvantageImage.src} alt={tabhiAdvantageImage.alt} className="size-full object-cover" />
          </div>
        </div>

        {/* The dominant moment: large numerals lead each stat, not the
            small type the first pass buried them in. */}
        <div className="relative mt-[clamp(48px,7vw,80px)] border-t border-ink/10 pt-3">
          <div className="absolute top-0 left-0 h-px w-full bg-ink/10" aria-hidden="true">
            <div ref={railFillRef} className="h-full w-full origin-left bg-brand" />
          </div>

          <div ref={gridRef} className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {tabhiAdvantageStats.map((stat, i) => (
              <div
                key={stat.index}
                ref={(node) => {
                  statRefs.current[i] = node;
                }}
                className="transition-opacity duration-300"
              >
                <span
                  ref={(node) => {
                    valueRefs.current[i] = node;
                  }}
                  className="block font-display text-[clamp(40px,4.6vw,64px)] leading-[1] font-bold tracking-[-.03em] text-ink"
                >
                  0{stat.suffix}
                </span>
                <p className="mt-4 m-0 font-mono text-[11px] font-bold tracking-[.12em] text-brand uppercase">
                  {stat.index} {stat.label}
                </p>
                <p className="mt-2 max-w-[32ch] text-[14px] leading-[1.5] text-muted">{stat.body}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-[clamp(48px,6vw,72px)] max-w-[24ch] text-balance font-display text-[clamp(24px,2.6vw,36px)] font-bold leading-[1.25] tracking-[-.01em]">
          {tabhiAdvantageClosing.prefix}
          <span className="text-brand">{tabhiAdvantageClosing.highlight}</span>
        </p>
      </div>
    </section>
  );
}
