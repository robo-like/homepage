import { logout } from "~/lib/auth.server";
import type { Route } from "../+types/auth-common";

// Simple loader that logs out the user
export async function loader({ request }: Route.LoaderArgs) {
  return logout(request);
}

// This component doesn't render anything since it always redirects
export default function Logout() {
  return null;
}