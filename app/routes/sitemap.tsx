import { type LoaderFunctionArgs } from "react-router";
import { postQueries } from "~/lib/db";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Get the base URL from the request
  const baseUrl = new URL(request.url).origin;

  // Get all blog posts
  const posts = await postQueries.getPosts({
    limit: 1000, // Get all posts
    orderBy: "desc",
  });

  // Define static routes with their priorities
  const staticRoutes = [
    { path: "", priority: "1.0" }, // Homepage
    { path: "/install-guide", priority: "0.8" }, // High priority - main conversion page
    { path: "/instagram-auto-liker-how-it-works", priority: "0.8" }, // High priority - product education
    { path: "/social-media-automation-pricing", priority: "0.8" }, // High priority - pricing/conversion
    { path: "/faq", priority: "0.7" }, // Medium-high priority - FAQ for SEO
    { path: "/blog", priority: "0.7" }, // Medium-high priority - content hub
    { path: "/privacy-policy", priority: "0.3" }, // Low priority - legal page
    { path: "/terms-and-conditions", priority: "0.3" }, // Low priority - legal page
  ];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes
      .map(
        (route) => `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route.priority}</priority>
  </url>`
      )
      .join("")}
  ${posts
      .map(
        (post) => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.createdAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`
      )
      .join("")}
</urlset>`;

  // Return XML with proper content type
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
