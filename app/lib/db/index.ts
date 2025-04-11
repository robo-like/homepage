import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import {
  posts,
  analytics,
  users,
  activeSessions,
  expiringEmailKeys,
  subscriptions,
  supportTickets,
} from "./schema";
import { eq, desc, asc, and, lte, gte, gt, isNull } from "drizzle-orm";

// Initialize Turso database connection
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(turso);

// Post Management Functions
export const postQueries = {
  async create(data: {
    title: string;
    slug: string;
    body: string;
    author: string;
    summary: string;
    seoTitle?: string;
    seoDescription?: string;
    seoImage?: string;
  }) {
    // Check if slug exists first
    const existing = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, data.slug))
      .get();

    if (existing) {
      throw new Error("A post with this slug already exists");
    }

    return db.insert(posts).values(data);
  },

  async delete(id: string) {
    return db.delete(posts).where(eq(posts.id, id));
  },

  async getPosts({
    limit = 10,
    offset = 0,
    orderBy = "desc",
  }: {
    limit?: number;
    offset?: number;
    orderBy?: "asc" | "desc";
  }) {
    const maxLimit = Math.min(limit, 100);
    return db
      .select()
      .from(posts)
      .orderBy(
        orderBy === "desc" ? desc(posts.createdAt) : asc(posts.createdAt)
      )
      .limit(maxLimit)
      .offset(offset);
  },

  async getBySlug(slug: string) {
    if (!slug) {
      return null;
    }

    return db.select().from(posts).where(eq(posts.slug, slug)).get();
  },

  /** this is the previous slug */
  async updateBySlug(
    slug: string,
    data: {
      title?: string;
      slug?: string;
      body?: string;
      author?: string;
      summary?: string;
      seoTitle?: string;
      seoDescription?: string;
      seoImage?: string;
    }
  ) {
    if (!slug) {
      throw new Error("Slug is required");
    }

    // If slug is being updated, check for conflicts
    if (data.slug && data.slug !== slug) {
      const existing = await db
        .select()
        .from(posts)
        .where(and(eq(posts.slug, data.slug)))
        .get();

      if (existing) {
        throw new Error("A post with this slug already exists");
      }
    }

    return db.update(posts).set(data).where(eq(posts.slug, slug));
  },
};

// Analytics Functions
export const analyticsQueries = {
  async createPageView({
    sessionId,
    path,
    eventType,
    eventValue,
    ipAddress,
    description,
    userAgent,
    userId,
  }: {
    sessionId: string;
    path: string;
    eventType: string;
    eventValue?: string;
    ipAddress?: string;
    description?: string;
    userAgent?: string;
    userId?: string;
  }) {
    return db.insert(analytics).values({
      eventType,
      sessionId,
      path,
      eventValue,
      ipAddress,
      description,
      userAgent,
      userId,
    });
  },

  async createProductEvent({
    sessionId,
    eventValue,
    description,
    userId,
    path,
  }: {
    sessionId: string;
    eventValue: string;
    description: string;
    userId?: string;
    path: string;
  }) {
    return db.insert(analytics).values({
      eventType: "productEvent",
      sessionId,
      eventValue,
      description,
      userId,
      path,
    });
  },

  async queryEvents({
    path,
    startDate,
    endDate,
    eventType,
    limit = 100,
  }: {
    path?: string;
    startDate?: Date;
    endDate?: Date;
    eventType?: string;
    limit?: number;
  }) {
    let query = db.select().from(analytics);

    if (path) query = query.where(eq(analytics.path, path));
    if (eventType) query = query.where(eq(analytics.eventType, eventType));
    if (startDate) query = query.where(gte(analytics.createdAt, startDate));
    if (endDate) query = query.where(lte(analytics.createdAt, endDate));

    return query.limit(limit).orderBy(desc(analytics.createdAt));
  },
};

