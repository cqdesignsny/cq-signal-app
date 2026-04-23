import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Workspaces are tenant roots. For CQ internal use, there is one workspace.
// For SaaS later, every customer gets their own.
export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Users are Clerk-linked. One user can belong to one workspace (for now).
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: varchar("clerk_id", { length: 128 }).notNull().unique(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    name: text("name"),
    role: varchar("role", { length: 32 }).notNull().default("member"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("users_workspace_idx").on(table.workspaceId),
  }),
);

// Businesses are what the workspace tracks. Same shape whether single-business
// owner use or agency-managing-clients use.
export const businesses = pgTable(
  "businesses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 128 }).notNull(),
    name: text("name").notNull(),
    shortName: varchar("short_name", { length: 64 }),
    tagline: text("tagline"),
    vertical: text("vertical"),
    brandColor: varchar("brand_color", { length: 16 }),
    logoUrl: text("logo_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => ({
    workspaceSlugIdx: uniqueIndex("businesses_workspace_slug_idx").on(
      table.workspaceId,
      table.slug,
    ),
  }),
);

// One integration row per business per connected service (GA4, Meta, etc.).
export const integrations = pgTable(
  "integrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 64 }).notNull(),
    status: varchar("status", { length: 32 }).notNull().default("disconnected"),
    connectedAt: timestamp("connected_at", { withTimezone: true }),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    syncError: text("sync_error"),
    providerAccountId: text("provider_account_id"),
    providerMetadata: jsonb("provider_metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    businessTypeIdx: uniqueIndex("integrations_business_type_idx").on(
      table.businessId,
      table.type,
    ),
  }),
);

// Encrypted OAuth tokens / API keys live here. Never read to logs, never
// returned to the client. AES-GCM ciphertext (base64).
export const integrationCredentials = pgTable("integration_credentials", {
  id: uuid("id").primaryKey().defaultRandom(),
  integrationId: uuid("integration_id")
    .notNull()
    .unique()
    .references(() => integrations.id, { onDelete: "cascade" }),
  encryptedPayload: text("encrypted_payload").notNull(),
  rotatedAt: timestamp("rotated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Raw metric pulls from providers. Time-series. Rolled up later into
// metrics_daily for query performance (that table lands in a follow-up).
export const metricsRaw = pgTable(
  "metrics_raw",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    integrationType: varchar("integration_type", { length: 64 }).notNull(),
    metricKey: varchar("metric_key", { length: 128 }).notNull(),
    value: jsonb("value").notNull(),
    dimensions: jsonb("dimensions"),
    periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
    periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
    pulledAt: timestamp("pulled_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    businessPeriodIdx: index("metrics_raw_business_period_idx").on(
      table.businessId,
      table.periodStart,
      table.periodEnd,
    ),
    metricKeyIdx: index("metrics_raw_metric_key_idx").on(table.metricKey),
  }),
);

// Leads captured from Typeform, Meta lead ads, form integrations. PII columns
// are encrypted at rest. Use Signal's decrypt helper to read, never SELECT
// plaintext.
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    source: varchar("source", { length: 64 }).notNull(),
    externalId: text("external_id"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull(),
    encryptedName: text("encrypted_name"),
    encryptedEmail: text("encrypted_email"),
    encryptedPhone: text("encrypted_phone"),
    fields: jsonb("fields"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    businessSubmittedIdx: index("leads_business_submitted_idx").on(
      table.businessId,
      table.submittedAt,
    ),
    externalIdx: uniqueIndex("leads_source_external_idx").on(
      table.source,
      table.externalId,
    ),
  }),
);

// Reports are snapshots at generation time. Share token is the public view URL.
export const reports = pgTable(
  "reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    range: varchar("range", { length: 16 }).notNull(),
    periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
    periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
    snapshot: jsonb("snapshot").notNull(),
    shareToken: varchar("share_token", { length: 64 }).unique(),
    createdById: uuid("created_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    businessCreatedIdx: index("reports_business_created_idx").on(
      table.businessId,
      table.createdAt,
    ),
  }),
);

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Business = typeof businesses.$inferSelect;
export type NewBusiness = typeof businesses.$inferInsert;
export type Integration = typeof integrations.$inferSelect;
export type NewIntegration = typeof integrations.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
