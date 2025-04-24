import { Outlet, redirect, useLoaderData } from "react-router";
import { Header } from "~/components/Header";
import type { Route } from "./+types/layout";
import { requireAuth } from "../../lib/auth";

export async function loader({ request }: Route.ClientLoaderArgs) {
  // Authentication check - only allow admins
  try {
    const authData = await requireAuth(request, "/auth/login", ["admin"]);
    return { user: authData.user };
  } catch (error) {
    // requireAuth will throw a redirect if not authenticated
    throw error;
  }
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard | RoboLike" },
    { name: "description", content: "Internal admin dashboard for managing blog posts and viewing analytics." },
  ];
}

export default function Layout() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pb-15">
          <Outlet context={{ user }} />
        </main>
      </div>
    </>
  );
}
