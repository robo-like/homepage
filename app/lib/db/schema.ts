import {
    sqliteTable,
    text,
    integer,
    uniqueIndex
} from "drizzle-orm/sqlite-core";
import { randomUUID } from 'crypto';

// Posts table for managing blog content
export const posts = sqliteTable('posts', {
    // Unique identifier using CUID for better performance than UUID
    id: text('id').primaryKey().notNull().$defaultFn(() => randomUUID()),

    // SEO and content fields
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    summary: text('summary').notNull(),
    body: text('body').notNull(),

    // Meta information
    author: text('author').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date()),

    // SEO specific fields
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    seoImage: text('seo_image'),
}, (table) => [
    uniqueIndex('slug_idx').on(table.slug),
]);

// Analytics table for tracking user behavior and page metrics
export const analytics = sqliteTable('analytics', {
    // Unique identifier for each event
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),

    // Session and user tracking
    sessionId: text('session_id').notNull(),
    userId: text('user_id'),

    // Event information
    eventType: text('event_type').notNull(), // 'pageView', 'download', etc.
    path: text('path').notNull(),

    // Client information
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),

    // Event details
    description: text('description'),
    eventValue: text('event_value'), // For storing additional event data (e.g., 'windows', 'linux')

    // Timestamp
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date()),
});
