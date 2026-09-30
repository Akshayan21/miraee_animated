// Content lifted from the reference site's /platform page, section 2
// ("Platform capabilities") — copy only. The reference's own layout there
// is a static bento grid; here the same six items drive an immersive,
// scroll-scrubbed 3D sequence instead (see PlatformCapabilities.tsx).
export const platformCapabilitiesIntro = {
  eyebrow: "Platform capabilities",
  title: "Everything a travel program needs, one platform.",
  lede: "From wholesale content to the human backup when it matters, every capability lives behind one agent instead of a stack of disconnected tools.",
};

export const platformCapabilities = [
  {
    id: "global-content",
    label: "Global content",
    body: "Access to 2M+ hotels, 500+ airlines with NDC, and worldwide rail.",
    icon: "globe",
  },
  {
    id: "agentic-fulfilment",
    label: "Agentic fulfilment",
    body: "Zero forms. Agents manage booking, coordinating, paying and expense.",
    icon: "agent",
  },
  {
    id: "complex-bookings",
    label: "Complex bookings",
    body: "Agent-assisted fulfilment for what standard portals cannot handle, including rail, deposit hotels and complex group itineraries.",
    icon: "layers",
  },
  {
    id: "support",
    label: "24x7 support, AI and human",
    body: "Miraee handles standard changes and refunds instantly. When a complex exception arises, a human specialist takes over in the same thread.",
    icon: "headset",
    cta: { label: "Talk to support", href: "/request-demo" },
  },
  {
    id: "mice",
    label: "MICE and after 5pm",
    body: "Plan offsites and customer events once, and unlock hyperlocal experiences after hours through Abhee.",
    icon: "sparkle",
  },
  {
    id: "personalisation",
    label: "Complete personalisation",
    body: "Your assistant has a memory. It knows seat preferences, hotel brands, airline status and arrival buffers, and recommends rather than listing.",
    icon: "brain",
  },
] as const;

export type PlatformCapabilityId = (typeof platformCapabilities)[number]["id"];
