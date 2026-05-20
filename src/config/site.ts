export const siteConfig = {
  // Entity (always the same)
  entity: {
    name: "Jeremy Bouznah LTD",
    brand: "ORRTYL",
    siret: "517110912",
    address: "81 Rue Shahal, Jérusalem",
    type: "Private Limited Company",
  },

  // Client (filled per project by the prompt — hardcoded, no env)
  client: {
    name: "Template Client",
    logo: "/logo.png",
    tagline: "Accompagnement 360 — Stratégie, Digital & Croissance",
    sector: "Consulting",
    location: "Jérusalem",
    reunionDate: "20 mai 2026",
    reunionDuration: "2h30",
  },

  // Colors (customizable per client — hardcoded, no env)
  colors: {
    primary: "#4F38E0",
    secondary: "#6C5CE7",
    accent: "#FF6B00",
  },

  // Languages
  languages: {
    primary: "fr" as const,
    secondary: null as "he" | null, // Set to "he" if bilingual
  },

  // Enabled optional pages
  pages: {
    comptesRendus: true,
    suiviTemps: true,
    arbitrages: true,
    verbatims: false,
    demoInteractive: false,
    cdcTechnique: false,
    signaturesElectroniques: false,
    ecosystemeJuridique: false,
  },
};

export type SiteConfig = typeof siteConfig;
