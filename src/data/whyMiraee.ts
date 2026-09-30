// Content pulled verbatim from the reference site's own "Why Miraee" page
// (miraee-final.vercel.app/why-miraee) — not invented copy.

export const whyMiraeeHero = {
  eyebrow: "Why Miraee",
  title: "Your travel program needs a unified framework.",
  lede: "Booking in one tool, policy in another, expense in a third. Miraee runs the whole journey as one system.",
  tag: "Same trip. Different operating models.",
};

// The hero's fragmentation->convergence visual is the lede's own sentence
// made literal: "Booking in one tool, policy in another, expense in a
// third" as three scattered chips that fly in and get absorbed into the
// "one system" tag — not a decorative animation, a diagram of the copy.
// Colors reuse the same three accents ConnectedSystems already assigns to
// Identity/Finance/Work, not new invented ones.
export const whyMiraeeHeroFragments = [
  { label: "Booking", sub: "One tool", accent: "var(--color-mi-blue-text)" },
  { label: "Policy", sub: "Another tool", accent: "var(--color-mi-green-text)" },
  { label: "Expense", sub: "A third tool", accent: "var(--color-brand)" },
] as const;

export const comparisonColumns = ["Legacy TMC", "First-gen T&E", "Miraee"] as const;

export const comparisonRows = [
  { capability: "Natural-language planning", values: ["No", "No", "Yes"] },
  { capability: "Policy applied before booking", values: ["Partial", "Partial", "Yes"] },
  { capability: "Proactive disruption handling", values: ["No", "No", "Yes"] },
  { capability: "Expense prepared automatically", values: ["No", "Partial", "Yes"] },
  { capability: "Business and personal travel", values: ["No", "No", "Yes"] },
  { capability: "24/7 human support", values: ["Billed per call", "Add-on", "Included"] },
  { capability: "Agents that complete the work", values: ["No", "No", "Yes"] },
] as const;

export const implementationIntro = {
  eyebrow: "Implementation and onboarding",
  title: "Live in weeks, not quarters.",
  lede: "Pilots reach full deployment in as little as 90 days, and nothing has to be switched off to start.",
};

export const implementationSteps = [
  { index: "01", label: "Policy", body: "Your rules, entities, grades and approval chains are configured.", who: "Your travel and finance leads." },
  { index: "02", label: "Connect", body: "SSO, HRIS, ERP and card networks are linked.", who: "IT, one working session." },
  { index: "03", label: "Pilot", body: "One entity or region runs live alongside the incumbent.", who: "A single team." },
  { index: "04", label: "Roll out", body: "Program-wide, with the pilot numbers as the baseline.", who: "Everyone." },
] as const;

export const hardQuestionsIntro = {
  eyebrow: "Objections",
  title: "The hard questions",
};

export const hardQuestions = [
  {
    question: "“We just signed with our TMC.”",
    answer:
      "Most programs run a pilot on one entity or region alongside the incumbent, then compare like for like. Nothing has to be torn out to see the number.",
  },
  {
    question: "“Our travelers won’t adopt another tool.”",
    answer:
      "Miraee is a conversation, not a portal. There is no interface to learn. Employees describe the trip in the tools they already have open, and the itinerary comes back in policy.",
  },
  {
    question: "“We can’t let AI book without approval.”",
    answer:
      "Then don’t. Every agent has a written limit on what it may do alone, and you set it. Many programs start with approval on everything and relax it once the audit trail earns trust.",
  },
  {
    question: "“Our travel policy is too complex.”",
    answer:
      "Policy is configured by route, grade, trip type and entity, and applied at search rather than at approval. The more complex the policy, the more that matters.",
  },
  {
    question: "“What happens when a trip goes badly wrong?”",
    answer:
      "The agent detects the disruption, prices the alternatives, and escalates to a human travel specialist with the whole trip already attached. The traveler never starts over.",
  },
  {
    question: "“You’re new.”",
    answer:
      "The software is. The supply, the payments and the engineering are the Tabhi group, which already reaches 125M+ travelers across 500+ airlines and 2M+ properties, and distributes through 65,000 travel businesses.",
  },
] as const;

export const whyMiraeeClosing = {
  title: "Experience agentic travel.",
  body: "Bring a real trip, a real policy and a real route. Twenty minutes.",
  cta: "Request a Demo",
};
