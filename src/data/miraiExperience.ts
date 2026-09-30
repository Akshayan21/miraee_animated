// A row of quick-start prompts beneath the input, not a scattered ring —
// laid out as a plain grid so it reads as a clear set of shortcuts around
// Miraee rather than cards floating at arbitrary points on the page.
// A single shared accent (set in QuickRequestCard itself), not a rainbow
// assigned per card — the colour used to carry no meaning (hotels weren't
// "blue", cars weren't "amber"), it was just decoration. One brand tone
// reads as one coherent set of shortcuts instead of four unrelated tiles.
export const quickRequests = [
  { name: "Flights", icon: "flights", description: "Find and book flights" },
  { name: "Hotels", icon: "hotels", description: "Find stays for your trip" },
  { name: "Cars", icon: "cars", description: "Arrange ground transport" },
  { name: "Support", icon: "support", description: "Get help with your trip" },
] as const;

export const journeyStages = [
  { id: "plan", label: "Plan", message: "Tell me where you need to go. I’ll take it from there." },
  { id: "book", label: "Book", message: "I’ll bring your flights, stays, and transport together, so you can choose what works." },
  { id: "approve", label: "Approve", message: "Once you’re ready, I’ll keep policy checks and approvals moving." },
  { id: "travel", label: "Travel", message: "And while you travel, I’ll keep you updated as things change." },
  { id: "support", label: "Support", message: "Need something along the way? I’ll help, or connect you with the right person." },
  { id: "post-trip", label: "Post-trip", message: "When you’re back, I’ll help wrap up the details, so nothing gets left behind." },
] as const;

export type JourneyStageId = (typeof journeyStages)[number]["id"];

// The gallery images are hotlinked from Unsplash (free for commercial use,
// no attribution required) — same sourcing pattern already used by
// TravelCardStack elsewhere on this page. No stats are invented here: the
// reference this section is adapted from cited a sister company's real
// marketplace numbers (10M+ experiences, 100K creators via "Abhee"), which
// aren't true of Miraee itself, so this version describes the capability
// instead of asserting borrowed metrics.
export const experienceHighlights = [
  { label: "One request", detail: "Ask for the trip and the detour in the same sentence." },
  { label: "One policy check", detail: "Extras stay inside the same approval, not a separate form." },
  { label: "One receipt", detail: "Booked and expensed together, filed the same way." },
] as const;

// `aspect` gives each tile its own irregular height (a CSS multi-column
// masonry, not a grid with row-spans — row-spans forced tiles to share row
// tracks with mismatched aspect ratios, which is what caused dead gaps).
// `depth` drives how far each tile drifts vertically as the page scrolls
// past it — a plain scroll-linked parallax (GSAP `scrub`, no `pin`), so
// tiles feel alive on scroll without any scroll-jacking that could freeze
// the page.
export const experienceGallery = [
  { caption: "Once-in-a-trip moments", image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1000&q=70", aspect: "aspect-[3/4.4]", depth: -0.9 },
  { caption: "Adventures together", image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1000&q=70", aspect: "aspect-[4/5]", depth: 1.1 },
  { caption: "Quiet moments outdoors", image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1000&q=70", aspect: "aspect-[4/3.3]", depth: -0.6 },
  { caption: "The bleisure weekend", image: "https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=1400&q=70", aspect: "aspect-[3/4.6]", depth: 0.8 },
  { caption: "The open road", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=70", aspect: "aspect-[4/5]", depth: -1 },
] as const;
