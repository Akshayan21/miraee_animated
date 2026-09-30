import type { JourneyStageId } from "@/data/miraiExperience";

const stageVisuals: Record<JourneyStageId, { src: string; alt: string; className: string }> = {
  plan: {
    src: "/assets/Container.png",
    alt: "Miraee multi-city flight itinerary",
    className: "max-h-[35vh] max-w-[92%]",
  },
  book: {
    src: "/assets/HotelCard.png",
    alt: "Miraee hotel recommendation with rewards and booking details",
    className: "max-h-[37vh] max-w-[76%]",
  },
  approve: {
    src: "/assets/Branded fares.png",
    alt: "Miraee branded fare comparison with policy guidance",
    className: "max-h-[34vh] max-w-full",
  },
  travel: {
    src: "/assets/Default.png",
    alt: "Miraee ground transport recommendation",
    className: "max-h-[32vh] max-w-[88%]",
  },
  support: {
    src: "/assets/Changes Card.png",
    alt: "Miraee trip modification request and expected savings",
    className: "max-h-[35vh] max-w-[88%]",
  },
  "post-trip": {
    src: "/assets/16.png",
    alt: "Miraee assistant and travel payment card interface",
    className: "max-h-[39vh] max-w-[72%]",
  },
};

export function ProductStageVisual({ stage }: { stage: JourneyStageId }) {
  const visual = stageVisuals[stage];

  return (
    <div
      data-product-ui
      className="relative flex min-h-[31vh] w-full items-center justify-center overflow-visible [perspective:1200px] [will-change:transform,opacity,clip-path] max-md:min-h-0 max-md:py-6"
    >
      <div
        className="absolute left-[8%] right-[8%] top-1/2 h-[46%] -translate-y-1/2 rounded-[50%] bg-[color-mix(in_srgb,var(--color-brand)_13%,transparent)] blur-[42px]"
        aria-hidden="true"
      />
      <img
        src={visual.src}
        alt={visual.alt}
        className={`relative z-1 block h-auto w-auto object-contain drop-shadow-[0_28px_34px_rgba(42,25,28,.16)] ${visual.className}`}
      />
    </div>
  );
}
