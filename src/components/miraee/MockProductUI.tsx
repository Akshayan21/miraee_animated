import type { JourneyStageId } from "@/data/miraiExperience";
import { CapabilityIcon } from "./CapabilityIcon";

const mockUiBase =
  "relative w-full max-w-[540px] overflow-hidden rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-brand)_12%,var(--line))] bg-white/85 shadow-[0_12px_28px_-14px_rgba(69,14,20,.18)] backdrop-blur-[22px]";
const accentBar =
  "absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,var(--color-brand),var(--color-brand-strong),var(--color-mi-rust))]";
const checkDelays = ["delay-0", "delay-100", "delay-200", "delay-300", "delay-[400ms]"];

function ChipIcon({ name, tone = "brand" }: { name: Parameters<typeof CapabilityIcon>[0]["name"]; tone?: "brand" | "success" }) {
  const isSuccess = tone === "success";
  return (
    <span
      className={`grid size-9 flex-none place-items-center rounded-[var(--radius-md)] ${
        isSuccess
          ? "bg-[color-mix(in_srgb,var(--color-success)_14%,white)] text-success"
          : "bg-[color-mix(in_srgb,var(--color-brand)_14%,white)] text-brand-dark"
      }`}
    >
      <CapabilityIcon name={name} className="size-[18px]" />
    </span>
  );
}

