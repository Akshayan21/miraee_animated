"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";

export function WhyMiraeeProgress() {
  const root = useRef<HTMLDivElement>(null);
  const signal = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const rail = root.current;
      const marker = signal.current;
      const scenes = gsap.utils.toArray<HTMLElement>("[data-why-scene]");
      if (!rail || !marker || scenes.length < 2) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1180px) and (prefers-reduced-motion: no-preference)", () => {
        const setScene = (index: number) => {
          const clamped = gsap.utils.clamp(0, scenes.length - 1, index);
          gsap.to(marker, { y: clamped * 26, duration: 0.5, ease: "power3.out", overwrite: true });
          rail.querySelectorAll<HTMLElement>("[data-scene-dot]").forEach((dot, i) => {
            dot.style.opacity = i === clamped ? "1" : "0.3";
            dot.style.transform = i === clamped ? "scale(1.35)" : "scale(1)";
          });
        };

        scenes.forEach((scene, index) => {
          ScrollTrigger.create({
            trigger: scene,
            start: "top 55%",
            end: "bottom 55%",
            onEnter: () => setScene(index),
            onEnterBack: () => setScene(index),
          });
        });

        gsap.fromTo(rail, { autoAlpha: 0, x: 12 }, {
          autoAlpha: 1,
          x: 0,
          duration: 0.5,
          scrollTrigger: { trigger: scenes[1], start: "top 80%", toggleActions: "play none none reverse" },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="invisible fixed right-5 top-1/2 z-[70] hidden -translate-y-1/2 rounded-full border border-white/10 bg-[#16080b]/82 px-2.5 py-3 opacity-0 shadow-[0_14px_36px_-18px_rgba(0,0,0,.7)] backdrop-blur-xl min-[1180px]:block motion-reduce:hidden"
      aria-hidden="true"
    >
      <span ref={signal} className="absolute left-1/2 top-[14px] size-2.5 -translate-x-1/2 rounded-full bg-[#f25c05] shadow-[0_0_0_4px_rgba(242,92,5,.16),0_0_18px_rgba(242,92,5,.75)]" />
      <div className="flex flex-col items-center gap-[20px]">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} data-scene-dot className="size-1.5 rounded-full bg-white transition-[opacity,transform] duration-300" style={{ opacity: index === 0 ? 1 : 0.3 }} />
        ))}
      </div>
    </div>
  );
}
