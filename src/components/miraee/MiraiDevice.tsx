import type { JourneyStageId } from "@/data/miraiExperience";

const deviceMessages: Record<JourneyStageId, string> = {
  plan: "I'll turn that into a trip plan.",
  book: "I found options that match your trip.",
  approve: "Your trip is approved.",
  travel: "I've updated your journey.",
  support: "I'm connecting the right support.",
  "post-trip": "Your trip is wrapped up.",
};

export function MiraiDevice({ activeStage }: { activeStage: JourneyStageId }) {
  return (
    <div
      // A real phone reads roughly 9:19.5 (width:height); locking that ratio
      // to the width — instead of sizing width and height independently off
      // separate vw/vh units — keeps the shell looking like a phone at every
      // breakpoint instead of going squat/wide on shorter viewports. The
      // height cap has to be in vh, not a fixed px value: a fixed cap does
      // nothing on a short/laptop-height viewport, so the width-driven
      // aspect-ratio height overflowed off the bottom of the screen.
      className="invisible absolute z-10 left-1/2 top-[17%] w-[clamp(280px,23vw,340px)] aspect-[9/19.5] max-h-[72vh] -translate-x-1/2 opacity-0 [will-change:transform,opacity,clip-path] max-md:static max-md:left-auto max-md:top-auto max-md:w-[min(76vw,300px)] max-md:mx-auto max-md:translate-x-0 max-md:visible max-md:opacity-100 motion-reduce:sticky motion-reduce:top-[15vh] motion-reduce:left-auto motion-reduce:translate-x-0 motion-reduce:visible! motion-reduce:opacity-100!"
      data-gsap="device-shell"
      aria-hidden="true"
    >
      {/* Ambient bloom: reads as light spilling from the screen, grounding the
          device in the scene instead of floating flat on the page. */}
      <div
        className="absolute -inset-x-[26%] -inset-y-[14%] -z-1 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-brand)_22%,transparent),transparent_72%)] blur-[36px]"
        aria-hidden="true"
      />
      {/* Rim-light bezel: a soft gradient "ring" behind the true bezel reads as
          a highlight catching the edge, instead of one flat black slab. */}
      <div className="absolute -inset-[2px] rounded-[44px] bg-[linear-gradient(155deg,rgba(255,255,255,.35),rgba(255,255,255,0)_28%,rgba(255,255,255,0)_72%,color-mix(in_srgb,var(--color-brand)_35%,transparent))] opacity-70" />
      <div className="absolute inset-0 border-[7px] border-background-deep rounded-[42px] bg-[linear-gradient(165deg,color-mix(in_srgb,var(--color-background-deep)_92%,white),var(--color-background-deep)_40%)] shadow-[0_40px_90px_-12px_rgba(32,25,43,.45),inset_0_0_0_2px_#716b75]">
        <span className="absolute z-[5] left-1/2 top-[11px] w-[60px] h-[18px] -translate-x-1/2 rounded-[20px] bg-background-dark shadow-[inset_0_1px_2px_rgba(0,0,0,.6)]">
          <span className="absolute right-2.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[#2a3550]" />
        </span>
      </div>
      <div className="absolute inset-2 overflow-hidden rounded-[35px] bg-[linear-gradient(165deg,var(--color-mi-cream),color-mix(in_srgb,var(--color-brand)_10%,var(--color-mi-cream))_58%,color-mix(in_srgb,var(--color-brand)_18%,var(--color-mi-cream)))]">
        {/* Miraee's avatar, rendered natively inside the screen (not the large
            outer .mirai-layer bleeding through) — this is the same stacking
            context as the header/status text below, so z-index between them
            is reliable: the phone's own chrome always reads on top of her,
            without ever hiding her behind an opaque screen background. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed-aspect brand asset composited into a CSS-built device mock */}
        <img
          src="/brand/icons/Avatar-1337.webp"
          alt=""
          className="absolute inset-x-0 top-0 z-0 h-[72%] w-full object-cover object-top [mask-image:linear-gradient(180deg,black_62%,transparent_96%)] [-webkit-mask-image:linear-gradient(180deg,black_62%,transparent_96%)]"
        />
        {/* Glass sheen sweeping the top of the screen for a lit, premium feel. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-[linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,0))]" />
        <div className="absolute z-[4] top-[15px] left-[22px] right-[22px] flex justify-between text-[8px] font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,.4)]">
          <span>9:41</span><span>● ᴡɪғɪ</span>
        </div>
        <div
          className="absolute z-[15] left-[18px] right-[18px] bottom-[74px] p-[13px] rounded-[12px_12px_12px_3px] bg-white/92 text-[#3e3745] text-[11px] leading-[1.4] shadow-[0_14px_30px_-10px_rgba(34,25,45,.35)] backdrop-blur-[6px] animate-message-in"
          key={activeStage}
        >
          {deviceMessages[activeStage]}
        </div>
        <div className="absolute z-[15] left-3.5 right-3.5 bottom-4 h-[45px] flex items-center justify-between pr-[7px] pl-4 rounded-full border border-white/60 bg-white/92 text-[#89818d] text-[9px] shadow-[0_16px_36px_-12px_rgba(34,25,45,.4)] backdrop-blur-[6px]">
          <span>Ask Miraee...</span>
          <b className="grid place-items-center w-[31px] h-[31px] rounded-full bg-[linear-gradient(155deg,var(--color-brand),var(--color-brand-strong))] text-white text-xs shadow-[0_6px_14px_-4px_color-mix(in_srgb,var(--color-brand)_70%,transparent)]">
            ↗
          </b>
        </div>
      </div>
    </div>
  );
}
