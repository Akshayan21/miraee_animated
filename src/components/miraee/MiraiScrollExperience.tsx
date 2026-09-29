"use client";

import { useRef, useState } from "react";
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
import { useEffect } from "react";
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
  const [navCompact, setNavCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // Voice list loads asynchronously (Chrome fires it only after
  // "voiceschanged"), so the pick is cached in a ref and re-run whenever
  // the list updates rather than read once at speak-time.
  const femaleVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const femaleNames = ["female", "zira", "samantha", "victoria", "karen", "moira", "tessa", "fiona", "susan", "aria", "jenny", "google us english"];
    function pickFemaleVoice() {
      const voices = window.speechSynthesis.getVoices();
      femaleVoiceRef.current =
        voices.find((v) => v.lang.startsWith("en") && femaleNames.some((n) => v.name.toLowerCase().includes(n))) ||
        voices.find((v) => femaleNames.some((n) => v.name.toLowerCase().includes(n))) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0] ||
        null;
    }
    pickFemaleVoice();
    window.speechSynthesis.addEventListener("voiceschanged", pickFemaleVoice);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", pickFemaleVoice);
  }, []);

  // Chrome ties speechSynthesis to the page's "user activation" flag: a
  // speak() called from a scroll-driven GSAP callback (not a direct event
  // handler) is silently dropped until some real gesture has fired at least
  // once. Priming it on the very first pointer/wheel/key input — with an
  // audible utterance, since an empty/whitespace one doesn't reliably set
  // the flag either — unlocks every later scroll-triggered call.
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    let unlocked = false;
    function unlock() {
      if (unlocked) return;
      unlocked = true;
      const primer = new SpeechSynthesisUtterance(" ");
      primer.volume = 0;
      window.speechSynthesis.speak(primer);
      events.forEach((event) => window.removeEventListener(event, unlock));
    }
    const events = ["pointerdown", "wheel", "keydown", "touchstart"] as const;
    events.forEach((event) => window.addEventListener(event, unlock, { once: true, passive: true }));
    return () => events.forEach((event) => window.removeEventListener(event, unlock));
  }, []);

  // Chrome (and Chromium-based Edge) has a long-standing bug where a
  // SpeechSynthesisUtterance can be garbage-collected mid-speech if nothing
  // holds a reference to it, and where the synth engine silently drops into
  // a "paused" state it never wakes from on its own. Keeping the utterance
  // in a ref and nudging resume() on an interval works around both.
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Speaks Miraee's line aloud with the browser's built-in TTS — free,
  // no API key, no external service.
  function speak(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1.05;
    if (femaleVoiceRef.current) utterance.voice = femaleVoiceRef.current;
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const interval = setInterval(() => {
      if (window.speechSynthesis.speaking && window.speechSynthesis.paused) window.speechSynthesis.resume();
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // The scroll timeline can cross a stage's trigger point more than once in
  // quick succession while the scrub is still easing/settling (Lenis smooths
  // the raw wheel delta, so the GSAP playhead can overshoot and re-cross a
  // label). Debouncing means a fast scroll only speaks the stage you land
  // on, instead of stacking and cancelling several utterances back to back.
  const speakTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  function speakDebounced(text: string) {
    if (speakTimeout.current) clearTimeout(speakTimeout.current);
    speakTimeout.current = setTimeout(() => speak(text), 180);
  }

  // On a reload the browser restores the previous scroll position itself
  // (or GSAP's own ScrollTrigger.refresh() jumps the timeline straight to
  // wherever the scrollbar already is). Either way, every .call() between
  // progress 0 and that position fires in one synchronous burst as the
  // timeline catches up — so activeStage can jump straight to "support"
  // while the page is still visually settling on the hero. Gating on a
  // short post-mount delay (instead of just skipping the first change)
  // absorbs that whole catch-up burst, not only its first step, so nothing
  // speaks until the page has actually finished settling at the restored
  // position and a real scroll can occur.
  const speechReady = useRef(false);
  useEffect(() => {
    const timer = setTimeout(() => { speechReady.current = true; }, 700);
    return () => clearTimeout(timer);
  }, []);

  const hasSpokenResponse = useRef(false);
  useEffect(() => {
    if (!hasSpokenResponse.current) { hasSpokenResponse.current = true; return; }
    if (!speechReady.current) return;
    speakDebounced(response);
  }, [response]);

  const hasSpokenStage = useRef(false);
  useEffect(() => {
    if (!hasSpokenStage.current) { hasSpokenStage.current = true; return; }
    if (!speechReady.current) return;
    const stageData = journeyStages.find((item) => item.id === activeStage);
    if (stageData) speakDebounced(stageData.message);
  }, [activeStage]);

  useEffect(() => {
    return () => {
      if (speakTimeout.current) clearTimeout(speakTimeout.current);
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  async function selectCapability(name: string) {
    const prompt = `How can Miraee help with ${name}?`;
    setQuestion(prompt);
    setResponse(await sendMessage(prompt));
  }

  return (
    <main>
      <header
        className="fixed inset-x-0 top-0 z-[100] flex justify-center pt-3.5 px-4 pointer-events-none"
        data-gsap="site-header"
      >
        <div
          className={`pointer-events-auto flex items-center justify-between gap-4 rounded-full bg-[color-mix(in_srgb,var(--color-background-deep)_92%,transparent)] border border-white/10 shadow-[0_6px_20px_rgba(0,0,0,.14)] backdrop-blur-[20px] transition-[width,height,padding] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
            navCompact
              ? "w-[300px] max-w-full h-[52px] pr-1.5 pl-4 max-lg:w-[340px]"
              : "w-[1120px] max-w-full h-[60px] pr-2 pl-5 max-lg:w-auto max-lg:gap-6 max-md:h-[56px] max-md:pl-4"
          }`}
        >
          <a className="inline-flex items-center gap-2.5 flex-shrink-0 no-underline" href="#">
            <img className="block h-[21px] w-auto" src="/brand/icons/Miraee_Logo.png" alt="Miraee" />
          </a>
          <nav
            className={`flex items-center justify-center gap-0.5 flex-[0_1_auto] min-w-0 overflow-hidden text-[13.5px] font-semibold whitespace-nowrap transition-[max-width,opacity] duration-500 ease-[cubic-bezier(.16,1,.3,1)] max-lg:hidden ${
              navCompact ? "hidden" : "max-w-[720px] opacity-100"
            }`}
            aria-label="Primary"
          >
            <a className="px-[13px] py-[9px] rounded-full text-white/72 transition-colors duration-200 hover:text-white hover:bg-white/8 no-underline" href="#meet-mirai">Platform</a>
            <a className="px-[13px] py-[9px] rounded-full text-white/72 transition-colors duration-200 hover:text-white hover:bg-white/8 no-underline" href="#meet-mirai">Why Miraee</a>
            <a className="px-[13px] py-[9px] rounded-full text-white/72 transition-colors duration-200 hover:text-white hover:bg-white/8 no-underline" href="#journey">Pricing</a>
            <a className="px-[13px] py-[9px] rounded-full text-white/72 transition-colors duration-200 hover:text-white hover:bg-white/8 no-underline" href="#journey">Solutions</a>
            <a className="px-[13px] py-[9px] rounded-full text-white/72 transition-colors duration-200 hover:text-white hover:bg-white/8 no-underline" href="#journey">AI &amp; Technology</a>
            <a className="px-[13px] py-[9px] rounded-full text-white/72 transition-colors duration-200 hover:text-white hover:bg-white/8 no-underline" href="#journey">Company</a>
          </nav>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <a
              className={`text-white text-[13px] font-bold border rounded-full whitespace-nowrap overflow-hidden transition-[max-width,opacity,border-color,background-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:border-white/32 hover:bg-white/6 no-underline max-md:hidden ${
                navCompact ? "hidden" : "px-[18px] py-2.5 max-w-[110px] opacity-100 border-white/16"
              }`}
              href="#"
            >
              Sign In
            </a>
            <a className="bg-brand text-white px-5 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-transform duration-150 active:scale-95 no-underline max-md:px-3.5 max-md:py-2.5 max-md:text-xs" href="#journey">Request a Demo</a>
            <button className="hidden relative w-10 h-10 flex-shrink-0 items-center justify-center border border-white/16 rounded-full bg-transparent max-lg:flex" type="button" aria-label="Menu">
              <i className="absolute w-[15px] h-[1.5px] rounded bg-white -translate-y-[3px]" />
              <i className="absolute w-[15px] h-[1.5px] rounded bg-white translate-y-[3px]" />
            </button>
          </div>
        </div>
      </header>
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
      <footer className="[padding:clamp(48px,7vw,88px)_clamp(24px,7vw,64px)_24px] bg-background-deep text-white">
        <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-10 max-w-[1360px] mx-auto text-sm text-[#aaa5ae] max-lg:grid-cols-2">
          <div className="max-lg:col-span-2">
            <a className="inline-flex items-center gap-2.5 no-underline" href="#"><img className="block h-[30px] w-auto" src="/brand/icons/Miraee_Logo.png" alt="Miraee" /></a>
            <p className="max-w-[30ch] mt-4 mb-0 leading-[1.6]">Your team&apos;s personal travel agent. Booking, support and expenses, together.</p>
            <div className="mt-6 text-[11px] font-bold tracking-[.14em] uppercase text-[#857f8c]">Travel Limitless</div>
          </div>
          <div>
            <b className="block mb-3 text-white text-sm">Platform</b>
            <a className="block py-2 text-[#aaa5ae] transition-colors duration-200 hover:text-brand no-underline" href="#meet-mirai">Platform</a>
            <a className="block py-2 text-[#aaa5ae] transition-colors duration-200 hover:text-brand no-underline" href="#journey">Implementation</a>
            <a className="block py-2 text-[#aaa5ae] transition-colors duration-200 hover:text-brand no-underline" href="#journey">Integrations</a>
            <a className="block py-2 text-[#aaa5ae] transition-colors duration-200 hover:text-brand no-underline" href="#meet-mirai">AI travel assistant</a>
          </div>
          <div>
            <b className="block mb-3 text-white text-sm">Solutions</b>
            <a className="block py-2 text-[#aaa5ae] transition-colors duration-200 hover:text-brand no-underline" href="#journey">Employees</a>
            <a className="block py-2 text-[#aaa5ae] transition-colors duration-200 hover:text-brand no-underline" href="#journey">Finance</a>
            <a className="block py-2 text-[#aaa5ae] transition-colors duration-200 hover:text-brand no-underline" href="#journey">Travel Leads</a>
            <a className="block py-2 text-[#aaa5ae] transition-colors duration-200 hover:text-brand no-underline" href="#journey">Use cases</a>
          </div>
          <div>
            <b className="block mb-3 text-white text-sm">Company</b>
            <a className="block py-2 text-[#aaa5ae] transition-colors duration-200 hover:text-brand no-underline" href="#">Company</a>
            <a className="block py-2 text-[#aaa5ae] transition-colors duration-200 hover:text-brand no-underline" href="#">Resources</a>
            <a className="block py-2 text-[#aaa5ae] transition-colors duration-200 hover:text-brand no-underline" href="#">Careers</a>
            <a className="block py-2 text-[#aaa5ae] transition-colors duration-200 hover:text-brand no-underline" href="#">Security / Trust</a>
          </div>
          <div>
            <b className="block mb-3 text-white text-sm">Get started</b>
            <a className="block py-2 text-[#aaa5ae] transition-colors duration-200 hover:text-brand no-underline" href="#journey">Request a Demo</a>
            <a className="block py-2 text-[#aaa5ae] transition-colors duration-200 hover:text-brand no-underline" href="#journey">Book a Demo</a>
            <a className="block py-2 text-[#aaa5ae] transition-colors duration-200 hover:text-brand no-underline" href="#">Savings analysis</a>
            <a className="block py-2 text-[#aaa5ae] transition-colors duration-200 hover:text-brand no-underline" href="#">Why Miraee</a>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 max-w-[1360px] mx-auto mt-[clamp(40px,6vw,72px)] pt-6 border-t border-white/10 text-xs font-semibold tracking-[.06em] text-[#857f8c] max-md:flex-col max-md:items-start">
          <span>© 2026 Miraee · a Tabhi group company</span>
          <div className="flex flex-wrap gap-5">
            <a className="text-[#aaa5ae] hover:text-brand transition-colors duration-200 no-underline" href="#">Terms &amp; Conditions</a>
            <a className="text-[#aaa5ae] hover:text-brand transition-colors duration-200 no-underline" href="#">Privacy Policy</a>
          </div>
          <span>Mondee One · Miraee · Abhee — three products, one platform</span>
        </div>
      </footer>
    </main>
  );
}
