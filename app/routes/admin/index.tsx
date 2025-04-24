import { redirect } from "react-router";
import type { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard | RoboLike" },
    {
      name: "description",
      content:
        "Internal admin dashboard for managing blog posts and viewing analytics.",
    },
  ];
}

export async function loader() {
  // Redirect to the activity tab by default
  return redirect("/admin/activity");
}
