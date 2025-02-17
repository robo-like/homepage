import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    layout("./layout.tsx", [
        index("routes/home.tsx"),
        route("downloads", "routes/downloads.tsx"),
        route("instagram-auto-liker-how-it-works", "routes/how-it-works.tsx"),
        route("social-media-automation-pricing", "routes/pricing.tsx"),
        ...prefix("blog", [
            index("routes/blog.tsx"),
            route(":pid", "routes/post.tsx")
        ])
    ])
] satisfies RouteConfig;
