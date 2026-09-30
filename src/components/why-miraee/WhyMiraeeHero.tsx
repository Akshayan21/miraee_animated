"use client";

// Centered, same base composition as ProductHero (src/components/product/
// ProductHero.tsx): warm radial glow + converging rays behind a centered
// headline. Difference from the first pass: that glow was copied at
// ProductHero's exact (subtle) intensity, but ProductHero has a pill-input
// and a mockup window doing most of the visual work below it — this hero
// has nothing else, so the same subtlety read as "plain, empty page" once
// the one-shot chip animation finished and nothing was left moving. Fixed
// two ways, not by adding more one-shot motion:
//   1. The glow itself now carries the three fragment accent colors
//      (blue/green/brand — same three ConnectedSystems already uses for
//      Identity/Finance/Work) as a permanent soft blend, not just a single
//      brand-orange wash, plus a slow, ambient scale-breathe — content
//      information (three systems merging into one) made into a
//      persistent background instead of a page that goes dark and quiet
//      the moment the chips are gone.
//   2. The chip fragmentation → convergence itself loops (chips scatter
//      back out and fly in again every ~4s) instead of playing once on
//      landing and leaving a plain static pill for the rest of the visit.
// The headline also gets the same colored-phrase-in-copy treatment already
// used elsewhere on this site (SavingsFlywheel's dotted underline
// highlight) instead of sitting as flat, undifferentiated black type.
//
// The immersive layer on top of that shared pattern is still the lede made
// literal: "Booking in one tool, policy in another, expense in a third"
// becomes three scattered chips that fly in and get absorbed into the "one
// system" tag pill below the lede — the fragmentation the copy describes
// actually resolves on screen. Positions are measured with
// getBoundingClientRect at runtime (not hand-tuned SVG coordinates), so the
// convergence lands exactly on the pill at any viewport width.
//
// As the reader scrolls past the hero into the comparison table, the glow
// parts slightly via a scrubbed ScrollTrigger. No GSAP `pin` anywhere,
// same safe rig as every other section on this site.
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { whyMiraeeHero, whyMiraeeHeroFragments } from "@/data/whyMiraee";

const FRAGMENT_COUNT = whyMiraeeHeroFragments.length;

// Scattered starting offsets (px, relative to each chip's own docked spot)
// and a slight rotation, so they read as "coming from different places"
// rather than sliding in from one direction.
const START_OFFSETS = [
  { x: -100, y: -50, rotate: -10 },
  { x: 110, y: -34, rotate: 8 },
  { x: 60, y: 70, rotate: -6 },
] as const;

