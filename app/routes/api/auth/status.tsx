import { auth } from "~/lib/auth";
import type { Route } from "./+types/status";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const authData = await auth(request);
    
    if (!authData.user) {
      return new Response(JSON.stringify({ 
        authenticated: false,
        error: "Not authenticated" 
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({
      authenticated: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.name,
        role: authData.user.role,
        createdAt: authData.user.createdAt
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error checking auth status:", error);
    return new Response(JSON.stringify({ 
      authenticated: false,
      error: "Authentication check failed" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// This endpoint is GET only, no POST needed
export async function action() {
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" }
  });
}