import type { ReactNode } from "react";

type IconKey = "globe" | "agent" | "layers" | "headset" | "sparkle" | "brain";

const paths: Record<IconKey, ReactNode> = {
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.6 2.4 4 5.3 4 8.5s-1.4 6.1-4 8.5c-2.6-2.4-4-5.3-4-8.5s1.4-6.1 4-8.5Z" />
    </>
  ),
  agent: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="2.5" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2M9 13.5h.01M15 13.5h.01" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3.5 8 4.2-8 4.2-8-4.2 8-4.2Z" />
      <path d="m4 12.3 8 4.2 8-4.2M4 16.5l8 4.2 8-4.2" />
    </>
  ),
  headset: (
    <>
      <path d="M4.5 13v-1a7.5 7.5 0 0 1 15 0v1" />
      <rect x="3" y="13" width="4" height="6" rx="1.6" />
      <rect x="17" y="13" width="4" height="6" rx="1.6" />
      <path d="M19 19v.5a3 3 0 0 1-3 3h-2.5" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 2.5c.32 3.4 1.06 5.7 2.22 6.86 1.16 1.16 3.46 1.9 6.86 2.22-3.4.32-5.7 1.06-6.86 2.22-1.16 1.16-1.9 3.46-2.22 6.86-.32-3.4-1.06-5.7-2.22-6.86-1.16-1.16-3.46-1.9-6.86-2.22 3.4-.32 5.7-1.06 6.86-2.22C10.94 8.2 11.68 5.9 12 2.5Z" />
    </>
  ),
  brain: (
    <>
      <path d="M9.5 4.5a3 3 0 0 0-3 3v.3A3.2 3.2 0 0 0 4.5 11v1a3.2 3.2 0 0 0 1.6 2.77V15a3 3 0 0 0 3 3h.4M14.5 4.5a3 3 0 0 1 3 3v.3a3.2 3.2 0 0 1 2 3.2v1a3.2 3.2 0 0 1-1.6 2.77V15a3 3 0 0 1-3 3h-.4" />
      <path d="M9.5 4.5v14M14.5 4.5v14" />
    </>
  ),
};

export function CapabilityGlyph({ icon, className }: { icon: IconKey; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {paths[icon]}
    </svg>
  );
}

export type { IconKey as CapabilityIconKey };
