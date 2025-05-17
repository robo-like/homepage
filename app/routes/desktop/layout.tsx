import React from "react";
import { Outlet, useOutletContext } from "react-router";
import type { Route } from "../../+types/layout";
import { FloatingContactButton } from "~/components/FloatingContactButton";
import type { OutletContext } from "../../root";

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

  return (
    <>
      {/* Layout Container */}
      <div className="min-h-screen flex flex-col relative z-10 bg-black">
        <main className="flex-grow pb-10">
          <Outlet context={{ user }} />
        </main>
        {/* <Footer /> */}
      </div>
      {isLoggedIn && <FloatingContactButton />}
    </>
  );
}
