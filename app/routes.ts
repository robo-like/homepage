import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    layout("./layout.tsx", [
        route("downloads", "routes/downloads.tsx")
    ]),
    // route('layout', 'layout.tsx'),
] satisfies RouteConfig;