export function WhyMiraeeHero() {
  const root = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const el = root.current;
      const tag = tagRef.current;
      const glow = glowRef.current;
      const chips = chipRefs.current.filter((c): c is HTMLDivElement => !!c);
      if (!el || !tag || !glow || chips.length !== FRAGMENT_COUNT) return;

      const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
      const blobs = blobRefs.current.filter((b): b is HTMLDivElement => !!b);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Ambient breathing glow — always on, not tied to scroll or the
        // one-shot chip animation, so the hero never settles into a flat,
        // motionless page once the convergence finishes.
        blobs.forEach((blob, i) => {
          gsap.to(blob, {
            scale: 1.15,
            opacity: 0.85,
            duration: 5 + i * 0.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.4,
          });
        });
      });

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 900px)", () => {
        gsap.fromTo(targets, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 });

        const tagRect = tag.getBoundingClientRect();
        const tagCenter = { x: tagRect.left + tagRect.width / 2, y: tagRect.top + tagRect.height / 2 };

        // Fragmentation → convergence is a loop, not a one-time landing
        // moment: every ~4s the three chips scatter back out and fly in
        // again, so a visitor who glances away for a second still catches
        // it instead of only ever seeing the plain settled pill. The
        // convergence deltas (each chip's docked position relative to the
        // tag) are measured once — the layout doesn't change between
        // loops — then replayed every pass via `tl.set` at the top of the
        // timeline, which GSAP re-runs automatically on every `repeat`.
        const deltas = chips.map((chip) => {
          const rect = chip.getBoundingClientRect();
          const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          return { x: tagCenter.x - center.x, y: tagCenter.y - center.y };
        });

        const tl = gsap.timeline({ delay: 0.5, repeat: -1, repeatDelay: 2.4 });
        chips.forEach((chip, i) => {
          const toTag = deltas[i];
          const start = START_OFFSETS[i];

          tl.set(chip, { x: start.x, y: start.y, rotate: start.rotate, autoAlpha: 0, scale: 0.9 }, i * 0.16);
          tl.to(chip, { autoAlpha: 1, x: 0, y: 0, rotate: 0, scale: 1, duration: 0.55, ease: "back.out(1.6)" }, i * 0.16);
          tl.to(chip, { x: toTag.x, y: toTag.y, scale: 0.35, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, `>+=0.5`);
        });
        tl.to(tag, { scale: 1.08, duration: 0.16, ease: "power2.out" }, "-=0.08");
        tl.to(tag, { scale: 1, duration: 0.3, ease: "elastic.out(1,0.5)" });
        tl.fromTo(
          tag,
          { boxShadow: "0 0 0 0 color-mix(in srgb, var(--color-brand) 0%, transparent)" },
          { boxShadow: "0 0 0 10px color-mix(in srgb, var(--color-brand) 0%, transparent)", duration: 0.6, ease: "power1.out" },
          "<",
        );

        gsap.to(glow, {
          yPercent: 14,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      });

      mm.add("(prefers-reduced-motion: reduce), (max-width: 899px)", () => {
        gsap.set(targets, { autoAlpha: 1, clearProps: "transform" });
        gsap.set(chips, { clearProps: "all", autoAlpha: 1 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate overflow-hidden bg-white px-6 pt-[clamp(144px,15vw,192px)] pb-[clamp(72px,8vw,112px)] text-center text-ink sm:px-10 lg:px-16">
      {/* Warm radial glow + converging rays — same treatment as
          ProductHero's hero, redone centered on this headline instead of
          reinventing a different ambient background for this page. */}
      <div ref={glowRef} className="pointer-events-none absolute left-1/2 top-[-80px] -z-1 h-[560px] w-[min(1200px,160vw)] -translate-x-1/2" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 620px 420px at 50% 8%, color-mix(in srgb, var(--color-brand) 20%, white) 0%, color-mix(in srgb, var(--color-brand) 8%, white) 38%, white 72%)",
          }}
        />
        {/* Permanent, softly breathing blend of the same three fragment
            accents (blue/policy-green/brand) — the "three systems merging
            into one" idea kept alive in the background even after the
            chips themselves have flown in and vanished. */}
        {whyMiraeeHeroFragments.map((fragment, i) => (
          <div
            key={fragment.label}
            ref={(node) => {
              blobRefs.current[i] = node;
            }}
            className="absolute h-[320px] w-[320px] rounded-full opacity-45 blur-[70px]"
            style={{
              top: i === 0 ? "-18%" : i === 1 ? "-10%" : "-2%",
              left: i === 0 ? "6%" : i === 1 ? "62%" : "38%",
              background: `radial-gradient(circle, color-mix(in srgb, ${fragment.accent} 55%, transparent) 0%, transparent 68%)`,
            }}
          />
        ))}
        <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 1200 500" preserveAspectRatio="none">
          {Array.from({ length: 13 }).map((_, i) => {
            const angle = -60 + i * 10;
            const rad = (angle * Math.PI) / 180;
            const x2 = 600 + Math.sin(rad) * 700;
            const y2 = 40 + Math.cos(rad) * 700;
            return <line key={i} x1="600" y1="40" x2={x2} y2={y2} stroke="color-mix(in srgb, var(--color-brand) 32%, white)" strokeWidth="1" />;
          })}
        </svg>
        <span className="absolute size-1.5 rounded-full" style={{ top: "22%", left: "22%", background: "color-mix(in srgb, var(--color-mi-blue-text) 60%, white)" }} />
        <span className="absolute size-1.5 rounded-full" style={{ top: "12%", left: "68%", background: "color-mix(in srgb, var(--color-mi-green-text) 60%, white)" }} />
        <span className="absolute size-1.5 rounded-full" style={{ top: "34%", left: "78%", background: "color-mix(in srgb, var(--color-brand) 60%, white)" }} />
        <span className="absolute size-1.5 rounded-full" style={{ top: "40%", left: "12%", background: "color-mix(in srgb, var(--color-brand) 55%, white)" }} />
      </div>

      <div className="relative mx-auto w-full max-w-[1160px]">
        {/* Fragmented chips: docked in their natural positions flanking
            the centered column, so on mobile/reduced-motion (no
            convergence animation) they still read as a sensible static
            trio around the headline. */}
        {whyMiraeeHeroFragments.map((fragment, i) => (
          <div
            key={fragment.label}
            ref={(node) => {
              chipRefs.current[i] = node;
            }}
            className="pointer-events-none absolute z-0 max-md:hidden"
            style={{
              top: i === 0 ? "8%" : i === 1 ? "4%" : "48%",
              left: i === 0 ? "4%" : i === 2 ? "10%" : undefined,
              right: i === 1 ? "3%" : undefined,
            }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border bg-white/80 px-3.5 py-2 text-[12.5px] font-bold whitespace-nowrap shadow-[0_10px_24px_-14px_rgba(21,11,8,.3)] backdrop-blur-sm"
              style={{ borderColor: `color-mix(in srgb, ${fragment.accent} 40%, transparent)`, color: fragment.accent }}
            >
              <span className="size-1.5 rounded-full" style={{ background: fragment.accent }} />
              {fragment.label}
              <span className="font-normal text-ink/40">{fragment.sub}</span>
            </span>
          </div>
        ))}

        <div className="relative z-[1] mx-auto max-w-[880px]">
          <p data-reveal className="invisible m-0 text-[11px] font-bold uppercase tracking-[.16em] text-brand motion-reduce:visible">
            {whyMiraeeHero.eyebrow}
          </p>
          <h1
            data-reveal
            className="invisible mx-auto mt-6 mb-0 max-w-[22ch] text-balance font-display text-[clamp(36px,4.8vw,68px)] font-bold leading-[1.14] tracking-[-.025em] motion-reduce:visible sm:mt-7"
          >
            Your travel program needs a{" "}
            <span className="block"><span className="text-brand underline decoration-brand/50 decoration-dotted decoration-2 underline-offset-8">unified framework</span>.</span>
          </h1>
          <p data-reveal className="invisible mx-auto mt-7 mb-0 max-w-[52ch] text-pretty text-[clamp(16px,1.3vw,20px)] leading-[1.7] text-muted motion-reduce:visible sm:mt-8">
            {whyMiraeeHero.lede}
          </p>
          <div
            ref={tagRef}
            data-reveal
            className="invisible relative z-10 mx-auto mt-8 inline-flex w-fit max-w-full items-center justify-center gap-2 rounded-full border border-ink/12 bg-white/80 px-5 py-3 font-mono text-[12px] leading-relaxed font-bold text-ink motion-reduce:visible sm:mt-10 sm:px-6 sm:text-[13px]"
          >
            {whyMiraeeHero.tag}
          </div>
        </div>
      </div>
    </section>
  );
}
