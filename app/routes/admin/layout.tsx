import { Outlet, useLoaderData, useLocation, Link } from "react-router";
import type { Route } from "./+types/layout";
import { requireAuth } from "../../lib/auth";
import { cn } from "~/lib/utils";

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
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function Layout() {
  const { user } = useLoaderData<typeof loader>();
  const location = useLocation();

  const navigationItems = [
    { 
      label: "User Activity", 
      to: "/admin/activity", 
      icon: "📊",
      description: "View user events and analytics"
    },
    { 
      label: "Posts", 
      to: "/admin/posts", 
      icon: "📝",
      description: "Manage blog posts and content"
    },
    { 
      label: "Analytics", 
      to: "/admin/analytics", 
      icon: "📈",
      description: "Page views and metrics"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/robolike-orange-robot-heart.png"
              alt="RoboLike"
              className="h-8 w-auto"
            />
            <div>
              <h1 className="font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">RoboLike</p>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold text-sm">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{user.email}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg transition-colors group",
                    isActive
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className={cn(
                      "font-medium text-sm",
                      isActive ? "text-orange-700" : "text-gray-900"
                    )}>
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                to="/admin/create-post"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors"
              >
                <span>➕</span>
                <span>Create New Post</span>
              </Link>
              <Link
                to="/u/profile"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors"
              >
                <span>👤</span>
                <span>View Profile</span>
              </Link>
              <Link
                to="/"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors"
              >
                <span>🏠</span>
                <span>Back to Site</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {navigationItems.find(item => item.to === location.pathname)?.label || "Dashboard"}
              </h1>
              <p className="text-gray-600">
                {navigationItems.find(item => item.to === location.pathname)?.description || "Manage your RoboLike application"}
              </p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6">
          <Outlet context={{ user }} />
        </div>
      </div>
    </div>
  );
}
