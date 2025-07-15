# Claude Integration Guidelines

This document outlines the conventions and best practices for working with this project. Claude should follow these guidelines when assisting with development tasks.

## Jake's rules
- don't add watermarks to commit messages (thank you)

## React Router Framework Conventions

### Route Configuration
- All routes are defined in `app/routes.ts`
- Follow the existing pattern of using `route()`, `layout()`, `index()`, and `prefix()` functions
- Route configuration requires two parts:
  - URL pattern (string)
  - Path to the route module file (string)

### Route Types
1. **Standard Routes** - `route(path, component)`
   ```typescript
   route("downloads", "routes/downloads.tsx")
   ```

2. **Index Routes** - `index(component)` - Default child route with no path segment
   ```typescript
   index("routes/home.tsx")
   ```

3. **Layout Routes** - `layout(component, children)` - Create nesting without URL segments
   ```typescript
   layout("./layout.tsx", [
     // Child routes
   ])
   ```

4. **Prefix Routes** - `prefix(prefix, routes)` - Add path prefixes to multiple routes
   ```typescript
   ...prefix("auth", [
     index("routes/auth/index.tsx"),
     route("login", "routes/auth/login.tsx"),
   ])
   ```

### Dynamic Parameters
- Use colon syntax for dynamic segments: `:paramName`
- For file naming, use `$paramName` in the file path
- Example:
  ```typescript
  // In routes.ts
  route("edit-post/:slug", "routes/admin/edit-post.$slug.tsx")
  ```

### Route Module Structure
- Every route module exports a default component
- Use loaders for data fetching (server-side)
- Use actions for mutations (form submissions)
- Employ `<Outlet/>` to render nested routes

### File Organization
- Root layout is in `app/layout.tsx`
- Route components are in `app/routes/`
- Nested routes follow nested directory structure
- Feature-specific components should be placed in related directories

### Type Safety
- Use TypeScript for all route modules
- Define type-safe parameters with `/+types/` directory
- Utilize the `satisfies RouteConfig` type assertion in routes.ts

### Rendering Patterns
- Use SSR by default (configured in `react-router.config.ts`)
- Use client-side navigation for seamless transitions
- Employ proper error boundaries for route-level error handling

## Drizzle ORM with SQLite/Turso Conventions

### Database Configuration
- Connection is initialized in `app/lib/db/index.ts`
- Schema is defined in `app/lib/db/schema.ts`
- Migrations are stored in `app/lib/db/migrations`
- Configuration for Drizzle is in `drizzle.config.ts` (local) and `drizzle.config.prod.ts` (production)

### Schema Definition
- Use `sqliteTable` from `drizzle-orm/sqlite-core` for table definitions
- Follow established naming conventions:
  - Use camelCase for JavaScript/TypeScript property names
  - Use snake_case for SQLite column names
- Add indexes to improve query performance
  - Define unique indexes with `uniqueIndex()` 
  - Define regular indexes with `index()`

### Column Types and Patterns
- Use appropriate column types:
  - `text()` for string values
  - `integer({ mode: "timestamp" })` for dates
  - `integer({ mode: "boolean" })` for boolean values
- Always define primary keys with `primaryKey()`
- Use UUID for IDs with `$defaultFn(() => crypto.randomUUID())`
- Set required fields with `notNull()`
- Provide default values with `default()` or `$defaultFn()`

### Query Organization
- Group related queries into namespaced objects (e.g., `postQueries`, `analyticsQueries`, `authQueries`)
- Follow the pattern in `index.ts` when organizing queries
- Use Drizzle's query builders with type-safe operations
- Employ conditional query building for filtering (see queryEvents in analyticsQueries)

### Querying Patterns
- Use Drizzle builders for queries:
  ```typescript
  db.select().from(posts).where(eq(posts.slug, slug)).get()
  ```
- For filters, use operators from Drizzle:
  ```typescript
  import { eq, desc, asc, and, lte, gte, gt, isNull } from "drizzle-orm";
  ```
- Return data using appropriate methods:
  - `.get()` for single row
  - `.all()` for multiple rows
  - `.returning()` for insert/update operations

### Migration Workflow
- Generate migrations with `npx drizzle-kit generate`
- Apply migrations with `npx drizzle-kit migrate`
- Use statement breakpoints (`--> statement-breakpoint`) in SQL migrations
- Import `Config` from `drizzle-kit` and use `satisfies Config` for type safety

### Environment Variables
- Turso connection details stored in environment variables:
  - `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` for local development
  - `TURSO_PROD_DATABASE_URL` and `TURSO_PROD_AUTH_TOKEN` for production
- Always load environment variables with dotenv in configuration files

## Stripe Webhook Setup

### Required Environment Variables
- `STRIPE_PRIVATE_KEY` - Stripe API key for backend operations
- `STRIPE_WEBHOOK_SECRET` - Secret for validating webhook signatures
- `STRIPE_MONTHLY_PRICE_ID` - ID for the monthly subscription price

### Local Development Setup with Stripe CLI
1. Install Stripe CLI:
   - macOS: `brew install stripe/stripe-cli/stripe`
   - Other platforms: Download from https://stripe.com/docs/stripe-cli

2. Login to Stripe account:
   ```
   stripe login
   ```

3. Forward webhooks to local server:
   ```
   stripe listen --forward-to http://localhost:5173/webhook/stripe
   ```

4. The CLI will display a webhook signing secret - add this to your `.env` file:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

5. In a separate terminal, you can trigger test webhook events:
   ```
   stripe trigger checkout.session.completed
   stripe trigger customer.subscription.updated
   ```

