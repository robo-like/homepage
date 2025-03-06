import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { posts, analytics } from './schema';
import { eq, desc, asc, and, lte, gte } from 'drizzle-orm';
import path from 'path';

// Initialize database connection
const sqlite = new Database(path.join(process.cwd(), 'data/database.sqlite'));
export const db = drizzle(sqlite);

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
        const existing = await db.select()
            .from(posts)
            .where(eq(posts.slug, data.slug))
            .get();

        if (existing) {
            throw new Error('A post with this slug already exists');
        }

        return db.insert(posts).values(data);
    },

    async delete(id: string) {
        return db.delete(posts).where(eq(posts.id, id));
    },

    async getPosts({
        limit = 10,
        offset = 0,
        orderBy = 'desc'
    }: {
        limit?: number;
        offset?: number;
        orderBy?: 'asc' | 'desc';
    }) {
        const maxLimit = Math.min(limit, 100);
        return db.select().from(posts)
            .orderBy(orderBy === 'desc' ? desc(posts.createdAt) : asc(posts.createdAt))
            .limit(maxLimit)
            .offset(offset);
    },

    async getBySlug(slug: string) {
        if (!slug) {
            return null;
        }

        return db.select()
            .from(posts)
            .where(eq(posts.slug, slug))
            .get();
    },

    /** this is the previous slug */
    async updateBySlug(slug: string, data: {
        title?: string;
        slug?: string;
        body?: string;
        author?: string;
        summary?: string;
        seoTitle?: string;
        seoDescription?: string;
        seoImage?: string;
    }) {
        if (!slug) {
            throw new Error('Slug is required');
        }

        // If slug is being updated, check for conflicts
        if (data.slug && data.slug !== slug) {
            const existing = await db.select()
                .from(posts)
                .where(and(
                    eq(posts.slug, data.slug)
                ))
                .get();

            if (existing) {
                throw new Error('A post with this slug already exists');
            }
        }

        return db.update(posts)
            .set(data)
            .where(eq(posts.slug, slug));
    }
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
            eventType: 'productEvent',
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
    }
};
