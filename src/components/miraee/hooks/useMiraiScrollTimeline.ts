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
    const stageEls = gsap.utils.toArray<HTMLElement>('[data-gsap="journey-stage"]', el);
    const capabilityCards = gsap.utils.toArray<HTMLElement>('[data-gsap="capability-card"]', el);
    gsap.set(['[data-gsap="mirai-layer"]', '[data-gsap="interactive-input"]', '[data-gsap="response-bubble"]', '[data-gsap="quick-requests"]', '[data-gsap="device-shell"]', '[data-gsap="journey-copy"]', '[data-gsap="journey-progress"]'], { autoAlpha: 0 });
    gsap.set(capabilityCards, { autoAlpha: 0, y: 24 });
    gsap.set(stageEls.slice(1), { autoAlpha: 0, y: 56, pointerEvents: "none" });

    const mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 1.2, invalidateOnRefresh: true },
      });

      timeline
        .addLabel("hero", 0)
        .set('[data-gsap="hero-state"]', { autoAlpha: 1 }, 0)
        .set('[data-gsap="hero-visual"]', { autoAlpha: 1 }, 0)
        .to('[data-gsap="hero-visual"]', { scale: 1.045, duration: 2.2 }, 0)
        .to('[data-gsap="hero-copy"]', { y: -30, opacity: 0.85, duration: 2.2 }, 0)
        .addLabel("miraiEnter", 2.2)
        .to('[data-gsap="hero-copy"]', { y: -88, scale: 0.96, autoAlpha: 0, duration: 0.8 }, 2.2)
        // The orbit collapses toward its own optical centre (the shader already
        // draws it there) and hands off directly into Miraee: the two never both
        // sit at full size at once, and there's no gap where neither is visible.
        .set('[data-gsap="hero-visual"]', { transformOrigin: "50% 50%" }, 2.2)
        .to('[data-gsap="hero-visual"]', { scale: 0.08, y: "-4vh", autoAlpha: 0, duration: 0.82, ease: "power2.in" }, 2.2)
        .fromTo(
          '[data-gsap="mirai-layer"]',
          // xPercent: -50 replaces the CSS translate(-50%, ...) the moment GSAP
          // takes over this element's transform (GSAP's inline transform fully
          // replaces the stylesheet's calc()-based one, not merges with it) —
          // without it the avatar snaps to the left edge of its centring offset
          // and the merge point no longer matches the orbit's centre.
          { xPercent: -50, scale: 0.08, y: "-4vh", filter: "blur(10px)", autoAlpha: 0 },
          { xPercent: -50, scale: 1, y: 0, filter: "blur(0px)", autoAlpha: 1, duration: 0.82, ease: "power2.out" },
          2.5,
        )
        .to('[data-gsap="quick-requests"]', { autoAlpha: 1, duration: 0.5 }, 2.9)
        .to(capabilityCards, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06 }, 2.98)
        .to('[data-gsap="interactive-input"]', { autoAlpha: 1, y: 0, duration: 0.65 }, 3.28)
        .to('[data-gsap="response-bubble"]', { autoAlpha: 1, duration: 0.45 }, 3.36)
        .to('[data-gsap="hero-state"]', { autoAlpha: 0, duration: 0.18 }, 3.48)
        .addLabel("interactive", 3.56)
        .to({}, { duration: 1.64 })
        .addLabel("deviceTransition", 5.2)
        .to(capabilityCards, { autoAlpha: 0, y: 16, duration: 0.5, stagger: 0.025 }, 5.2)
        .to('[data-gsap="quick-requests"]', { autoAlpha: 0, duration: 0.4 }, 5.2)
        .to('[data-gsap="response-bubble"]', { autoAlpha: 0, scale: 0.9, duration: 0.35 }, 5.2)
        .to('[data-gsap="interactive-input"]', { scaleX: 0.48, y: -24, autoAlpha: 0, duration: 0.65 }, 5.3)
        .to('[data-gsap="state-two-wash"]', { opacity: 0, duration: 0.95 }, 5.25)
        // The outer avatar hands off to the one rendered inside the phone
        // screen: her scaled/repositioned footprint never actually lines up
        // with the device (independent vw/vh vs. the shell's own transform),
        // so leaving her visible here produced a second, misaligned head
        // floating above the phone instead of a clean layered look. Fading
        // her out as the shell takes over avoids that duplicate entirely.
        .to('[data-gsap="mirai-layer"]', { x: "-28vw", y: "-5vh", scale: 0.54, autoAlpha: 0, duration: 0.85 }, 5.28)
        .fromTo('[data-gsap="device-shell"]', { x: "0vw", y: "4vh", scale: 1.42, clipPath: "inset(42% 46% 42% 46% round 32px)", opacity: 0 }, { x: "-28vw", y: "2vh", scale: 1, clipPath: "inset(0% 0% 0% 0% round 32px)", autoAlpha: 1, duration: 1 }, 5.28)
        .to('[data-gsap="journey-copy"]', { autoAlpha: 1, x: 0, duration: 0.7 }, 5.72)
        .to('[data-gsap="journey-progress"]', { autoAlpha: 1, duration: 0.5 }, 5.9)
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
      gsap.set(['[data-gsap="mirai-layer"]', '[data-gsap="interactive-input"]', '[data-gsap="response-bubble"]', '[data-gsap="quick-requests"]', '[data-gsap="device-shell"]', '[data-gsap="journey-copy"]', '[data-gsap="journey-progress"]'], { clearProps: "all" });
      gsap.set(capabilityCards, { clearProps: "all" });
      gsap.set(stageEls, { clearProps: "all" });
    });

    const intro = gsap.timeline();
    const header = document.querySelector('[data-gsap="site-header"]');
    if (header) intro.from(header, { y: -12, autoAlpha: 0, duration: 0.7, ease: "power3.out" });
    intro.from('[data-gsap="hero-copy"] > *', { autoAlpha: 0, y: 32, duration: 1.5, stagger: 0.15, ease: "power3.out" }, 0.5);

    ScrollTrigger.refresh();
    return () => mm.revert();
  }, { scope: root, dependencies: [reducedMotion] });
}
