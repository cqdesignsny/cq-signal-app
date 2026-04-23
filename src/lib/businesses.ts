export type Integration =
  | "ga4"
  | "google-ads"
  | "meta-ads"
  | "facebook"
  | "instagram"
  | "linkedin"
  | "tiktok"
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
  "facebook": "Facebook",
  "instagram": "Instagram",
  "linkedin": "LinkedIn",
  "tiktok": "TikTok",
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
      "facebook",
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
    integrations: ["ga4", "meta-ads", "facebook", "instagram", "omnisend"],
  },
  {
    slug: "advanced-skin-med-spa",
    name: "Advanced Skin Med Spa",
    shortName: "Advanced",
    tagline: "Medical aesthetics",
    vertical: "Med spa",
    integrations: ["ga4", "meta-ads", "facebook", "instagram", "klaviyo"],
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

type ChannelConfig = {
  label: string;
  source: string;
  primary: { label: string; value: string };
  secondary: { label: string; value: string }[];
};

export const channelCards: Record<Integration, ChannelConfig> = {
  "ga4": {
    label: "Website",
    source: "GA4",
    primary: { label: "Sessions", value: "—" },
    secondary: [
      { label: "Top landing", value: "—" },
      { label: "Avg. session", value: "—" },
    ],
  },
  "google-ads": {
    label: "Google Ads",
    source: "Google Ads",
    primary: { label: "Ad spend", value: "$—" },
    secondary: [
      { label: "CPC", value: "$—" },
      { label: "CTR", value: "—%" },
    ],
  },
  "meta-ads": {
    label: "Meta Ads",
    source: "Meta Ads",
    primary: { label: "Ad spend", value: "$—" },
    secondary: [
      { label: "Leads", value: "—" },
      { label: "CPL", value: "$—" },
    ],
  },
  "facebook": {
    label: "Facebook",
    source: "Facebook",
    primary: { label: "Posts this week", value: "—" },
    secondary: [
      { label: "Engagement", value: "—" },
      { label: "Reach", value: "—" },
    ],
  },
  "instagram": {
    label: "Instagram",
    source: "Instagram",
    primary: { label: "Followers", value: "—" },
    secondary: [
      { label: "Posts", value: "—" },
      { label: "Engagement", value: "—" },
    ],
  },
  "linkedin": {
    label: "LinkedIn",
    source: "LinkedIn",
    primary: { label: "Posts this week", value: "—" },
    secondary: [
      { label: "Reactions", value: "—" },
      { label: "Followers", value: "—" },
    ],
  },
  "tiktok": {
    label: "TikTok",
    source: "TikTok",
    primary: { label: "Views", value: "—" },
    secondary: [
      { label: "Posts", value: "—" },
      { label: "Engagement", value: "—" },
    ],
  },
  "shopify": {
    label: "Shopify",
    source: "Shopify",
    primary: { label: "Revenue", value: "$—" },
    secondary: [
      { label: "Orders", value: "—" },
      { label: "AOV", value: "$—" },
    ],
  },
  "klaviyo": {
    label: "Email",
    source: "Klaviyo",
    primary: { label: "Open rate", value: "—%" },
    secondary: [
      { label: "CTR", value: "—%" },
      { label: "Sent", value: "—" },
    ],
  },
  "omnisend": {
    label: "Email",
    source: "Omnisend",
    primary: { label: "Open rate", value: "—%" },
    secondary: [
      { label: "Click-through", value: "—%" },
      { label: "Sent", value: "—" },
    ],
  },
  "typeform": {
    label: "Leads",
    source: "Typeform",
    primary: { label: "New leads", value: "—" },
    secondary: [
      { label: "Conversion", value: "—%" },
      { label: "Avg. time", value: "—" },
    ],
  },
  "vagaro": {
    label: "Bookings",
    source: "Vagaro",
    primary: { label: "Appointments", value: "—" },
    secondary: [
      { label: "Revenue", value: "$—" },
      { label: "New clients", value: "—" },
    ],
  },
  "boulevard": {
    label: "Bookings",
    source: "Boulevard",
    primary: { label: "Appointments", value: "—" },
    secondary: [
      { label: "Revenue", value: "$—" },
      { label: "Retention", value: "—%" },
    ],
  },
  "booksy": {
    label: "Bookings",
    source: "Booksy",
    primary: { label: "Appointments", value: "—" },
    secondary: [
      { label: "Revenue", value: "$—" },
      { label: "New clients", value: "—" },
    ],
  },
  "housecall-pro": {
    label: "Jobs",
    source: "HouseCall Pro",
    primary: { label: "Jobs closed", value: "—" },
    secondary: [
      { label: "Revenue", value: "$—" },
      { label: "Avg. ticket", value: "$—" },
    ],
  },
};

type ChannelDetailSection = { title: string; description: string };

export const channelDetails: Record<
  Integration,
  { title: string; description: string; sections: ChannelDetailSection[] }
> = {
  "ga4": {
    title: "Website performance",
    description: "Full GA4 view: where visitors come from, what pages they land on, how they move through the site, and what gets them to convert.",
    sections: [
      { title: "Sessions over time", description: "Daily, weekly, and monthly session totals with period-over-period comparison." },
      { title: "Top landing pages", description: "Which pages capture the most entries and their engagement rate." },
      { title: "Traffic sources", description: "Organic search, direct, referral, social, paid — what's driving traffic." },
      { title: "Top keywords", description: "Best performing queries from Google Search Console." },
      { title: "User flow", description: "How visitors move through the site from landing to conversion." },
      { title: "Device + geo", description: "Desktop vs mobile, top regions, browsers." },
    ],
  },
  "google-ads": {
    title: "Google Ads performance",
    description: "Campaign spend, clicks, conversions, and cost-per-conversion across all active Google Ads campaigns.",
    sections: [
      { title: "Spend vs conversions", description: "Daily spend and conversions with trend." },
      { title: "Top campaigns", description: "Best performing campaigns by conversion volume and CPA." },
      { title: "Keyword performance", description: "Which keywords drive conversions and at what cost." },
      { title: "Ad copy + creative", description: "Which ads get clicked the most." },
    ],
  },
  "meta-ads": {
    title: "Meta Ads performance",
    description: "Facebook and Instagram paid campaigns. Spend, leads, cost per lead, and which creative is working.",
    sections: [
      { title: "Spend vs leads", description: "Daily ad spend against leads generated." },
      { title: "Best performing creative", description: "Top ads by CTR and conversions, with previews." },
      { title: "Audience breakdown", description: "Who's engaging with your ads by age, gender, placement." },
      { title: "Campaign detail", description: "Per-campaign metrics with period comparison." },
    ],
  },
  "facebook": {
    title: "Facebook (organic)",
    description: "Page posts, reach, engagement, and follower growth. Only organic content, no paid boosts.",
    sections: [
      { title: "Post reach + engagement", description: "How each post performed organically." },
      { title: "Follower growth", description: "Net followers added or lost per period." },
      { title: "Top posts", description: "Best performing posts this period with engagement rates." },
      { title: "Audience demographics", description: "Age, gender, top cities." },
    ],
  },
  "instagram": {
    title: "Instagram",
    description: "Posts, reels, stories, follower growth, engagement. Everything from the content you're putting out.",
    sections: [
      { title: "Follower growth", description: "New followers per period, retention, peak days." },
      { title: "Top posts + reels", description: "Best performing content by reach and engagement." },
      { title: "Stories", description: "Completion rate, taps forward, replies." },
      { title: "Audience demographics", description: "Age, gender, top cities, active times." },
    ],
  },
  "linkedin": {
    title: "LinkedIn",
    description: "Company page posts, reactions, follower growth, and audience mix. Where B2B signal lives.",
    sections: [
      { title: "Post reach + engagement", description: "How each post performed organically." },
      { title: "Reactions breakdown", description: "Likes, celebrates, supports, insightful, loves." },
      { title: "Follower growth", description: "Net followers per period with industry and seniority mix." },
      { title: "Top posts", description: "Best performing posts with engagement rate." },
      { title: "Company page visits", description: "Visitor count, traffic sources, peak hours." },
    ],
  },
  "tiktok": {
    title: "TikTok",
    description: "Video performance, follower growth, and audience insights. TikTok Shop data when the shop is connected.",
    sections: [
      { title: "Video performance", description: "Views, likes, shares, comments per post." },
      { title: "Top videos", description: "Best performing videos this period." },
      { title: "Follower growth", description: "New followers and retention." },
      { title: "Audience demographics", description: "Age, gender, top regions, active times." },
      { title: "TikTok Shop", description: "Product views, add-to-carts, orders, revenue — when shop is connected." },
    ],
  },
  "shopify": {
    title: "Shopify revenue",
    description: "Orders, revenue, AOV, top products, and return customers.",
    sections: [
      { title: "Revenue over time", description: "Daily revenue with trend." },
      { title: "Top products", description: "Best sellers by revenue and units." },
      { title: "New vs returning", description: "Customer breakdown and retention." },
      { title: "Discount impact", description: "How much revenue came from discounts or promos." },
    ],
  },
  "klaviyo": {
    title: "Klaviyo email performance",
    description: "Campaign open rates, click-through rates, list growth, and top performing sends.",
    sections: [
      { title: "Open + CTR over time", description: "Trending email engagement." },
      { title: "Top campaigns", description: "Best performing sends by open and click rate." },
      { title: "List growth", description: "Subscribers gained vs unsubscribed." },
      { title: "Revenue from email", description: "Attributed revenue from Klaviyo flows and campaigns." },
    ],
  },
  "omnisend": {
    title: "Omnisend email performance",
    description: "Campaign open rates, click-through rates, list growth, and top performing sends.",
    sections: [
      { title: "Open + CTR over time", description: "Trending email engagement." },
      { title: "Top campaigns", description: "Best performing sends by open and click rate." },
      { title: "List growth", description: "Subscribers gained vs unsubscribed." },
      { title: "Automations", description: "Welcome series, abandoned cart, and other automated flows." },
    ],
  },
  "typeform": {
    title: "Typeform leads",
    description: "Individual lead submissions with names and contact info, conversion rate by form, response times.",
    sections: [
      { title: "Lead list", description: "Names, emails, and any answers submitted this period." },
      { title: "Conversion rate by form", description: "Which forms convert visitors best." },
      { title: "Drop-off points", description: "Which questions cause people to abandon the form." },
      { title: "Source attribution", description: "Which channels sent the leads." },
    ],
  },
  "vagaro": {
    title: "Vagaro bookings",
    description: "Appointments, revenue, client retention, and service mix.",
    sections: [
      { title: "Bookings over time", description: "Appointments per day, week, month." },
      { title: "Revenue by service", description: "Which services drive the most revenue." },
      { title: "New vs returning clients", description: "Client retention and acquisition." },
      { title: "No-show + cancellation", description: "Trends worth watching." },
    ],
  },
  "boulevard": {
    title: "Boulevard bookings",
    description: "Appointments, revenue, client retention, and service mix.",
    sections: [
      { title: "Bookings over time", description: "Appointments per day, week, month." },
      { title: "Revenue by service", description: "Which services drive the most revenue." },
      { title: "Client lifetime value", description: "Average revenue per client." },
      { title: "Staff performance", description: "Bookings and revenue by provider." },
    ],
  },
  "booksy": {
    title: "Booksy bookings",
    description: "Appointments, revenue, and client acquisition.",
    sections: [
      { title: "Bookings over time", description: "Appointments per day, week, month." },
      { title: "Revenue by service", description: "Which services drive the most revenue." },
      { title: "New clients", description: "Where new clients are coming from." },
    ],
  },
  "housecall-pro": {
    title: "HouseCall Pro jobs",
    description: "Jobs closed, revenue, average ticket, and client breakdown.",
    sections: [
      { title: "Jobs + revenue over time", description: "Volume and revenue trend by period." },
      { title: "Top service types", description: "Which jobs generate the most revenue." },
      { title: "Client list", description: "Names, job count, lifetime value per client." },
      { title: "Which clients are closing", description: "Conversion rate from estimate to closed job." },
    ],
  },
};
