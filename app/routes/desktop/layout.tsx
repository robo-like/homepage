import React from "react";
import { Outlet, useOutletContext } from "react-router";
import type { Route } from "../../+types/layout";
import type { OutletContext } from "../../root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Authentication | RoboLike" },
    {
      name: "description",
      content: "User authentication and account access.",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function Layout() {
  const { user } = useOutletContext<OutletContext>();
  const isLoggedIn = !!user;

  return (
    <>
      {/* Layout Container */}
      <div className="min-h-screen flex items-center justify-center relative z-10 bg-gray-50 p-6">
        <main className="w-full">
          <Outlet context={{ user }} />
        </main>
      </div>
    </>
  );
}
