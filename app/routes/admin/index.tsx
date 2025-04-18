import Container from "~/components/Container";
import { Card } from "~/components/Card";
import { H1, H2 } from "~/components/H1";
import { Link } from "react-router";
import type { Route } from "./+types/index";
import { analyticsQueries, postQueries } from "~/lib/db/index.server";
import { useLoaderData } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard | RoboLike" },
    {
      name: "description",
      content:
        "Internal admin dashboard for managing blog posts and viewing analytics.",
    },
  ];
}

export async function loader() {
  // Get recent posts
  const recentPosts = await postQueries.getPosts({
    limit: 5,
    orderBy: "desc",
  });

  // Get pageview analytics
  const events = await analyticsQueries.queryEvents({
    eventType: "pageView",
    limit: 1000,
  });

  // Get product events
  const productEvents = await analyticsQueries.queryEvents({
    eventType: "productEvent",
    limit: 15,
  });

  // Aggregate views by path
  const viewsByPath = events.reduce(
    (acc, event) => {
      acc[event.path] = (acc[event.path] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Convert to array and sort by views
  const pageViews = Object.entries(viewsByPath)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  return { pageViews, recentPosts, productEvents };
}

export default function AdminIndex() {
  const { pageViews, recentPosts, productEvents } =
    useLoaderData<typeof loader>();

  return (
    <Container className="mt-10 gap-6">
      <div>
        <H1>Admin Pages</H1>
        <p className="text-lg mb-8">
          Internal tools for creating blog posts and viewing user metrics. These
          pages are only accessible when viewing from localhost.
        </p>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <H2 className="mb-0">List of Posts</H2>
          <Link
            to="/admin/create-post"
            className="px-4 py-2 bg-[#6A1E55] text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Add New
          </Link>
        </div>
        <div className="space-y-2">
          {recentPosts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No posts yet. Click "Add New" to create your first post.
            </p>
          ) : (
            recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0"
              >
                <div>
                  <Link
                    to={`/admin/edit-post/${post.slug}`}
                    className="text-gray-300 hover:text-white"
                  >
                    {post.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link
                    to={`/admin/edit-post/${post.slug}`}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-sm text-gray-400 hover:text-white"
                    target="_blank"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card>
        <H2 className="mb-4">Page Views</H2>
        <div className="space-y-2">
          {pageViews.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No events found</p>
          ) : (
            pageViews.map((page, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0"
              >
                <span className="text-gray-300">{page.path}</span>
                <span className="text-gray-400">{page.views} views</span>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="mt-6">
        <H2 className="mb-4">User Activity</H2>
        <div className="space-y-2">
          {productEvents.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No events found</p>
          ) : (
            productEvents.map((event) => (
              <div
                key={event.id}
                className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0"
              >
                <div>
                  <p className="text-gray-300">{event.description}</p>
                  <p className="text-sm text-gray-500">
                    Platform: {event.eventValue}
                  </p>
                  <p className="text-sm text-gray-500">Page: {event.path}</p>
                </div>
                <time className="text-sm text-gray-400">
                  {new Date(event.createdAt).toLocaleString()}
                </time>
              </div>
            ))
          )}
        </div>
      </Card>
    </Container>
  );
}
