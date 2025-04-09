import { redirect } from "react-router";
import type { Route } from "../+types/auth-common";

// Auth index route redirects to login
export function loader({ request }: Route.LoaderArgs) {
  return redirect("/auth/login");
}

export default function Index() {
  return null;
}