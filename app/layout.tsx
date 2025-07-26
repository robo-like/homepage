import { Outlet, useOutletContext, useLocation, useLoaderData } from "react-router";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import type { Route } from "./+types/layout";
import React from "react";
import type { OutletContext } from "./root";
import { postQueries } from "~/lib/db";

export async function loader() {
  try {
    // Fetch the latest 3 blog posts for the footer
    const posts = await postQueries.getPosts({
      limit: 3,
      offset: 0,
      orderBy: "desc",
    });
    // Convert Date objects to timestamps for the Footer component
    const latestPosts = posts.map(post => ({
      ...post,
      createdAt: post.createdAt.getTime()
    }));
    return { latestPosts };
  } catch (error) {
    return { latestPosts: [] };
  }
}

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
  const { latestPosts } = useLoaderData<typeof loader>();
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
      <Footer latestPosts={latestPosts} />
    </div>
  );
}

