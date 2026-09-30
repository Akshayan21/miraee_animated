"use client";

// Content matches the supplied reference exactly: eyebrow, headline, lede,
// then a 4-row list (Identity/People/Finance/Work) with a systems list,
// description and status pill, closing on a developer-sandbox link.
//
// Unlike SavingsFlywheel/PlatformCapabilities, the reference here shows all
// four rows at once (a plain scannable list), so this does NOT use the
// crossfade-one-beat-at-a-time pattern — hiding three of four rows behind a
// crossfade would contradict the reference's own layout.
//
// Fixed a real layout bug from the first pass: the row grid declared only 4
// explicit columns (`[64px_1fr_1fr_auto]`) for 5 children (index, label,
// systems, body, pill) — CSS grid auto-flow wrapped the 5th item onto an
// implicit new row, which is why the status pill was landing under the
// index number instead of at the row's end. Now 5 explicit columns.
//
// Second pass on the "immersive" layer, since a plain filling line read as
// flat: the rail is now a travelling dot (not just a growing bar) whose
// position is driven by scroll progress, and the row currently level with
// the dot gets a live accent — its index colours in, a left border lights
// up in that row's own status colour, and a large ghost numeral fades up
// behind it (the same oversized-numeral motif already used two sections
// up in SavingsFlywheel, so it reads as a deliberate callback rather than
// a new decorative idea). All of this is driven by one scrub'd
// ScrollTrigger — no pin anywhere, same safe rig as the rest of this page.
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { connectedSystemsIntro, connectedSystemsRows, connectedSystemsLink } from "@/data/productConnectedSystems";

const ROW_COUNT = connectedSystemsRows.length;

export function ConnectedSystems() {
  const root = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const railDotRef = useRef<HTMLDivElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numeralRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const el = root.current;
      const list = listRef.current;
      const railDot = railDotRef.current;
      const railFill = railFillRef.current;
      const rows = rowRefs.current.filter((r): r is HTMLDivElement => !!r);
      const numerals = numeralRefs.current.filter((n): n is HTMLSpanElement => !!n);
      if (!el || !list || !railDot || !railFill || rows.length !== ROW_COUNT || numerals.length !== ROW_COUNT) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(railFill, { scaleY: 0 });
        gsap.set(railDot, { top: 0 });

        gsap.to([railFill, railDot], {
          scrollTrigger: {
            trigger: list,
            start: "top 55%",
            end: "bottom 55%",
            scrub: 0.5,
            onUpdate: (self) => {
              const p = self.progress;
              const listHeight = list.offsetHeight;
              railFill.style.transform = `scaleY(${p})`;
              railDot.style.top = `${p * listHeight}px`;

              const idx = Math.min(ROW_COUNT - 1, Math.floor(p * ROW_COUNT));
              rows.forEach((row, i) => {
                const active = i === idx;
                row.style.borderLeftColor = active ? connectedSystemsRows[i].accent : "transparent";
                row.style.backgroundColor = active ? `color-mix(in srgb, ${connectedSystemsRows[i].accent} 5%, transparent)` : "transparent";
              });
              numerals.forEach((numeral, i) => {
                numeral.style.opacity = i === idx ? "1" : "0";
              });
            },
          },
        });

        rows.forEach((row, i) => {
          gsap.fromTo(
            row,
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", delay: i * 0.05, scrollTrigger: { trigger: row, start: "top 85%", toggleActions: "play none none reverse" } },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-paper pt-[clamp(64px,9vw,120px)] pb-[clamp(28px,3.5vw,48px)] text-ink">
      <div className="mx-auto w-[min(1120px,100%-2*clamp(24px,6vw,96px))]">
        <p className="m-0 text-[11px] font-bold uppercase tracking-[.16em] text-muted">{connectedSystemsIntro.eyebrow}</p>
        <h2 className="mt-5 max-w-[18ch] text-balance font-display text-[clamp(34px,4.2vw,58px)] font-bold leading-[1.02] tracking-[-.03em]">
          {connectedSystemsIntro.title}
        </h2>
        <p className="mt-4 max-w-[52ch] text-[clamp(15px,1.15vw,18px)] leading-[1.55] text-muted">{connectedSystemsIntro.lede}</p>

        <div ref={listRef} className="relative mt-[clamp(40px,6vw,64px)] border-t border-ink/10 pl-8 max-md:pl-6">
          {/* Progress rail: a filled trail plus a travelling dot marking
              exactly how far through the list the reader is — not a
              decorative line, it's what drives the active-row highlight
              below via the same scroll progress. */}
          <div className="absolute top-0 bottom-0 left-0 w-px bg-ink/10" aria-hidden="true">
            <div ref={railFillRef} className="h-full w-full origin-top bg-brand" />
          </div>
          <div ref={railDotRef} className="absolute left-0 z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_0_4px_var(--color-paper)]" aria-hidden="true" />

          {connectedSystemsRows.map((row, i) => (
            <div
              key={row.index}
              ref={(node) => {
                rowRefs.current[i] = node;
              }}
              className="relative grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-2 overflow-hidden border-b border-ink/10 border-l-2 py-8 pl-4 transition-colors duration-300 sm:grid-cols-[48px_130px_1fr_1.3fr_auto] sm:items-center sm:gap-x-8"
              style={{ borderLeftColor: "transparent" }}
            >
              {/* Large ghost numeral — fades up only while this row is the
                  one level with the rail dot, echoing SavingsFlywheel's
                  oversized-index motif instead of inventing a new one. */}
              <span
                ref={(node) => {
                  numeralRefs.current[i] = node;
                }}
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 font-display text-[clamp(64px,8vw,120px)] leading-none font-bold opacity-0 transition-opacity duration-500 max-md:hidden"
                style={{ color: `color-mix(in srgb, ${row.accent} 10%, transparent)` }}
              >
                {row.index}
              </span>

              <span className="relative font-mono text-[13px] font-bold" style={{ color: row.accent }}>
                {row.index}
              </span>
              <h3 className="relative m-0 font-display text-[clamp(19px,1.8vw,24px)] font-bold tracking-[-.01em]">{row.label}</h3>
              <p className="relative col-span-2 m-0 text-[15px] leading-[1.5] text-ink/70 sm:col-span-1">{row.systems}</p>
              <p className="relative col-span-2 m-0 max-w-[46ch] text-[15px] leading-[1.55] text-muted sm:col-span-1">{row.body}</p>
              <span
                className="relative col-span-2 mt-1 inline-flex w-fit items-center rounded-full border px-3.5 py-1.5 text-[12.5px] font-bold whitespace-nowrap sm:col-span-1 sm:mt-0 sm:justify-self-end"
                style={{ borderColor: `color-mix(in srgb, ${row.accent} 45%, transparent)`, color: row.accent }}
              >
                {row.pill}
              </span>
            </div>
          ))}
        </div>

        <a
          href={connectedSystemsLink.href}
          className="mt-[clamp(28px,4vw,40px)] inline-flex items-center gap-2 border-b border-brand/40 pb-0.5 text-[15px] font-bold text-brand no-underline transition-colors duration-200 hover:border-brand hover:text-brand-strong"
        >
          {connectedSystemsLink.label}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
