# Database Documentation

This folder contains the database schema and queries for the application using Drizzle ORM with SQLite.

## Tables

### Posts

Stores blog posts and their associated metadata:

- Primary content (title, body, summary)
- SEO information (title, description, image)
- Metadata (author, creation date)

### Analytics

Tracks user interactions and page metrics:

- Page views
- Product events (downloads, etc.)
- Session and user information
- Temporal data

## Running Migrations

1. First install dependencies:

```bash
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit
```

2. Then run the migration:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Querying the Database

To query the database, you can use the `db` object imported from `index.ts`.

Example:

```ts
const posts = await db.select().from(posts);
```

## Using the Query Helpers

### Posts

```ts
import { postQueries } from "~/lib/db";

// Create a new post
await postQueries.create({
  title: "My First Post",
  slug: "my-first-post",
  body: "Content here...",
  author: "John Doe",
  summary: "A brief summary",
});

// Get recent posts
const recentPosts = await postQueries.getPosts({
  limit: 10,
  orderBy: "desc",
});
```

### Analytics

```ts
import { analyticsQueries } from "~/lib/db";

// Track a page view
await analyticsQueries.createPageView({
  sessionId: "session123",
  path: "/blog/my-first-post",
  ipAddress: "127.0.0.1",
});

// Track a product event
await analyticsQueries.createProductEvent({
  sessionId: "session123",
  eventValue: "windows",
  description: "User downloaded Windows client",
  path: "/downloads",
});

// Query analytics
const pageViews = await analyticsQueries.queryEvents({
  path: "/blog",
  eventType: "pageView",
  startDate: new Date("2024-01-01"),
  limit: 50,
});
```
