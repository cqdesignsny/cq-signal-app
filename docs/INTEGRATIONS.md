# Integration catalog

Every channel Signal can report on. Each integration has a hero card on the business detail page and a drill-in page with deeper data sections.

The catalog lives in `src/lib/businesses.ts` as the `Integration` type plus `channelCards` and `channelDetails` records. To add a new integration, extend all three and the drill-in page auto-renders.

## Analytics

**Google Analytics 4 (`ga4`).** Website performance. Sessions, top landing pages, traffic sources, keywords, user flow, device and geography.

## Advertising

**Google Ads (`google-ads`).** Spend vs conversions, top campaigns, keyword performance, ad creative.

**Meta Ads (`meta-ads`).** Facebook and Instagram paid. Spend, leads, cost per lead, best creative, audience breakdown, campaign detail.

## Organic social

**Facebook (`facebook`).** Company page posts, reach, engagement, follower growth, audience demographics.

**Instagram (`instagram`).** Posts, reels, stories, follower growth, engagement, audience demographics.

**LinkedIn (`linkedin`).** Company page posts, reactions breakdown, follower growth by industry and seniority, top posts, page visits.

**TikTok (`tiktok`).** Video performance, top videos, follower growth, audience demographics. TikTok Shop metrics when shop is connected.

## Email

**Klaviyo (`klaviyo`).** Open and click rates over time, top campaigns, list growth, revenue attribution.

**Omnisend (`omnisend`).** Open and click rates over time, top campaigns, list growth, automations.

## Ecommerce

**Shopify (`shopify`).** Revenue over time, top products, new vs returning customers, discount impact.

## Lead capture

**Typeform (`typeform`).** New leads with names and contact info, conversion rate by form, drop-off points, source attribution.

## Bookings (service businesses)

**Vagaro (`vagaro`).** Appointments, revenue by service, new vs returning clients, no-shows.

**Boulevard (`boulevard`).** Appointments, revenue by service, client lifetime value, staff performance.

**Booksy (`booksy`).** Appointments, revenue by service, new clients by source.

## Field services

**HouseCall Pro (`housecall-pro`).** Jobs closed, revenue, average ticket, client list, conversion from estimate to closed job.

## Planned integrations

- Google Search Console (search terms, impressions, rankings).
- Stripe (subscription metrics, MRR).
- HubSpot (CRM pipeline).
- Salesforce (enterprise CRM).
- Rank tracking (SEMrush, Ahrefs, native).

## How integrations connect (planned)

1. User clicks **Add integration** on a business profile page.
2. OAuth flow for the provider, or API key entry if the provider doesn't support OAuth.
3. Credentials encrypted at rest via Vercel-managed KMS.
4. Initial sync pulls the last 12 months of history.
5. Incremental sync runs every 15 to 60 minutes depending on provider rate limits.
6. Metrics normalize into `metrics_raw` then roll up into `metrics_daily`.

Implementation lands after the database layer.
