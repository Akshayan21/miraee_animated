"use client";

// Content adapted from the reference site's "Savings that compound on
// their own" section — headline/lede, the 4-step loop, and the closing
// 20–30% stat. The reference's own layout there is a static 4-up card row
// then a stat block below.
//
// Fourth pass. First was an SVG progress ring (a "fake data
// visualization" per the audit itself). Second was big centered fading
// typography — reads as 2010s scrollytelling. Third added scroll-velocity
// skew but kept a plain mono digit rail and flat colour, which still read
// generic. This pass is grounded in an actual look at current work
// (Awwwards SOTD studios, v0.dev, thebrowser.company, plus 2026
// trend write-ups on kinetic typography and "broken grid" layouts) rather
// than guessing: near-black ground, one restrained accent, thin-stroke
// seal-style badges instead of a progress dial, a dotted underline accent
// instead of a colour block, and kinetic type — the step stack skews AND
// blurs in proportion to scroll velocity, snapping flat/sharp the instant
// you stop, so the motion is actually driven by how you scroll rather
// than playing a fixed animation curve regardless of input.
//
// Scroll rig: CSS `position: sticky` on a tall section + a GSAP scrub
// timeline (scrub, not once) — same technique used elsewhere on this site.
// GSAP's own `pin` is deliberately not used: ProductHero.tsx documents a
// past page-freeze when `pin` combined with this project's Lenis
// smooth-scroll.
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { savingsLoopIntro, savingsLoopSteps, savingsStat } from "@/data/productSavingsLoop";

const TOTAL_BEATS = savingsLoopSteps.length + 1; // steps, then the stat
const STAT_TARGETS = [20, 30] as const; // parsed from "20–30%", counted up live