### Staging/Production Webhook Setup
1. Go to the Stripe Dashboard Webhook page:
   - Test mode (staging): https://dashboard.stripe.com/test/webhooks
   - Live mode (production): https://dashboard.stripe.com/webhooks

2. Alternatively, use the Webhook Workbench to create webhooks with pre-selected events:
   - Test mode: https://dashboard.stripe.com/test/workbench/webhooks/create?events=checkout.session.completed%2Ccheckout.session.expired%2Ccustomer.subscription.updated%2Ccustomer.subscription.deleted
   - Live mode: https://dashboard.stripe.com/workbench/webhooks/create?events=checkout.session.completed%2Ccheckout.session.expired%2Ccustomer.subscription.updated%2Ccustomer.subscription.deleted

3. Add your endpoint URL:
   - Staging: `https://staging.yourdomain.com/webhook/stripe`
   - Production: `https://yourdomain.com/webhook/stripe`

4. Select the following events to listen for:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

5. Create the webhook and copy the signing secret

6. Add the signing secret to your environment variables:
   - For staging: Add to staging environment as `STRIPE_WEBHOOK_SECRET`
   - For production: Add to production environment as `STRIPE_WEBHOOK_SECRET`

### Webhook Handler Implementation
- Webhook routes in the application:
  - `/webhook/stripe` - Main webhook endpoint
  - `/api/stripe-webhook` - Legacy endpoint
- Both verify incoming events with `stripe.webhooks.constructEvent()`
- Handled events include:
  - `checkout.session.completed`
  - `checkout.session.expired`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run lint` - Run linting
- `npm run typecheck` - Run type checking
- `npx drizzle-kit generate` - Generate migration files
- `npx drizzle-kit migrate` - Apply migrations

## Blog Post System

### Content Structure
- Blog posts are stored in the database using the `posts` table
- Required fields for blog posts:
  - `title` - Main title of the post
  - `slug` - URL-friendly identifier (must be unique)
  - `author` - Post author name
  - `summary` - Brief description/excerpt
  - `body` - Main content (HTML from rich text editor)
- Optional SEO fields:
  - `seoTitle` - Custom SEO title
  - `seoDescription` - SEO meta description
  - `seoImage` - URL for social media image

### Content Directory
- `.content/` directory is used for markdown drafts and content planning
- Markdown files should include frontmatter with all required fields
- These serve as drafts before being added to the database via admin interface

## Theming System Analysis

### Current Implementation
The application uses a hybrid theming approach:
- **CSS Variables** in `app.css` for core colors
- **Tailwind CSS** with dark mode support (`dark:` prefix)
- **Hardcoded dark theme** via `color-scheme: dark`
- **Inline styles** for component-specific styling

### Current Color Palette (starting 2025-07-30)
```css
--color-charcoal: #2a2a2a        /* Deep charcoal background */
--color-slate: #3d4043           /* Mid-tone slate */
--color-steel: #5a6169           /* Steel blue-grey */
--color-platinum: #e8e9ea        /* Clean platinum text */
--color-white: #ffffff           /* Pure white accents */

Primary Brand Colors
```

```css
--color-primaryOrange: #e85a0d    /* Deep burnt orange (logo match) */
--color-secondaryOrange: #ff7625  /* Lighter orange for hovers */
--color-accent: #1a365d          /* Deep navy blue for trust */
```

Strategic Accent Colors
```css
--color-successGreen: #2d7d32    /* Forest green for growth/success */
--color-warningAmber: #f57c00    /* Amber for alerts/highlights */
--color-infoBlue: #1565c0        /* Professional blue for info */
--color-metallic: #8d9db6        /* Metallic blue-grey for subtle accents */
```

Usage Strategy

Backgrounds: Charcoal primary, slate for cards/sections
Text: Platinum for body, white for headings
CTAs: Primary orange with secondary orange hovers
Trust elements: Deep navy for security badges, testimonials
Success metrics: Forest green for growth stats, follower counts
Interactive elements: Metallic accents for borders, dividers

### OLD Current Color Palette (for reference only)
```css
--color-darkGrey: #1d1616    /* Main background */
--color-darkRed: #8e1616     /* Accent color */
--color-darkPurple: #6a1e55  /* Primary purple */
--color-lightPurple: #cf0798 /* Light purple accent */
--color-lightGrey: #eeeeee   /* Light text/elements */
```

Retro accent colors used throughout:
- `#f7ee2a` - Vibrant Yellow
- `#ed1e79` - Hot Pink
- `#07b0ef` - Electric Blue
- `#9633ac` - Purple
- `#FA8E10` - Orange

### Light Mode Implementation Strategy
**Complexity: Medium** - Requires systematic updates across ~21 components

#### Recommended Approach:
1. **CSS Variable Foundation**
   - Extend CSS variables to support both themes
   - Use `[data-theme="light"]` and `[data-theme="dark"]` selectors
   - Create semantic color variables (e.g., `--color-bg-primary`)

2. **Theme Toggle System**
   - Implement theme context/provider
   - Add localStorage persistence
   - Support system preference detection
   - Create toggle component

3. **Component Updates**
   - Replace hardcoded colors with CSS variables
   - Update `dark:` classes to use semantic colors
   - Test retro effects (neon glows) on light backgrounds
   - Update canvas-based components (floating hearts)

4. **Key Considerations**
   - Maintain retro aesthetic in both themes
   - Ensure proper contrast ratios
   - Test neon/glow effects on light backgrounds
   - Update the hardcoded `color-scheme: dark` to be dynamic

Follow these conventions strictly when working with routes, database schema, and queries to maintain code consistency and quality.