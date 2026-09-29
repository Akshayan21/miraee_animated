import { journeyStages, type JourneyStageId } from "@/data/miraiExperience";

export function JourneyProgress({ activeStage }: { activeStage: JourneyStageId }) {
  const activeIndex = journeyStages.findIndex((stage) => stage.id === activeStage);
  return (
    <ol
      className="invisible absolute z-[12] right-[clamp(18px,3vw,50px)] top-1/2 translate-x-4 -translate-y-1/2 list-none m-0 p-0 opacity-0 max-lg:right-[15px] max-md:hidden motion-reduce:hidden"
      data-gsap="journey-progress"
      aria-label="Journey progress"
    >
      {journeyStages.map((stage, index) => {
        const isActive = index === activeIndex;
        const isComplete = index < activeIndex;
        const tone = isActive ? "text-ink" : "text-[#aaa4ae]";
        const lineColor = isComplete ? "after:bg-brand" : "after:bg-[#d1cad4]";
        return (
          <li
            key={stage.id}
            className={`relative flex items-center gap-2.5 min-h-[34px] text-[9px] uppercase tracking-[.1em] ${tone} [&:not(:last-child)]:after:content-[''] [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:top-[22px] [&:not(:last-child)]:after:left-1 [&:not(:last-child)]:after:w-px [&:not(:last-child)]:after:h-5 ${lineColor}`}
          >
            <span
              className={`relative z-[1] w-2.5 h-2.5 rounded-full bg-paper border transition-shadow duration-300 ${
                isActive
                  ? "border-brand bg-brand shadow-[inset_0_0_0_2px_var(--paper),0_0_0_4px_color-mix(in_srgb,var(--color-brand)_22%,transparent)]"
                  : isComplete
                    ? "border-brand bg-brand"
                    : "border-[#b0a9b3]"
              }`}
            />
            <span className="max-lg:hidden">{stage.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
