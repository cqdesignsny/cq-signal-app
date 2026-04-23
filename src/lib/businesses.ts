export type Integration =
  | "ga4"
  | "google-ads"
  | "meta-ads"
  | "meta-organic"
  | "instagram"
  | "shopify"
  | "klaviyo"
  | "omnisend"
  | "typeform"
  | "vagaro"
  | "boulevard"
  | "booksy"
  | "housecall-pro";

export const integrationLabels: Record<Integration, string> = {
  "ga4": "Google Analytics 4",
  "google-ads": "Google Ads",
  "meta-ads": "Meta Ads",
  "meta-organic": "Meta (Facebook + Instagram organic)",
  "instagram": "Instagram",
  "shopify": "Shopify",
  "klaviyo": "Klaviyo",
  "omnisend": "Omnisend",
  "typeform": "Typeform",
  "vagaro": "Vagaro",
  "boulevard": "Boulevard",
  "booksy": "Booksy",
  "housecall-pro": "HouseCall Pro",
};

export type Business = {
  slug: string;
  name: string;
  shortName?: string;
  tagline: string;
  vertical: string;
  integrations: Integration[];
};

export const businesses: Business[] = [
  {
    slug: "hudson-valley-office-furniture",
    name: "Hudson Valley Office Furniture",
    shortName: "HVOF",
    tagline: "Commercial office furniture, Hudson Valley NY",
    vertical: "Commercial B2B",
    integrations: [
      "ga4",
      "meta-ads",
      "meta-organic",
      "instagram",
      "omnisend",
      "typeform",
    ],
  },
  {
    slug: "tz-electric",
    name: "TZ Electric",
    shortName: "TZ",
    tagline: "Electrical contractor",
    vertical: "Home services",
    integrations: ["ga4", "meta-ads", "google-ads", "housecall-pro"],
  },
  {
    slug: "level-aesthetics",
    name: "Level Aesthetics",
    shortName: "Level",
    tagline: "Aesthetics and skin care",
    vertical: "Aesthetics",
    integrations: ["ga4", "meta-ads", "meta-organic", "instagram", "omnisend"],
  },
  {
    slug: "advanced-skin-med-spa",
    name: "Advanced Skin Med Spa",
    shortName: "Advanced",
    tagline: "Medical aesthetics",
    vertical: "Med spa",
    integrations: ["ga4", "meta-ads", "meta-organic", "instagram", "klaviyo"],
  },
  {
    slug: "wrecktified-paint-and-collision",
    name: "Wrecktified Paint and Collision",
    shortName: "Wrecktified",
    tagline: "Auto body and collision repair",
    vertical: "Auto services",
    integrations: ["ga4", "meta-ads", "google-ads"],
  },
];

export function getBusiness(slug: string): Business | undefined {
  return businesses.find((b) => b.slug === slug);
}
