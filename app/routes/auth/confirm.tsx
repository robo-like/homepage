import { redirect } from "react-router";
import { validateMagicLinkKey, getSession, commitSession, createUserSession } from "~/lib/auth.server";
import type { Route } from "../+types/auth-common";

// This is an action-only route - confirm the magic link and redirect user
export async function action({ request }: Route.ActionArgs) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const redirectTo = url.searchParams.get("redirectTo") || "/auth/success";
  
  if (!key) {
    return redirect("/auth/login?error=Invalid+or+expired+link");
  }
  
  try {
    // Validate the magic link key
    const validation = await validateMagicLinkKey(key);
    
    if (!validation.valid || !validation.userId) {
      return redirect("/auth/login?error=Invalid+or+expired+link");
    }
    
    // Determine redirect destination based on user role
    let destination = redirectTo;
    
    if (validation.role === "admin") {
      destination = "/admin";
    } else if (redirectTo === "/admin") {
      // Don't allow non-admins to access admin, redirect to success page instead
      destination = "/auth/success";
    }
    
    // Create a session and redirect
    return createUserSession(validation.userId, destination);
  } catch (error) {
    console.error("Error confirming magic link:", error);
    return redirect("/auth/login?error=Authentication+failed");
  }
}

// Loader redirects to login
export async function loader() {
  return redirect("/auth/login");
}

export default function Confirm() {
  return null;
}