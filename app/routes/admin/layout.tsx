import { Outlet, useLoaderData } from "react-router";
import { Header } from "~/components/Header";
import type { Route } from "./+types/layout";
import { requireAuth } from "../../lib/auth";
import { Tabs } from "~/components/Tabs";
import { H1 } from "~/components/H1";

export async function loader({ request }: Route.ClientLoaderArgs) {
  // Authentication check - only allow admins
  try {
    const authData = await requireAuth(request, "/auth/login?admin=true", ["admin"]);
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
  const tabs = [
    { label: "User Activity", to: "/admin/activity" },
    { label: "Posts", to: "/admin/posts" },
    { label: "Analytics", to: "/admin/analytics" },
    { label: "Email Marketing", to: "/admin/email", comingSoon: true },
    { label: "Contacts", to: "/admin/contacts" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-set-1">
      <Header />
      <div className="flex-1 grid-lines">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="mt-10 mb-8">
            <H1 className="animated-gradient-text">Admin Dashboard</H1>
            <p className="text-lg font-['Chakra_Petch'] text-[#07b0ef]">
              Internal tools for creating blog posts and viewing user metrics.
            </p>
          </div>

          <div className="bg-[#0A0A0A] rounded-lg p-6 border border-[#07b0ef]/20 shadow-lg">
            <Tabs tabs={tabs} className="mb-6" />
            <Outlet context={{ user }} />
          </div>
        </div>
      </div>
    </div>
  );
}
