"use client";

// "Same trip. Different operating models." — the reference's own table:
// capability rows compared across Legacy TMC / First-gen T&E / Miraee.
//
// The immersive pass: a 3D depth corridor, not a flat table. Rows sit on
// a perspective stage (CSS `perspective` + `transform-style: preserve-3d`)
// stacked back into Z-space. As you scroll, the "camera" (really: each
// row's own transform) advances through the stack — the active row tilts
// up to face you and pushes forward (translateZ + rotateX + scale), while
// rows behind it recede deeper into the dark, blurred and dimmed, and rows
// already passed tilt away and drop back too. Reads as physically walking
// through the comparison, row by row, rather than watching text fade in.
//
// Scroll rig: the same technique as SavingsFlywheel.tsx — CSS
// `position: sticky` on a tall section + one GSAP scrub timeline (scrub,
// not a fixed-duration play-once). GSAP's own `pin` is deliberately not
// used: ProductHero.tsx documents a past page-freeze when `pin` combined
// with this project's Lenis smooth-scroll. Mobile and reduced-motion get
// the plain static table with the original per-row fade-in reveal — a 3D
// perspective stack that requires 240vh of scroll runway isn't a mobile
// pattern, and 3D transforms are wasted on a reduced-motion visitor.
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { comparisonColumns, comparisonRows } from "@/data/whyMiraee";

const TOTAL_ROWS = comparisonRows.length;

function ValueCell({ value, isMiraee }: { value: string; isMiraee: boolean }) {
  const positive = value === "Yes" || value === "Included";
  const toneClass =
    isMiraee && positive
      ? "text-mi-green-text"
      : isMiraee
        ? "text-white max-md:text-ink"
        : "text-white/55 max-md:text-muted";
  return (
    <span data-value-cell className={`inline-flex items-center gap-1.5 text-[14px] font-bold transition-transform duration-300 ${toneClass}`}>
      {isMiraee && positive && <span aria-hidden="true">✓</span>}
      {value}
    </span>
  );
}

