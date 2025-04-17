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
    route("install-guide", "routes/install-guide.tsx"),
    route("downloads", "routes/downloads.tsx"),
    route("instagram-auto-liker-how-it-works", "routes/how-it-works.tsx"),
    route("social-media-automation-pricing", "routes/pricing.tsx"),
    route("terms-and-conditions", "routes/terms-and-conditions.tsx"),
    ...prefix("blog", [
      index("routes/blog.tsx"),
      route(":pid", "routes/post.tsx"),
    ]),
    route("sitemap.xml", "routes/sitemap.tsx"),
    ...prefix("auth", [
      index("routes/auth/index.tsx"),
      route("login", "routes/auth/login.tsx"),
      route("confirm", "routes/auth/confirm.tsx"),
      route("success", "routes/auth/success.tsx"),
      route("logout", "routes/auth/logout.tsx"),
    ]),
    ...prefix("u", [
      route("access-token", "routes/user/access-token.tsx"),
      route("profile", "routes/user/profile.tsx"),
      route("me", "routes/user/me.tsx"),
    ]),
    layout("./routes/admin/layout.tsx", [
      ...prefix("admin", [
        index("routes/admin/index.tsx"),
        route("create-post", "routes/admin/create-post.tsx"),
        route("edit-post/:slug", "routes/admin/edit-post.$slug.tsx"),
      ]),
    ]),
  ]),
  ...prefix("api", [
    route("metrics", "routes/api/metrics.tsx"),
    route("enterprise-lead", "routes/api/enterprise-lead.ts"),
    route("download-tracking", "routes/api/download-tracking.tsx"),
    route(
      "instagram/hashtag/:hashtag/recent",
      "routes/api/instagram.hashtag.$hashtag.recent.tsx"
    ),
  ]),
] satisfies RouteConfig;
