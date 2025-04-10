import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// Posts table for managing blog content
export const posts = sqliteTable(
  "posts",
  {
    // Unique identifier using CUID for better performance than UUID
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => randomUUID()),

    // SEO and content fields
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    summary: text("summary").notNull(),
    body: text("body").notNull(),

    // Meta information
    author: text("author").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),

    // SEO specific fields
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    seoImage: text("seo_image"),
  },
  (table) => [uniqueIndex("slug_idx").on(table.slug)]
);

// Analytics table for tracking user behavior and page metrics
export const analytics = sqliteTable("analytics", {
  // Unique identifier for each event
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  // Session and user tracking
  sessionId: text("session_id").notNull(),
  userId: text("user_id"),

  // Event information
  eventType: text("event_type").notNull(), // 'pageView', 'download', etc.
  path: text("path").notNull(),

  // Client information
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),

  // Event details
  description: text("description"),
  eventValue: text("event_value"), // For storing additional event data (e.g., 'windows', 'linux')

  // Timestamp
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Users table for authentication
export const users = sqliteTable(
  "users",
  {
    // Unique identifier
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),

    // User information
    email: text("email").notNull(),
    name: text("name"),

    // Role - "user" or "admin"
    role: text("role").notNull().default("user"),

    // Stripe information
    stripeCustomerId: text("stripe_customer_id"),

    // Timestamps
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [uniqueIndex("email_idx").on(table.email)]
);

// Active sessions table
export const activeSessions = sqliteTable("active_sessions", {
  // Unique identifier (this is the cookie value)
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  // Link to user if authenticated
  userId: text("user_id"),

  // Session validity
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

// Expiring email keys for magic link auth
export const expiringEmailKeys = sqliteTable("expiring_email_keys", {
  // Unique identifier
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  // The key sent in the email
  key: text("key").notNull(),

  // The user this key is for
  userId: text("user_id").notNull(),

  // Expiration (5 minutes from creation)
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),

  // Whether this key has been used
  utilized: integer("utilized", { mode: "boolean" }).notNull().default(false),

  // When the key was created
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Subscriptions table for Stripe integration
export const subscriptions = sqliteTable("subscriptions", {
  // Unique identifier
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  // User this subscription belongs to
  userId: text("user_id").notNull(),

  // Stripe subscription information
  stripeSubscriptionId: text("stripe_subscription_id").notNull(),
  status: text("status").notNull().default("active"), // active, canceled, etc.

  // Subscription details
  priceId: text("price_id"), // Stripe price ID
  currentPeriodStart: integer("current_period_start", { mode: "timestamp" }),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }),

  // Timestamps
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
