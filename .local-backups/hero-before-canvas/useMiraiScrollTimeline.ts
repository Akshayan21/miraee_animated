"use client";

import { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { journeyStages, type JourneyStageId } from "@/data/miraiExperience";

type Props = {
  root: RefObject<HTMLElement | null>;
  reducedMotion: boolean;
  onStageChange: (stage: JourneyStageId) => void;
};

export function useMiraiScrollTimeline({ root, reducedMotion, onStageChange }: Props) {
  useGSAP(() => {
    const el = root.current;
    if (!el || reducedMotion) return;
    const stageEls = gsap.utils.toArray<HTMLElement>(".journey-stage", el);
    const capabilityCards = gsap.utils.toArray<HTMLElement>(".capability-card", el);
    gsap.set([".mirai-layer", ".interactive-input", ".response-bubble", ".device-shell", ".journey-copy", ".journey-progress"], { autoAlpha: 0 });
    gsap.set(capabilityCards, { autoAlpha: 0, scale: 0.78 });
    gsap.set(stageEls.slice(1), { autoAlpha: 0, y: 56, pointerEvents: "none" });

    const mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.8, invalidateOnRefresh: true },
      });

      timeline
        .addLabel("hero", 0)
        .set(".hero-state", { autoAlpha: 1 }, 0)
        .set(".hero-visual", { autoAlpha: 1 }, 0)
        .to(".hero-visual", { scale: 1.045, duration: 2.2 }, 0)
        .to(".hero-copy", { y: -30, opacity: 0.85, duration: 2.2 }, 0)
        .to(".scroll-cue", { autoAlpha: 0, duration: 0.45 }, 1.72)
        .addLabel("miraiEnter", 2.2)
        .to(".hero-copy", { y: -88, scale: 0.96, autoAlpha: 0, duration: 0.8 }, 2.2)
        .to(".hero-visual", { scale: 1.08, opacity: 0.2, duration: 0.8 }, 2.2)
        .to(".nav-links", { y: -10, autoAlpha: 0, duration: 0.5 }, 2.25)
        .fromTo(".mirai-layer", { y: 110, scale: 0.82, filter: "blur(8px)" }, { y: 0, scale: 1, filter: "blur(0px)", autoAlpha: 1, duration: 0.8 }, 2.28)
        .to(capabilityCards, { autoAlpha: 1, scale: (index) => Number(capabilityCards[index].style.getPropertyValue("--depth")) || 1, duration: 0.7, stagger: 0.06 }, 2.42)
        .fromTo(capabilityCards, { x: (index) => index % 2 ? 46 : -46, y: (index) => index % 3 ? 24 : -30 }, { x: 0, y: 0, duration: 0.75, stagger: 0.05 }, 2.42)
        .to(".interactive-input", { autoAlpha: 1, y: 0, duration: 0.65 }, 2.72)
        .to(".response-bubble", { autoAlpha: 1, duration: 0.45 }, 2.8)
        .to(".hero-state", { autoAlpha: 0, duration: 0.18 }, 2.92)
        .addLabel("interactive", 3)
        .to({}, { duration: 2.2 })
        .addLabel("deviceTransition", 5.2)
        .to(capabilityCards, { autoAlpha: 0, scale: 0.84, x: (index) => index % 2 ? -40 : 40, duration: 0.65, stagger: 0.025 }, 5.2)
        .to(".response-bubble", { autoAlpha: 0, scale: 0.9, duration: 0.35 }, 5.2)
        .to(".interactive-input", { scaleX: 0.48, y: -24, autoAlpha: 0, duration: 0.65 }, 5.3)
        .to(".state-two-wash", { opacity: 0, duration: 0.95 }, 5.25)
        // The shell builds behind the persistent avatar. Mirai never leaves the DOM or fades.
        .fromTo(".device-shell", { x: "0vw", y: "4vh", scale: 1.42, clipPath: "inset(42% 46% 42% 46% round 32px)", opacity: 0 }, { x: "-28vw", y: "2vh", scale: 1, clipPath: "inset(0% 0% 0% 0% round 32px)", autoAlpha: 1, duration: 1 }, 5.28)
        .to(".mirai-layer", { x: "-28vw", y: "-5vh", scale: 0.54, duration: 1 }, 5.28)
        .to(".avatar-name", { autoAlpha: 0, duration: 0.25 }, 5.35)
        .to(".journey-copy", { autoAlpha: 1, x: 0, duration: 0.7 }, 5.72)
        .to(".journey-progress", { autoAlpha: 1, duration: 0.5 }, 5.9)
        .addLabel("plan", 6.2);

      stageEls.forEach((stage, index) => {
        if (index === 0) return;
        const at = 6.2 + index * 0.78;
        timeline
          .to(stageEls[index - 1], { autoAlpha: 0, y: -42, pointerEvents: "none", duration: 0.32 }, at)
          .to(stage, { autoAlpha: 1, y: 0, pointerEvents: "auto", duration: 0.46 }, at + 0.12)
          .call(() => onStageChange(journeyStages[index].id), [], at + 0.18)
          .call(() => onStageChange(journeyStages[index - 1].id), [], at - 0.02);
      });
      timeline.to({}, { duration: 0.8 });
    });

    mm.add("(max-width: 768px)", () => {
      gsap.set([".mirai-layer", ".interactive-input", ".response-bubble", ".device-shell", ".journey-copy", ".journey-progress"], { clearProps: "all" });
      gsap.set(capabilityCards, { clearProps: "all" });
      gsap.set(stageEls, { clearProps: "all" });
    });

    const intro = gsap.timeline();
    intro.from(".site-nav", { y: -12, autoAlpha: 0, duration: 0.7, ease: "power3.out" })
      .from(".hero-copy > *", { y: 24, autoAlpha: 0, duration: 0.85, stagger: 0.1, ease: "power3.out" }, 0.14)
      .from(".hero-visual", { scale: 1.02, autoAlpha: 0, duration: 1.2, ease: "power3.out" }, 0.28);

    ScrollTrigger.refresh();
    return () => mm.revert();
  }, { scope: root, dependencies: [reducedMotion] });
}
