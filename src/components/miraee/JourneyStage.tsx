import { MockProductUI } from "./MockProductUI";
import type { JourneyStageId } from "@/data/miraiExperience";

type Props = { id: JourneyStageId; label: string; message: string; index: number };

export function JourneyStage({ id, label, message, index }: Props) {
  return (
    <article
      className={`absolute inset-0 flex flex-col justify-center max-md:static max-md:min-h-[90svh] max-md:py-[70px] max-md:visible max-md:opacity-100 max-md:[transform:none] motion-reduce:static motion-reduce:min-h-[85vh] motion-reduce:visible! motion-reduce:opacity-100! motion-reduce:[transform:none]! ${
        index !== 0 ? "invisible translate-y-[56px] opacity-0" : ""
      }`}
      data-gsap="journey-stage"
      data-stage={id}
      aria-hidden={index !== 0}
    >
      <p className="m-0 mb-[22px] flex items-center gap-2.5 text-brand text-[13px] font-bold tracking-[.16em] uppercase">
        <span className="h-px w-6 bg-[linear-gradient(90deg,var(--color-brand),transparent)]" aria-hidden="true" />
        0{index + 1} / 06
      </p>
      <h2 className="m-0 font-display text-[clamp(65px,6.4vw,106px)] leading-[.9] tracking-[-.07em] capitalize text-ink max-md:text-[68px]">{label}</h2>
      <p className="w-3/4 my-6 mb-7 text-muted text-[17px] leading-[1.5] max-md:w-full">{message}</p>
      <MockProductUI stage={id} />
    </article>
  );
}