// Authentication Queries
export const authQueries = {
  // User operations
  async getUserByEmail(email: string) {
    return db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .get();
  },

  async getUserById(id: string) {
    return db.select().from(users).where(eq(users.id, id)).get();
  },

  async createUser(data: {
    email: string;
    name?: string;
    role?: "user" | "admin";
    stripeCustomerId?: string;
  }) {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email.toLowerCase()))
      .get();

    if (existingUser) {
      return existingUser;
    }

    const result = await db
      .insert(users)
      .values({
        email: data.email.toLowerCase(),
        name: data.name,
        role: data.role || "user",
        stripeCustomerId: data.stripeCustomerId,
      })
      .returning();

    return result[0];
  },

  async updateUser(
    id: string,
    data: {
      name?: string;
      stripeCustomerId?: string;
    }
  ) {
    return db.update(users).set(data).where(eq(users.id, id)).returning();
  },

  // Session operations
  async createSession(data: { id: string; userId?: string; expiresAt: Date }) {
    return db
      .insert(activeSessions)
      .values({
        id: data.id,
        userId: data.userId,
        expiresAt: data.expiresAt,
      })
      .returning();
  },

  async getSession(id: string) {
    return db
      .select()
      .from(activeSessions)
      .where(
        and(eq(activeSessions.id, id), gt(activeSessions.expiresAt, new Date()))
      )
      .get();
  },

  async updateSession(
    id: string,
    data: {
      userId?: string;
      expiresAt?: Date;
    }
  ) {
    return db.update(activeSessions).set(data).where(eq(activeSessions.id, id));
  },

  async deleteSession(id: string) {
    return db.delete(activeSessions).where(eq(activeSessions.id, id));
  },

  async deleteUserSessions(userId: string) {
    return db.delete(activeSessions).where(eq(activeSessions.userId, userId));
  },

  // Magic link operations
  async createEmailKey(data: { key: string; userId: string; expiresAt: Date }) {
    return db
      .insert(expiringEmailKeys)
      .values({
        key: data.key,
        userId: data.userId,
        expiresAt: data.expiresAt,
        utilized: false,
      })
      .returning();
  },

  async getEmailKey(key: string) {
    return db
      .select()
      .from(expiringEmailKeys)
      .where(
        and(
          eq(expiringEmailKeys.key, key),
          eq(expiringEmailKeys.utilized, false),
          gt(expiringEmailKeys.expiresAt, new Date())
        )
      )
      .get();
  },

  async markEmailKeyAsUtilized(id: string) {
    return db
      .update(expiringEmailKeys)
      .set({ utilized: true })
      .where(eq(expiringEmailKeys.id, id));
  },

  // Subscription operations
  async getActiveSubscription(userId: string) {
    return db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, "active")
        )
      )
      .get();
  },
  
  async getSubscriptionByStripeId(stripeSubscriptionId: string) {
    return db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
      .get();
  },

  async getAllUserSubscriptions(userId: string) {
    return db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt));
  },

  async createSubscription(data: {
    userId: string;
    stripeSubscriptionId: string;
    priceId?: string;
    status?: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
  }) {
    return db
      .insert(subscriptions)
      .values({
        userId: data.userId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        priceId: data.priceId,
        status: data.status || "active",
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
      })
      .returning();
  },

  async updateSubscription(
    stripeSubscriptionId: string,
    data: {
      status?: string;
      currentPeriodStart?: Date;
      currentPeriodEnd?: Date;
    }
  ) {
    return db
      .update(subscriptions)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
      .returning();
  },

  async cancelSubscription(stripeSubscriptionId: string) {
    return db
      .update(subscriptions)
      .set({
        status: "canceled",
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
      .returning();
  },

  async getUsersWithoutStripeCustomer() {
    return db.select().from(users).where(isNull(users.stripeCustomerId));
  },
};

// Support ticket queries
export const supportQueries = {
  // Create a new support ticket
  async createTicket(data: {
    userId: string;
    subject: string;
    message: string;
    status?: string;
  }) {
    return db
      .insert(supportTickets)
      .values({
        userId: data.userId,
        subject: data.subject,
        message: data.message,
        status: data.status || "OPEN",
      })
      .returning();
  },

  // Get all tickets for a user
  async getUserTickets(userId: string) {
    return db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.userId, userId))
      .orderBy(desc(supportTickets.createdAt));
  },

  // Get a specific ticket by ID
  async getTicketById(id: string) {
    return db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.id, id))
      .get();
  },

  // Update a ticket's status
  async updateTicketStatus(id: string, status: string) {
    return db
      .update(supportTickets)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(supportTickets.id, id))
      .returning();
  },

  // Get all tickets (admin only)
  async getAllTickets({
    limit = 50,
    offset = 0,
    status,
  }: {
    limit?: number;
    offset?: number;
    status?: string;
  } = {}) {
    let query = db.select().from(supportTickets);
    
    if (status) {
      query = query.where(eq(supportTickets.status, status));
    }
    
    return query
      .orderBy(desc(supportTickets.createdAt))
      .limit(limit)
      .offset(offset);
  },
};
