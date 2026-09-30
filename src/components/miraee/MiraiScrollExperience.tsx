"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { quickRequests, journeyStages, type JourneyStageId } from "@/data/miraiExperience";
import { ScrollTrigger, gsap } from "@/lib/motion/gsap";
import { HeroState } from "./HeroState";
import { MiraiAvatar } from "./MiraiAvatar";
import { QuickRequestCard } from "./QuickRequestCard";
import { MiraiInput, SparkleIcon, sendMessage } from "./MiraiInput";
import { MiraiDevice } from "./MiraiDevice";
import { JourneyStage } from "./JourneyStage";
import { JourneyProgress } from "./JourneyProgress";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useMiraiScrollTimeline } from "./hooks/useMiraiScrollTimeline";
import { usePointerParallax } from "./hooks/usePointerParallax";
import { TravelCardStack } from "./TravelCardStack";
import { BusinessCaseJourney } from "./BusinessCaseJourney";
import { ExperiencesSection } from "./ExperiencesSection";
import { CtaSection } from "./CtaSection";

export function MiraiScrollExperience() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("Where would you like to go?");
  const [activeStage, setActiveStage] = useState<JourneyStageId>("plan");

  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({ duration: 1.4, smoothWheel: true, wheelMultiplier: 0.7 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, [reducedMotion]);

  useMiraiScrollTimeline({ root, reducedMotion, onStageChange: setActiveStage });
  usePointerParallax(stage, !reducedMotion);

  async function selectCapability(name: string) {
    const prompt = `How can Miraee help with ${name}?`;
    setQuestion(prompt);
    setResponse(await sendMessage(prompt));
  }

  return (
    <main>
      <section className="relative h-[1150vh] min-h-[7800px] bg-paper max-md:h-auto max-md:min-h-0 motion-reduce:h-auto motion-reduce:min-h-0" ref={root} id="meet-mirai">
        <div className="sticky top-0 h-[100svh] min-h-[680px] overflow-hidden isolate bg-paper max-md:relative max-md:h-auto max-md:min-h-0 max-md:overflow-hidden motion-reduce:relative motion-reduce:h-auto motion-reduce:min-h-0 motion-reduce:overflow-visible" ref={stage}>
          <div className="absolute inset-0 -z-3 opacity-20 [background-image:linear-gradient(rgba(25,20,30,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(25,20,30,.055)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)] max-md:hidden" aria-hidden="true" />
          <div
            className="absolute inset-0 -z-2 opacity-100 [background:radial-gradient(circle_at_50%_52%,color-mix(in_srgb,var(--color-brand)_8%,white)_0,color-mix(in_srgb,var(--color-brand)_5%,white)_38%,color-mix(in_srgb,var(--color-brand-dark)_12%,white)_100%)] max-md:hidden"
            data-gsap="state-two-wash"
            aria-hidden="true"
          />

          <HeroState />

          <div className="absolute inset-0 max-md:relative max-md:min-h-[1100px] max-md:pt-[100px] motion-reduce:relative motion-reduce:min-h-[100svh]">
            {/* Full-bleed ambient environment behind her — a soft, brand-toned
                lounge glow (arches of light, a faint travel mark) instead of
                a flat wash, so the whole frame feels like one lit scene
                rather than a card floating on the page background. */}
            <div className="absolute inset-0 -z-1 overflow-hidden" aria-hidden="true">
              <div className="absolute inset-0 bg-[linear-gradient(165deg,var(--color-mi-cream)_0%,color-mix(in_srgb,var(--color-brand)_7%,var(--color-mi-cream))_46%,color-mix(in_srgb,var(--color-brand)_16%,var(--color-mi-cream))_100%)]" />
              <div className="absolute -left-[12%] -top-[18%] h-[70%] w-[45%] rounded-[50%] bg-white/55 blur-3xl" />
              <div className="absolute -right-[16%] -bottom-[22%] h-[85%] w-[55%] rounded-[50%] bg-[color-mix(in_srgb,var(--color-brand)_20%,white)] opacity-60 blur-3xl" />
            </div>

            <div
              className="invisible absolute z-[12] left-1/2 top-[4%] w-[min(30vw,420px)] h-[60vh] min-h-[400px] opacity-0 [--pointer-x:0] [--pointer-y:0] translate-x-[calc(-50%+var(--pointer-x)*1px)] translate-y-[calc(var(--pointer-y)*1px)] [transform-origin:center_28%] [will-change:transform,filter,opacity] max-md:top-[86px] max-md:w-[70vw] max-md:h-[44vh] max-md:min-h-0 max-md:visible max-md:opacity-100 max-md:translate-x-[-50%] max-md:translate-y-0 motion-reduce:visible! motion-reduce:opacity-100!"
              data-gsap="mirai-layer"
            >
              <MiraiAvatar variant="hero" />
            </div>

            <div
              className="invisible absolute z-[14] left-[calc(50%+min(12vw,165px))] top-[24%] flex w-[min(280px,28vw)] items-start gap-2.5 rounded-[6px_20px_20px_20px] bg-white p-4 text-[15px] leading-[1.4] text-ink opacity-0 shadow-[0_20px_48px_-12px_rgba(34,25,45,.28)] before:content-[''] before:absolute before:-left-1.5 before:top-5 before:size-3 before:rotate-45 before:bg-white before:shadow-[-2px_2px_4px_-2px_rgba(34,25,45,.15)] max-md:hidden motion-reduce:visible! motion-reduce:opacity-100!"
              data-gsap="response-bubble"
              aria-live="polite"
            >
              <SparkleIcon className="mt-0.5 size-4 flex-none text-brand" />
              <span>{response}</span>
            </div>

            <div
              className="invisible absolute z-[18] bottom-[26%] left-1/2 w-[min(680px,86vw)] -translate-x-1/2 translate-y-[24px] opacity-0 [transform-origin:center] max-md:bottom-[240px] max-md:w-[calc(100%-36px)] max-md:visible max-md:opacity-100 motion-reduce:visible! motion-reduce:opacity-100!"
              data-gsap="interactive-input"
            >
              <MiraiInput value={question} onChange={setQuestion} onResponse={setResponse} />
            </div>

            <div
              className="invisible absolute z-[8] bottom-[4%] left-1/2 w-[min(980px,92vw)] -translate-x-1/2 opacity-0 max-md:relative max-md:left-auto max-md:bottom-auto max-md:mt-6 max-md:w-full max-md:visible max-md:translate-x-0 max-md:opacity-100 motion-reduce:visible! motion-reduce:opacity-100!"
              data-gsap="quick-requests"
            >
              <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[.16em] text-muted">Or explore common requests</p>
              <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2 max-md:gap-2.5">
                {quickRequests.map((item) => <QuickRequestCard key={item.name} {...item} onSelect={selectCapability} />)}
              </div>
            </div>
          </div>

          <div
            className="absolute inset-0 pointer-events-none max-md:relative max-md:flex max-md:flex-col max-md:gap-[50px] max-md:py-20 max-md:px-5 max-md:bg-paper max-md:pointer-events-auto motion-reduce:relative motion-reduce:min-h-0 motion-reduce:py-20 motion-reduce:px-[5vw] motion-reduce:grid motion-reduce:grid-cols-[.8fr_1.2fr] motion-reduce:gap-[6vw]"
            id="journey"
          >
            <MiraiDevice activeStage={activeStage} />
            <div
              className="invisible absolute z-[9] top-[18%] left-[47%] w-[min(42vw,610px)] h-[68vh] translate-x-[50px] opacity-0 pointer-events-auto min-[769px]:max-[1024px]:left-[48%] min-[769px]:max-[1024px]:w-[43vw] max-md:relative max-md:left-auto max-md:top-auto max-md:w-full max-md:h-auto max-md:translate-x-0 max-md:visible max-md:opacity-100 motion-reduce:relative motion-reduce:top-auto motion-reduce:left-auto motion-reduce:w-auto motion-reduce:h-auto motion-reduce:translate-x-0 motion-reduce:visible! motion-reduce:opacity-100!"
              data-gsap="journey-copy"
            >
              {journeyStages.map((item, index) => <JourneyStage key={item.id} {...item} index={index} />)}
            </div>
            <JourneyProgress activeStage={activeStage} />
          </div>
        </div>
      </section>
      <TravelCardStack />
      <BusinessCaseJourney />
      <ExperiencesSection />
      <CtaSection />
    </main>
  );
}
