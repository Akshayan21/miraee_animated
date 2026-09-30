export const connectedSystemsIntro = {
  eyebrow: "Connected systems",
  title: "Fits the systems you already run.",
  lede: "No rip-and-replace required. Miraee runs alongside your current infrastructure.",
};

// `accent` reuses existing palette tokens rather than introducing new
// colours per status — green for "handled automatically", blue for "no
// upkeep needed", brand orange for "lives inside tools people already use".
export const connectedSystemsRows = [
  {
    index: "01",
    label: "Identity",
    systems: "SSO, SAML, SCIM, Okta, Entra",
    body: "Provisions and deprovisions travelers automatically. No orphaned accounts.",
    pill: "Auto-provisioned",
    accent: "var(--color-mi-green-text)",
  },
  {
    index: "02",
    label: "People",
    systems: "HRIS",
    body: "Grades, entities, cost centres and managers stay current without manual upkeep.",
    pill: "Zero upkeep",
    accent: "var(--color-mi-blue-text)",
  },
  {
    index: "03",
    label: "Finance",
    systems: "ERP, accounting, card networks",
    body: "Coded expenses post directly, card spend is managed automatically, and accounts payable reconciles at source.",
    pill: "Source reconciled",
    accent: "var(--color-mi-green-text)",
  },
  {
    index: "04",
    label: "Work",
    systems: "Calendar, email, chat",
    body: "Itineraries and changes appear where people already work.",
    pill: "Native in-app",
    accent: "var(--color-brand)",
  },
] as const;

export const connectedSystemsLink = { label: "Unified API and developer sandbox", href: "/ai-technology" };
