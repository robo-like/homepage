import Container from "~/components/Container";
import type { Route } from "./+types/blog";
import { Card } from "~/components/Card";
import { H1, H5 } from "~/components/H1";
import { postQueries } from "~/lib/db";
import { Link, useLoaderData } from "react-router";
import "~/retro-fonts.css";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const postsPerPage = 10;

  const posts = await postQueries.getPosts({
    limit: postsPerPage,
    offset: (page - 1) * postsPerPage,
    orderBy: "desc",
  });

  // Get total count for pagination
  const totalPosts = await postQueries.getPosts({
    limit: 1000, // This is a hack, ideally we'd have a count query
  });

  return {
    posts,
    currentPage: page,
    totalPages: Math.ceil(totalPosts.length / postsPerPage),
  };
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'const page = new RoboLike("Blog"); //@todo' },
    {
      name: "description",
      content:
        "RoboLike blog: sharing our story and tips and tricks for how to get the most out of your automations.",
    },
  ];
}

function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      {currentPage > 1 && (
        <Link
          to={`?page=${currentPage - 1}`}
          className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
        >
          ← Previous
        </Link>
      )}

      <span className="px-4 py-2 text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link
          to={`?page=${currentPage + 1}`}
          className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
        >
          Next →
        </Link>
      )}
    </div>
  );
}

export default function Blog() {
  const { posts, currentPage, totalPages } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen">
      {/* ╔═══════════════════════════════════════╗
          ║ BLOG HEADER - Clean light mode style! ║
          ╚═══════════════════════════════════════╝ */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-[800px] mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent pb-2">
            Blog
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Latest thoughts from the RoboLike team
          </p>
        </div>
      </div>

      {/* ═══ Post Grid ═══ */}
      <div className="bg-white py-12">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="space-y-6">
            {posts.map((post, index) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="block group">
                <div className="p-6 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-300 bg-white">
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-3">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed line-clamp-2">
                    {post.summary}
                  </p>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="font-medium">
                      {post.author}
                    </span>
                    <span className="text-gray-400">•</span>
                    <time 
                      dateTime={new Date(post.createdAt).toISOString()}
                    >
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                    <span className="ml-auto text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
