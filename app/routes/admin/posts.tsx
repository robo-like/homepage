import { Card } from "~/components/Card";
import { H2 } from "~/components/H1";
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
        <Card>
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
                {posts.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">
                        No posts yet. Click "Add New" to create your first post.
                    </p>
                ) : (
                    posts.map((post) => (
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
    );
} 