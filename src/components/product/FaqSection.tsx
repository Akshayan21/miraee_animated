"use client";

// FAQ — closing section of the product page. Reuses this page's own
// established motifs instead of inventing new ones: SavingsFlywheel's dark
// grid ground + mono numbered badges, TabhiAdvantage's scroll-reveal-per-row.
// The "immersive" part is the accordion itself: one question open at a time,
// each answer expanding via a CSS grid-template-rows transition (no layout
// jump, no JS height measurement), plus a restrained ambient glow behind the
// heading matching ProductHero's treatment.
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { faqIntro, faqItems } from "@/data/productFaq";

export function FaqSection() {
  const root = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useGSAP(
    () => {
      const el = root.current;
      const rows = rowRefs.current.filter((r): r is HTMLDivElement => !!r);
      if (!el || rows.length !== faqItems.length) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        rows.forEach((row, i) => {
          gsap.fromTo(
            row,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              delay: (i % 4) * 0.05,
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
    <section
      ref={root}
      className="relative overflow-hidden bg-background-deep py-[clamp(64px,9vw,120px)] text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-1 h-[560px] w-[min(900px,140vw)] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-brand)_16%,transparent),transparent_72%)] blur-[80px]"
        aria-hidden="true"
      />

      <div className="mx-auto w-[min(920px,100%-2*clamp(24px,6vw,96px))]">
        <p className="m-0 font-mono text-[11px] font-bold uppercase tracking-[.16em] text-white/40">{faqIntro.eyebrow}</p>
        <h2 className="mt-3 max-w-[18ch] text-balance font-display text-[clamp(32px,4vw,54px)] font-bold leading-[1.06] tracking-[-.03em]">
          {faqIntro.titlePrefix}
          <span className="underline decoration-brand decoration-dotted decoration-2 underline-offset-8">{faqIntro.titleHighlight}</span>.
        </h2>
        <p className="mt-4 max-w-[62ch] text-[clamp(15px,1.15vw,18px)] leading-[1.55] text-white/55">{faqIntro.lede}</p>

        <div className="mt-[clamp(40px,6vw,64px)] border-t border-white/10">
          {faqItems.map((item, i) => {
            const open = openIndex === i;
            return (
              <div
                key={item.question}
                ref={(node) => {
                  rowRefs.current[i] = node;
                }}
                className="border-b border-white/10"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  aria-controls={`faq-answer-${i}`}
                  className="group flex w-full items-start gap-5 py-6 text-left max-md:gap-4 max-md:py-5"
                >
                  <span
                    className="mt-1 grid size-8 flex-none place-items-center rounded-full border font-mono text-[10px] transition-colors duration-300 max-md:size-7"
                    style={{
                      borderColor: open ? "var(--color-brand)" : "rgba(255,255,255,.2)",
                      background: open ? "var(--color-brand)" : "transparent",
                      color: open ? "var(--color-background-deep)" : "rgba(255,255,255,.4)",
                    }}
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>

                  <span className="flex-1">
                    <span className="block text-[clamp(17px,1.6vw,22px)] font-bold leading-[1.3] tracking-[-.01em] text-white transition-colors duration-200 group-hover:text-brand">
                      {item.question}
                    </span>
                    <span
                      id={`faq-answer-${i}`}
                      className="grid transition-[grid-template-rows] duration-[420ms] ease-[cubic-bezier(.16,1,.3,1)]"
                      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                    >
                      <span className="overflow-hidden">
                        <span className="block max-w-[64ch] pt-3 text-[15px] leading-[1.6] text-white/60">{item.answer}</span>
                      </span>
                    </span>
                  </span>

                  <span
                    className="mt-1.5 flex-none font-mono text-lg leading-none text-white/30 transition-[transform,color] duration-300 group-hover:text-brand"
                    style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