export function SavingsFlywheel() {
  const root = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const stageInnerRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const statValueRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const intro = introRef.current;
      const stageInner = stageInnerRef.current;
      const beats = beatRefs.current.filter((b): b is HTMLDivElement => !!b);
      const rail = railRefs.current.filter((r): r is HTMLSpanElement => !!r);
      const bar = barRef.current;
      const statValue = statValueRef.current;
      if (!el || !intro || !stageInner || !bar || !statValue || beats.length !== TOTAL_BEATS || rail.length !== TOTAL_BEATS) return;

      gsap.set(intro, { autoAlpha: 0, y: 24 });
      gsap.set(beats, { autoAlpha: 0, y: 28 });
      gsap.set(beats[0], { autoAlpha: 1, y: 0 });
      gsap.set(bar, { scaleX: 0 });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 769px)", () => {
        const introEnd = 0.08;
        const segLen = (1 - introEnd) / TOTAL_BEATS;
        const statStart = introEnd + (TOTAL_BEATS - 1) * segLen;

        // Scroll-velocity skew: the stack tilts in the direction you're
        // scrolling and relaxes flat shortly after you stop — motion tied
        // to how you scroll, not a fixed animation curve.
        const skewTo = gsap.quickTo(stageInner, "skewY", { duration: 0.5, ease: "power3.out" });
        let lastProgress = 0;
        let lastTime = performance.now();
        let idleTimer: ReturnType<typeof setTimeout>;

        const statCounter = { a: 0, b: 0 };

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              bar.style.transform = `scaleX(${Math.min(1, Math.max(0, (p - introEnd) / (1 - introEnd)))})`;

              const now = performance.now();
              const dt = Math.max(16, now - lastTime);
              const velocity = ((p - lastProgress) / dt) * 1000;
              lastProgress = p;
              lastTime = now;
              skewTo(gsap.utils.clamp(-6, 6, velocity * 0.35));
              stageInner.style.filter = `blur(${Math.min(3, Math.abs(velocity) * 0.12)}px)`;
              clearTimeout(idleTimer);
              idleTimer = setTimeout(() => {
                skewTo(0);
                stageInner.style.filter = "blur(0px)";
              }, 140);

              const idx = p < introEnd ? 0 : Math.min(TOTAL_BEATS - 1, Math.floor((p - introEnd) / segLen));
              rail.forEach((r, i) => {
                const active = i === idx;
                r.style.borderColor = active ? "var(--color-brand)" : "rgba(255,255,255,.2)";
                r.style.background = active ? "var(--color-brand)" : "transparent";
                r.style.color = active ? "var(--color-background-deep)" : "rgba(255,255,255,.4)";
              });
            },
          },
        });

        timeline.to(intro, { autoAlpha: 1, y: 0, duration: 0.05, ease: "power2.out" }, 0);

        beats.forEach((beat, i) => {
          if (i === 0) return;
          const at = introEnd + i * segLen;
          const fade = segLen * 0.22;
          timeline.to(beats[i - 1], { autoAlpha: 0, y: -20, duration: fade, ease: "power1.in" }, at - fade);
          timeline.to(beat, { autoAlpha: 1, y: 0, duration: fade, ease: "power2.out" }, at);
        });

        timeline.to(
          statCounter,
          {
            a: STAT_TARGETS[0],
            b: STAT_TARGETS[1],
            duration: segLen * 0.6,
            onUpdate: () => {
              statValue.textContent = `${Math.round(statCounter.a)}–${Math.round(statCounter.b)}%`;
            },
          },
          statStart,
        );

        return () => clearTimeout(idleTimer);
      });

      mm.add("(prefers-reduced-motion: reduce), (max-width: 768px)", () => {
        gsap.set([intro, stageInner, ...beats], { clearProps: "all" });
        statValue.textContent = savingsStat.value;
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section ref={root} className="relative h-[260vh] bg-background-deep text-white max-md:h-auto">
      <div
        className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-[clamp(24px,6vw,96px)] max-md:static max-md:h-auto max-md:overflow-visible max-md:px-0 max-md:py-[clamp(48px,6vw,88px)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      >
        <div ref={introRef} className="max-w-[640px] max-md:static max-md:mx-[clamp(24px,6vw,96px)]">
          <p className="m-0 font-mono text-[11px] tracking-[.14em] text-white/40 uppercase">Compounding savings</p>
          <h2 className="mt-3 mb-0 font-display text-[clamp(26px,3vw,40px)] font-bold leading-[1.1] tracking-[-.02em] text-balance">
            Savings that{" "}
            <span className="underline decoration-brand decoration-dotted decoration-2 underline-offset-8">compound on their own</span>.
          </h2>
          <p className="mt-3 max-w-[52ch] text-[clamp(14px,1.1vw,16px)] leading-[1.55] text-white/55">{savingsLoopIntro.lede}</p>
        </div>

        <div className="mt-8 grid grid-cols-[40px_1fr] gap-8 max-md:mt-10 max-md:grid-cols-1 max-md:gap-6">
          <div className="flex flex-col gap-5 pt-1 max-md:hidden">
            {Array.from({ length: TOTAL_BEATS }, (_, i) => (
              <span
                key={i}
                ref={(node) => {
                  railRefs.current[i] = node;
                }}
                className="grid size-8 place-items-center rounded-full border font-mono text-[10px] transition-colors duration-300"
                style={{
                  borderColor: i === 0 ? "var(--color-brand)" : "rgba(255,255,255,.2)",
                  background: i === 0 ? "var(--color-brand)" : "transparent",
                  color: i === 0 ? "var(--color-background-deep)" : "rgba(255,255,255,.4)",
                }}
              >
                0{i + 1}
              </span>
            ))}
          </div>

          <div ref={stageInnerRef} className="relative h-[42vh] min-h-[300px] transition-[filter] duration-300 will-change-transform max-md:static max-md:h-auto max-md:min-h-0">
            {savingsLoopSteps.map((step, i) => (
              <div
                key={step.label}
                ref={(node) => {
                  beatRefs.current[i] = node;
                }}
                className="absolute inset-0 flex items-center max-md:relative max-md:mx-[clamp(24px,6vw,96px)] max-md:mb-14 max-md:opacity-100!"
              >
                <div className="max-w-[760px]">
                  <p className="m-0 font-mono text-[12px] tracking-[.1em] uppercase" style={{ color: step.accent }}>
                    {step.label}
                  </p>
                  <p className="mt-3 max-w-[20ch] text-[clamp(30px,4.2vw,54px)] leading-[1.05] font-bold tracking-[-.02em] text-white">{step.body}</p>
                </div>
              </div>
            ))}

            <div
              ref={(node) => {
                beatRefs.current[savingsLoopSteps.length] = node;
              }}
              className="absolute inset-0 flex items-center max-md:relative max-md:mx-[clamp(24px,6vw,96px)] max-md:opacity-100!"
            >
              <div>
                <span ref={statValueRef} className="block font-mono text-[clamp(64px,10vw,150px)] leading-[.88] font-bold tracking-[-.02em] text-brand tabular-nums">
                  0–0%
                </span>
                <p className="mt-4 mb-0 font-display text-[clamp(20px,2vw,28px)] font-bold text-white">{savingsStat.label}</p>
                <p className="mt-4 max-w-[56ch] text-[clamp(15px,1.1vw,17px)] leading-[1.55] text-white/65">{savingsStat.body}</p>
                <p className="mt-3 max-w-[56ch] text-[12px] leading-[1.6] text-white/35">{savingsStat.disclaimer}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 h-px bg-white/10 max-md:hidden">
          <div ref={barRef} className="h-full w-full origin-left bg-brand" />
        </div>
      </div>
    </section>
  );
}
