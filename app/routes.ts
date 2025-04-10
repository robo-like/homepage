import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  route("install-guide", "routes/install-guide.tsx"),
  layout("./layout.tsx", [
    index("routes/home.tsx"),
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
      route("login", {
        element: "routes/auth/login.tsx",
        loader: "routes/auth/login.server.ts:loader",
        action: "routes/auth/login.server.ts:action"
      }),
      route("confirm", "routes/auth/confirm.tsx"),
      route("success", "routes/auth/success.tsx"),
      route("logout", "routes/auth/logout.tsx"),
    ]),
    ...prefix("u", [
      route("profile", {
        element: "routes/user/profile.tsx",
        loader: "routes/user/profile.server.ts:loader",
        action: "routes/user/profile.server.ts:action"
      }),
      route("me", "routes/user/me.tsx"),
    ]),
    layout("./routes/admin/layout.tsx", [
      ...prefix("admin", [
        index("routes/admin/index.tsx"),
        route("create-post", "routes/admin/create-post.tsx"),
        route("edit-post/:slug", "routes/admin/edit-post.$slug.tsx")
      ])
    ]),
  ]),
  ...prefix("api", [
    route("metrics", "routes/api/metrics.tsx"),
    route("download-tracking", "routes/api/download-tracking.tsx"),
    route(
      "instagram/hashtag/:hashtag/recent",
      "routes/api/instagram.hashtag.$hashtag.recent.tsx"
    ),
  ]),
] satisfies RouteConfig;
