import { Outlet, redirect } from "react-router";
import { Header } from "~/components/Header";
import type { Route } from "./+types/layout";
import { requireAuth } from "../../lib/auth";

export async function loader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);

  // Local development check
  if (
    !url.hostname.includes("localhost") &&
    process.env.NODE_ENV === "production"
  ) {
    throw new Response("Not Found", { status: 404 });
  }

  // Authentication check - only allow admins
  try {
    const authData = await requireAuth(request, "/auth/login", ["admin"]);
    return { user: authData.user };
  } catch (error) {
    // requireAuth will throw a redirect if not authenticated
    throw error;
  }
}

export default function Layout() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pb-15">
          <Outlet />
        </main>
      </div>
    </>
  );
}
