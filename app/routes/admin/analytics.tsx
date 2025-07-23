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

    // Calculate total views
    const totalViews = pageViews.reduce((sum, page) => sum + page.views, 0);

    // Get unique pages count
    const uniquePages = pageViews.length;

    // Find most popular page
    const topPage = pageViews[0];

    return { pageViews, totalViews, uniquePages, topPage };
}

export default function AdminAnalytics() {
    const { pageViews, totalViews, uniquePages, topPage } = useLoaderData<typeof loader>();

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <span className="text-2xl">👁️</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Views</p>
                            <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <span className="text-2xl">📄</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Unique Pages</p>
                            <p className="text-2xl font-bold text-gray-900">{uniquePages}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <span className="text-2xl">🏆</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Top Page</p>
                            <p className="text-lg font-bold text-gray-900 truncate">
                                {topPage ? topPage.path.split('/').pop() || '/' : 'None'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <span className="text-2xl">📊</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Avg. per Page</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {uniquePages > 0 ? Math.round(totalViews / uniquePages) : 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Page Views Chart */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Top Pages by Views</h2>
                    <p className="text-gray-600">Most visited pages on your site</p>
                </div>
                
                <div className="p-6">
                    {pageViews.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">📊</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data</h3>
                            <p className="text-gray-600">
                                Analytics data will appear here as users visit your site.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pageViews.map((page, index) => {
                                const percentage = (page.views / Math.max(...pageViews.map(p => p.views))) * 100;
                                return (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-gray-500 w-6">
                                                    #{index + 1}
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {page.path}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-600 font-medium">
                                                {page.views.toLocaleString()} views
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 