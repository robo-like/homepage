import { logout } from "~/lib/auth";
import type { Route } from "./+types/logout";

// Simple loader that logs out the user
export async function loader({ request }: Route.LoaderArgs) {
  return logout(request);
}

// This component doesn't render anything since it always redirects
export default function Logout() {
  return null;
}
