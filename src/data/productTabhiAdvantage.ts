export const tabhiAdvantageIntro = {
  eyebrow: "The Tabhi advantage",
  title: "Global reach. Personal execution.",
  lede: "Miraee runs on the group's own supply, distributed through Mondee One. That inventory is wholesale contracts, direct connections and hyperlocal content that nobody else has digitized.",
};

// A departures hall rather than a tourist landmark — this section is about
// global airline/hotel network reach and supply infrastructure, not
// sightseeing, so the image should read as "travel at scale" not "a nice
// destination". A temple photo (previous asset) looked good but had no
// connection to wholesale contracts, hotel/airline supply or network reach.
export const tabhiAdvantageImage = {
  src: "https://images.unsplash.com/photo-1695510757259-643081efedf0?auto=format&fit=crop&w=1800&q=75",
  alt: "Travelers with luggage walking past check-in and gate departure boards at an international airport",
};

// `target`/`suffix` split out from the display value so each stat can count
// up on reveal rather than just appearing — same technique already used for
// the savings stat in SavingsFlywheel, not a new motif.
export const tabhiAdvantageStats = [
  {
    index: "01",
    label: "Global content",
    body: "Millions of hotels and airline partners, sourced through direct connections and wholesale agreements rather than resold inventory.",
    target: 2,
    suffix: "M+ hotels",
  },
  {
    index: "02",
    label: "Wholesale economics",
    body: "Negotiated rates that travel with the trip, applied automatically at booking rather than claimed back later.",
    target: 500,
    suffix: "+ airlines",
  },
  {
    index: "03",
    label: "Reach",
    body: "The Tabhi network already serves a traveler base at global scale. That volume is what makes the rates possible.",
    target: 125,
    suffix: "M+ travelers",
  },
  {
    index: "04",
    label: "Local experiences",
    body: "Festivals, performances, markets and makers. Content no corporate channel has ever carried.",
    target: 10,
    suffix: "M+ experiences",
  },
] as const;

export const tabhiAdvantageClosing = {
  prefix: "Most platforms compete on software. ",
  highlight: "We compete on software and supply.",
};