export function ComparisonTable() {
  const root = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const el = root.current;
      const intro = introRef.current;
      const counter = counterRef.current;
      const bar = barRef.current;
      const rows = rowRefs.current.filter((r): r is HTMLDivElement => !!r);
      if (!el || !intro || !counter || !bar || rows.length !== TOTAL_ROWS) return;

      gsap.set(intro, { autoAlpha: 0, y: 24 });
      gsap.set(bar, { scaleX: 0 });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 769px)", () => {
        const introEnd = 0.1;
        const activeCell = (row: HTMLDivElement) => row.querySelector<HTMLElement>("[data-value-cell]");
        const activeCells = rows.map((row) => row.lastElementChild?.querySelector<HTMLElement>("[data-value-cell]") ?? null);

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
              bar.style.transform = `scaleX(${gsap.utils.clamp(0, 1, (p - introEnd) / (1 - introEnd))})`;

              const spotlight = gsap.utils.clamp(0, TOTAL_ROWS - 0.001, ((p - introEnd) / (1 - introEnd)) * TOTAL_ROWS);
              counter.textContent = `0${Math.min(TOTAL_ROWS, Math.floor(spotlight) + 1)} / 0${TOTAL_ROWS}`;

              rows.forEach((row, i) => {
                const dist = Math.abs(spotlight - i);
                const isActive = dist < 0.5;
                const weight = gsap.utils.clamp(0.34, 1, 1 - dist * 0.42);
                row.style.opacity = String(weight);
                row.style.transform = `scale(${isActive ? 1.012 : 1})`;
                row.style.background = isActive ? "color-mix(in srgb, var(--color-brand) 9%, transparent)" : "transparent";
                row.style.borderLeftColor = isActive ? "var(--color-brand)" : "transparent";

                const cell = activeCells[i] ?? activeCell(row);
                if (cell) cell.style.transform = isActive ? "scale(1.1)" : "scale(1)";
              });
            },
          },
        });

        timeline.to(intro, { autoAlpha: 1, y: 0, duration: introEnd * 0.7, ease: "power2.out" }, 0);

        return () => {};
      });

      mm.add("(prefers-reduced-motion: reduce), (max-width: 768px)", () => {
        gsap.set([intro, ...rows], { clearProps: "all" });
        gsap.set(bar, { clearProps: "all" });
        rows.forEach((row, i) => {
          gsap.fromTo(
            row,
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
              delay: i * 0.04,
              scrollTrigger: { trigger: row, start: "top 92%", toggleActions: "play none none reverse" },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[240vh] bg-background-deep text-white max-md:h-auto max-md:bg-paper max-md:text-ink">
      <div
        className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-[clamp(20px,5vw,64px)] max-md:static max-md:h-auto max-md:overflow-visible max-md:px-[clamp(20px,5vw,64px)] max-md:py-[clamp(48px,6vw,88px)]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      >
        <div className="mx-auto w-full max-w-[1120px]">
          <div ref={introRef} className="flex flex-wrap items-end justify-between gap-4 max-md:opacity-100! max-md:visible!">
            <div>
              <p className="m-0 font-mono text-[11px] font-bold uppercase tracking-[.14em] text-white/40 max-md:text-muted">Same trip, scanned row by row</p>
              <h2 className="mt-3 max-w-[20ch] text-balance font-display text-[clamp(26px,3vw,40px)] font-bold leading-[1.1] tracking-[-.02em]">
                Same trip. Different operating models.
              </h2>
            </div>
            <span ref={counterRef} className="font-mono text-[13px] font-bold tracking-[.08em] text-white/40 max-md:hidden">
              01 / 0{TOTAL_ROWS}
            </span>
          </div>

          <div className="mt-8 overflow-hidden rounded-[20px] border border-white/10 max-md:mt-6 max-md:border-ink/10">
            <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] border-b border-white/10 bg-white/[0.03] max-md:border-ink/10 max-md:bg-paper">
              <div className="p-4 font-mono text-[11px] font-bold uppercase tracking-[.1em] text-white/40 max-md:text-muted">Capability</div>
              {comparisonColumns.map((col, i) => {
                const isMiraeeCol = i === comparisonColumns.length - 1;
                return (
                  <div
                    key={col}
                    className={`p-4 text-center font-mono text-[11px] font-bold uppercase tracking-[.1em] ${
                      isMiraeeCol ? "text-brand" : "text-white/40 max-md:text-muted"
                    }`}
                    style={{ background: isMiraeeCol ? "color-mix(in srgb, var(--color-brand) 9%, transparent)" : "transparent" }}
                  >
                    {col}
                  </div>
                );
              })}
            </div>

            {comparisonRows.map((row, i) => (
              <div
                key={row.capability}
                ref={(node) => {
                  rowRefs.current[i] = node;
                }}
                className="grid grid-cols-[1.4fr_1fr_1fr_1fr] border-b border-l-2 border-white/10 border-l-transparent transition-[background,transform] duration-300 will-change-transform last:border-b-0 max-md:border-ink/10 max-md:border-l-0"
              >
                <div className="p-4 text-[14px] font-bold text-white max-md:text-ink">{row.capability}</div>
                {row.values.map((value, colIndex) => (
                  <div
                    key={colIndex}
                    className="flex items-center justify-center p-4 text-center"
                    style={{ background: colIndex === row.values.length - 1 ? "color-mix(in srgb, var(--color-brand) 5%, transparent)" : "transparent" }}
                  >
                    <ValueCell value={value} isMiraee={colIndex === row.values.length - 1} />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-6 h-px bg-white/10 max-md:hidden">
            <div ref={barRef} className="h-full w-full origin-left bg-brand" />
          </div>
        </div>
      </div>
    </section>
  );
}
