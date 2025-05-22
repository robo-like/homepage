import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/sqlite-core";

// Posts table for managing blog content
export const posts = sqliteTable(
  "posts",
  {
    // Unique identifier using CUID for better performance than UUID
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),

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
    .$defaultFn(() => crypto.randomUUID()),

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
      .$defaultFn(() => crypto.randomUUID()),

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
    .$defaultFn(() => crypto.randomUUID()),

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
    .$defaultFn(() => crypto.randomUUID()),

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

// Support tickets table for user inquiries and support requests
export const supportTickets = sqliteTable(
  "support_tickets",
  {
    // Unique identifier
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),

    // User who created the ticket
    userId: text("user_id").notNull(),

    // Ticket content
    subject: text("subject").notNull(),
    message: text("message").notNull(),

    // Status tracking: OPEN, CLOSED, IN_PROGRESS
    status: text("status").notNull().default("OPEN"),

    // Timestamps
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("idx_support_tickets_user_id").on(table.userId),
    index("idx_support_tickets_status").on(table.status),
  ]
);

export const accessTokens = sqliteTable("access_tokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  token: text("token").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const contacts = sqliteTable("contacts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default([]),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

