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
    <div className="flex justify-center gap-2 mt-6">
      {currentPage > 1 && (
        <Link
          to={`?page=${currentPage - 1}`}
          className="retro-button"
        >
          Previous
        </Link>
      )}

      <span className="px-4 py-2 font-[var(--subheading-font)]">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link
          to={`?page=${currentPage + 1}`}
          className="retro-button primary"
        >
          Next
        </Link>
      )}
    </div>
  );
}

export default function Blog() {
  const { posts, currentPage, totalPages } = useLoaderData<typeof loader>();

  return (
    <Container className="mt-10 font-set-1">
      {/* ╔═══════════════════════════════════════╗
          ║ BLOG HEADER - Now aligned with cards! ║
          ╚═══════════════════════════════════════╝ */}
      <div className="mb-8">
        <H1 className="gradient-text text-5xl md:text-6xl font-[var(--heading-font)] tracking-tight">
          Blog
        </H1>
        <p className="text-[#fa8e10] font-[var(--subheading-font)] mt-2">
          // Latest thoughts from the RoboLike crew 🤖
        </p>
      </div>

      {/* ═══ Post Grid with better spacing ═══ */}
      <div className="space-y-8">
        {posts.map((post, index) => (
          <Link key={post.id} to={`/blog/${post.slug}`} className="block group">
            <Card className="relative overflow-hidden border-2 border-[#07b0ef] hover:border-[#fa8e10] transition-all duration-300 bg-gradient-to-br from-[#1c1c1c] to-[#252525] hover:shadow-[0_0_20px_rgba(7,176,239,0.3)] hover:translate-y-[-2px]">
              {/* ASCII art decorator for fun ✨ */}
              <div className="absolute top-2 right-4 text-[#07b0ef] opacity-10 group-hover:opacity-20 transition-opacity text-xs font-mono">
                {index % 3 === 0 ? "[ ][ ][ ]" : index % 3 === 1 ? "< / >" : "{ ; }"}
              </div>
              
              <div className="relative z-10">
                <H5 className="font-[var(--subheading-font)] text-[#07b0ef] group-hover:text-[#fa8e10] transition-colors text-xl md:text-2xl mb-3">
                  {post.title}
                </H5>
                
                <p className="text-gray-300 mb-4 font-[var(--body-font)] line-clamp-2 group-hover:text-gray-100 transition-colors">
                  {post.summary}
                </p>
                
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-[#fa8e10] font-[var(--subheading-font)]">
                    {post.author}
                  </span>
                  <span className="text-[#07b0ef]">•</span>
                  <time 
                    dateTime={new Date(post.createdAt).toISOString()}
                    className="text-[#07b0ef] font-mono"
                  >
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                  <span className="ml-auto text-[#fa8e10] opacity-0 group-hover:opacity-100 transition-opacity font-[var(--subheading-font)]">
                    Read →
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </Container>
  );
}
