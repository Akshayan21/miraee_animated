import type { ReactNode } from "react";

type IconKey = "flights" | "hotels" | "cars" | "policy" | "approval" | "expenses" | "meetings" | "support";

const paths: Record<IconKey, ReactNode> = {
  // A recognisable side-view airplane silhouette — the previous single dart-shaped
  // path read as a "send" arrow rather than a plane once rendered small.
  flights: (
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-1 .1-1.3.5l-.7.9c-.3.4-.2.9.2 1.2L9 12l-2 3H4l-1 2 3 1 1 3 2-1v-3l3-2 3.4 5.8c.3.4.8.5 1.2.2l.9-.7c.4-.3.6-.8.5-1.3Z" />
  ),
  // A plain bed silhouette — the previous building-with-windows shape read as a
  // folder/document icon at this size rather than a hotel stay.
  hotels: <>
    <path d="M3 18v-7" />
    <path d="M3 11h16a2 2 0 0 1 2 2v5" />
    <path d="M3 16.5h18" />
    <path d="M6.5 11V7.5A1.5 1.5 0 0 1 8 6h3a1.5 1.5 0 0 1 1.5 1.5V11" />
  </>,
  cars: <>
    <path d="M4 16.5V12l2-5h12l2 5v4.5" />
    <path d="M4 16.5h16v2.2a.8.8 0 0 1-.8.8h-1.4a.8.8 0 0 1-.8-.8v-1.2H7v1.2a.8.8 0 0 1-.8.8H4.8a.8.8 0 0 1-.8-.8v-2.2Z" />
    <path d="M6.5 7h11" />
    <circle cx="7.5" cy="14" r="1" />
    <circle cx="16.5" cy="14" r="1" />
  </>,
  policy: <>
    <path d="M12 3.5 5 6v5.6c0 4.2 2.9 7 7 8.9 4.1-1.9 7-4.7 7-8.9V6l-7-2.5Z" />
    <path d="m9 12 2 2 4-4.2" />
  </>,
  approval: <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.3 12.2 2.5 2.5 5-5.2" />
  </>,
  expenses: <>
    <path d="M6 3h12v18l-2.5-1.6L13 21l-1-1.6-1 1.6-2.5-1.6L6 21V3Z" />
    <path d="M9 8h6M9 11.5h6M9 15h3.5" />
  </>,
  meetings: <>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
    <path d="M8 13.2h2.2M13.8 13.2H16M8 16.7h2.2" />
  </>,
  support: <>
    <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
    <path d="M4 13v3.2a1.8 1.8 0 0 0 1.8 1.8H7v-6H5.8A1.8 1.8 0 0 0 4 13.8V13Z" />
    <path d="M20 13v.8a1.8 1.8 0 0 1-1.8 1.8H17v-6h1.2A1.8 1.8 0 0 1 20 11.4V13Z" />
    <path d="M17 18v.5A2.5 2.5 0 0 1 14.5 21H13" />
  </>,
};

export function CapabilityIcon({ name, className }: { name: IconKey; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
