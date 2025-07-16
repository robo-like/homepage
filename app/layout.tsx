import { Outlet, useOutletContext, useLocation } from "react-router";
import { Header } from "~/components/Header";
import type { Route } from "./+types/layout";
import React from "react";
import type { OutletContext } from "./root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'const page = new RoboLike("(internal) Layout"); //@todo' },
    {
      name: "description",
      content: "***INTERAL USE ONLY*** this page is a backdoor.",
    },
  ];
}

export default function Layout() {
  const { user } = useOutletContext<OutletContext>();
  const isLoggedIn = !!user;

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const hideHeader = params.get("hideHeader") === "true";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!hideHeader && <Header />}
      <main className="flex-grow">
        <Outlet context={{ user }} />
      </main>
      {/* <Footer /> */}
    </div>
  );
}

