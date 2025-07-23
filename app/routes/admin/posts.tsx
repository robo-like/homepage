import { Link } from "react-router";
import { postQueries } from "~/lib/db";
import { useLoaderData } from "react-router";

export async function loader() {
    // Get recent posts
    const posts = await postQueries.getPosts({
        orderBy: "desc",
    });

    return { posts };
}

export default function AdminPosts() {
    const { posts } = useLoaderData<typeof loader>();

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <span className="text-2xl">📝</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Posts</p>
                            <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <span className="text-2xl">✅</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Published</p>
                            <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <span className="text-2xl">📊</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">This Month</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {posts.filter(post => {
                                    const postDate = new Date(post.createdAt);
                                    const currentDate = new Date();
                                    return postDate.getMonth() === currentDate.getMonth() && 
                                           postDate.getFullYear() === currentDate.getFullYear();
                                }).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts List */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Blog Posts</h2>
                        <Link
                            to="/admin/create-post"
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                        >
                            Create New Post
                        </Link>
                    </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                    {posts.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-gray-400 text-6xl mb-4">📝</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                            <p className="text-gray-600 mb-6">
                                Create your first blog post to get started with content marketing.
                            </p>
                            <Link
                                to="/admin/create-post"
                                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Create First Post
                            </Link>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <Link
                                            to={`/admin/edit-post/${post.slug}`}
                                            className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors"
                                        >
                                            {post.title}
                                        </Link>
                                        <p className="text-gray-600 mt-1 line-clamp-2">
                                            {post.summary}
                                        </p>
                                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                            <span>By {post.author}</span>
                                            <span>•</span>
                                            <time dateTime={new Date(post.createdAt).toISOString()}>
                                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </time>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 ml-6">
                                        <Link
                                            to={`/admin/edit-post/${post.slug}`}
                                            className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                                        >
                                            Edit
                                        </Link>
                                        <Link
                                            to={`/blog/${post.slug}`}
                                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                            target="_blank"
                                        >
                                            View →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
} 