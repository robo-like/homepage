import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layout.tsx", [
    index("routes/home.tsx"),
    route("downloads", "routes/downloads.tsx"),
    route("instagram-auto-liker-how-it-works", "routes/how-it-works.tsx"),
    route("social-media-automation-pricing", "routes/pricing.tsx"),
    ...prefix("blog", [
      index("routes/blog.tsx"),
      route(":pid", "routes/post.tsx"),
    ]),
    route("terms-and-conditions", "routes/terms-and-conditions.tsx"),
  ]),
  route("sitemap.xml", "routes/sitemap.tsx"),
  layout("./routes/admin/layout.tsx", [
    ...prefix("admin", [
      index("routes/admin/index.tsx"),
      route("create-post", "routes/admin/create-post.tsx"),
      route("edit-post/:slug", "routes/admin/edit-post.$slug.tsx"),
    ]),
  ]),
  ...prefix("api", [
    route("metrics", "routes/api/metrics.tsx"),
    route(
      "instagram/hashtag/:hashtag/recent",
      "routes/api/instagram.hashtag.$hashtag.recent.tsx"
    ),
  ]),
] satisfies RouteConfig;
