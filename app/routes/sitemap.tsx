import { type LoaderFunctionArgs } from "react-router";
import { postQueries } from "~/lib/db/index.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Get the base URL from the request
  const baseUrl = new URL(request.url).origin;

  // Get all blog posts
  const posts = await postQueries.getPosts({
    limit: 1000, // Get all posts
    orderBy: "desc",
  });

  // Define static routes (excluding admin and api routes)
  const staticRoutes = [
    "",
    "/install-guide",
    "/instagram-auto-liker-how-it-works",
    "/social-media-automation-pricing",
    "/blog",
    "/terms-and-conditions",
    "/auth/login",
    "/auth/logout",
    "/auth/success",
    "/auth/confirm",
    "/privacy-policy",
    "/terms-and-conditions",
    "/install-guide",
  ];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes
      .map(
        (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === "" ? "1.0" : "0.8"}</priority>
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
    <priority>0.6</priority>
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
