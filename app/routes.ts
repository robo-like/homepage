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
    route("instagram-auto-liker-how-it-works", "routes/how-it-works.tsx"),
    route("social-media-automation-pricing", "routes/pricing.tsx"),
    route("terms-and-conditions", "routes/terms-and-conditions.tsx"),
    route("privacy-policy", "routes/privacy-policy.tsx"),
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
      //special route to grab the current user as a payload
      route("me", "routes/user/me.tsx"),
      //the actual user interface side of things

      layout("./routes/user/layout.tsx",[
        ...prefix("profile",[
          index("routes/user/profile.tsx"),
          route("billing", "routes/user/profile/billing.tsx"), 
        ]),
      ]),
    ]),
    layout("./routes/admin/layout.tsx", [
      ...prefix("admin", [
        index("routes/admin/index.tsx"),
        route("create-post", "routes/admin/create-post.tsx"),
        route("edit-post/:slug", "routes/admin/edit-post.$slug.tsx"),
      ]),
    ]),
  ]),
  route("webhook/stripe", "routes/webhook/stripe.tsx"),
  ...prefix("api", [
    route("metrics", "routes/api/metrics.tsx"),
    route("enterprise-lead", "routes/api/enterprise-lead.ts"),
    route("download-tracking", "routes/api/download-tracking.tsx"),
    route("support-ticket", "routes/api/support-ticket.ts"),
    route("support-tickets", "routes/api/support-tickets.ts"),
    route(
      "instagram/hashtag/:hashtag/recent",
      "routes/api/instagram.hashtag.$hashtag.recent.tsx"
    ),
  ]),
] satisfies RouteConfig;