function CheckBadge() {
  return (
    <span className="grid size-5 flex-none place-items-center rounded-full bg-[color-mix(in_srgb,var(--color-success)_18%,white)] text-success">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className="size-3">
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}

export function MockProductUI({ stage }: { stage: JourneyStageId }) {
  if (stage === "plan") {
    const items = ["Understanding dates", "Checking policy", "Finding options", "Building itinerary"];
    return (
      <div className={mockUiBase}>
        <div className={accentBar} />
        <div className="m-[15px] mb-2 rounded-[var(--radius-md)] bg-brand-dark px-4 py-3.5 text-[13px] text-white">
          Austin to Paris next Monday, returning Friday.
        </div>
        <div className="px-1.5 pb-1.5">
          {items.map((item, i) => (
            <div
              key={item}
              className={`flex animate-check-in items-center gap-3 px-[17px] py-3 text-[13px] font-medium text-ink/85 ${checkDelays[i]} ${i < items.length - 1 ? "border-b border-line" : ""}`}
            >
              <CheckBadge />
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stage === "book") {
    const rows: { item: string; icon: Parameters<typeof CapabilityIcon>[0]["name"]; detail: string }[] = [
      { item: "Flight", icon: "flights", detail: "AUS → CDG" },
      { item: "Hotel", icon: "hotels", detail: "Paris · 4 nights" },
      { item: "Car", icon: "cars", detail: "Airport pickup" },
    ];
    return (
      <div className={`${mockUiBase} p-3`}>
        <div className={accentBar} />
        {rows.map((row, i) => (
          <div
            key={row.item}
            className={`group grid animate-check-in grid-cols-[36px_1fr_auto] items-center gap-3 rounded-[var(--radius-md)] p-3 transition-colors ${checkDelays[i]} ${
              i < rows.length - 1 ? "border-b border-line" : ""
            } hover:bg-[color-mix(in_srgb,var(--color-brand)_4%,transparent)]`}
          >
            <ChipIcon name={row.icon} />
            <div className="min-w-0">
              <small className="block text-[9px] font-bold uppercase tracking-[.12em] text-muted">{row.item}</small>
              <strong className="mt-[3px] block truncate text-[13px] font-semibold text-ink">{row.detail}</strong>
            </div>
            <b className="rounded-full border border-[color-mix(in_srgb,var(--color-brand)_35%,transparent)] px-3 py-1.5 text-[9px] font-bold text-brand transition-colors group-hover:bg-brand group-hover:text-white">
              View
            </b>
          </div>
        ))}
      </div>
    );
  }

  if (stage === "approve") {
    return (
      <div className={`${mockUiBase} p-[22px]`}>
        <div className={accentBar} />
        <p className="m-0 flex items-center gap-2 text-[9px] font-bold tracking-[.18em] text-brand">
          <CapabilityIcon name="policy" className="size-3.5" /> TRIP REQUEST
        </p>
        <h3 className="mt-3 mb-5 font-display text-2xl font-semibold text-ink">
          Austin <span className="mx-3 text-brand">→</span> Paris
        </h3>
        <div className="flex items-center justify-between border-t border-line py-3 text-[12px]">
          <span className="text-muted">Policy status</span>
          <strong className="flex items-center gap-1.5 text-ink">
            <CheckBadge /> Within policy
          </strong>
        </div>
        <div className="flex items-center justify-between border-t border-line py-3 text-[12px]">
          <span className="text-muted">Manager approval</span>
          <strong className="flex items-center gap-1.5 text-success">
            <CheckBadge /> Approved
          </strong>
        </div>
      </div>
    );
  }

  if (stage === "travel") {
    const items = ["Airport", "Flight", "Hotel", "Meeting", "Return"];
    const times = ["06:40", "08:45", "18:30", "09:00", "Friday"];
    return (
      <div className={`${mockUiBase} px-[20px] py-[15px]`}>
        <div className={accentBar} />
        <div className="mb-2.5 inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--color-mi-amber)_30%,white)] px-3.5 py-2 text-[10px] font-bold text-[color-mix(in_srgb,var(--color-brand-dark)_80%,black)]">
          <span className="size-1.5 rounded-full bg-brand-strong" /> Gate changed · B24
        </div>
        {items.map((item, i) => (
          <div className="relative grid min-h-[34px] grid-cols-[14px_1fr_auto] items-center gap-3 text-[12px]" key={item}>
            <span
              className={`relative size-2 rounded-full border ${i < 2 ? "border-brand bg-brand shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-brand)_18%,transparent)]" : "border-[#c9c2ba] bg-white"} ${
                i < items.length - 1 ? "after:absolute after:top-5 after:left-1/2 after:h-[18px] after:w-px after:-translate-x-1/2 after:bg-[#e2dcd6]" : ""
              }`}
            />
            <p className="m-0 font-medium text-ink/85">{item}</p>
            <small className="text-muted">{times[i]}</small>
          </div>
        ))}
      </div>
    );
  }

  if (stage === "support") {
    return (
      <div className={`${mockUiBase} px-[17px] py-3`}>
        <div className={accentBar} />
        <div className="grid grid-cols-[38px_1fr_auto] items-center gap-3 border-b border-line py-3.5">
          <ChipIcon name="support" />
          <p className="m-0">
            <strong className="block text-[13px] font-semibold text-ink">TAVO</strong>
            <small className="mt-0.5 block text-[9px] text-muted">Restaurant reservation</small>
          </p>
          <b className="text-[9px] font-bold text-success">Table confirmed</b>
        </div>
        <div className="grid grid-cols-[38px_1fr_auto] items-center gap-3 py-3.5">
          <ChipIcon name="support" tone="success" />
          <p className="m-0">
            <strong className="block text-[13px] font-semibold text-ink">TACO</strong>
            <small className="mt-0.5 block text-[9px] text-muted">Flight assistance</small>
          </p>
          <b className="text-[9px] font-bold text-success">Human connected</b>
        </div>
      </div>
    );
  }

  const items = ["Receipt captured", "Expense categorized", "Reconciliation complete", "Trip completed"];
  return (
    <div className={`${mockUiBase} px-[20px] py-2`}>
      <div className={accentBar} />
      {items.map((item, i) => (
        <div
          key={item}
          className={`flex animate-check-in items-center gap-3 py-3 text-[13px] font-medium text-ink/85 ${checkDelays[i]} ${i < items.length - 1 ? "border-b border-line" : ""}`}
        >
          <CheckBadge />
          {item}
        </div>
      ))}
    </div>
  );
}
