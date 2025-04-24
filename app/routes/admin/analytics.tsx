import { Card } from "~/components/Card";
import { H2 } from "~/components/H1";
import { analyticsQueries } from "~/lib/db";
import { useLoaderData } from "react-router";

export async function loader() {
    // Get pageview analytics
    const events = await analyticsQueries.queryEvents({
        eventType: "pageView",
        limit: 1000,
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

    return { pageViews };
}

export default function AdminAnalytics() {
    const { pageViews } = useLoaderData<typeof loader>();

    return (
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
    );
} 