import { CapabilityIcon } from "./CapabilityIcon";

type Props = {
  name: string;
  icon: Parameters<typeof CapabilityIcon>[0]["name"];
  description: string;
  onSelect: (name: string) => void;
};

export function QuickRequestCard({ name, icon, description, onSelect }: Props) {
  return (
    <button
      type="button"
      data-gsap="capability-card"
      onClick={() => onSelect(name)}
      className="invisible group flex w-full translate-y-6 items-start gap-3.5 rounded-2xl border border-[rgba(15,4,7,.08)] bg-white/92 p-4 text-left opacity-0 shadow-[0_16px_34px_-14px_rgba(69,14,20,.22)] backdrop-blur-[10px] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_22px_44px_-14px_rgba(69,14,20,.3)] focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 max-md:p-3 max-md:visible max-md:translate-y-0 max-md:opacity-100 motion-reduce:visible! motion-reduce:translate-y-0! motion-reduce:opacity-100!"
    >
      <span
        className="grid size-11 flex-none place-items-center rounded-[13px] bg-[color-mix(in_srgb,var(--color-brand)_16%,white)] text-brand-dark transition-transform duration-200 group-hover:-translate-y-0.5 max-md:size-9"
        aria-hidden="true"
      >
        <CapabilityIcon name={icon} className="size-[22px] max-md:size-[17px]" />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-bold text-ink max-md:text-[13px]">{name}</span>
        <span className="mt-1 block text-[13px] leading-[1.4] text-muted max-md:text-[11px]">{description}</span>
      </span>
    </button>
  );
}
