import { redirect } from "react-router";
import { auth } from "~/lib/auth";
import type { Route } from "./+types/success";
import { isUserOnTrial } from "~/lib/user/trial";
// Loader to verify authentication and get user info
export async function loader({ request }: Route.LoaderArgs) {
  const authData = await auth(request);

  // If not authenticated, redirect to login
  if (!authData.user) {
    return redirect("/auth/login");
  }

  if (authData.user && isUserOnTrial(authData.user)) {
    return redirect("/u/trial");
  }

  return redirect("/u/profile");
}
