import Container from "~/components/Container";
import type { Route } from "./+types/blog";
import { Card } from "~/components/Card";
import { H1, H5 } from "~/components/H1";
import { postQueries } from "~/lib/db/index.server";
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
    <Container className="mt-10 gap-6 font-set-1">
      <H1 className="gradient-text">Blog</H1>

      <div className="space-y-6 p-4">
        {posts.map((post) => (
          <Card key={post.id} className="border-2 border-[#07b0ef] hover:border-[#fa8e10] transition-colors bg-[#1c1c1c]">
            <Link to={`/blog/${post.slug}`}>
              <H5 className="font-[var(--subheading-font)] text-[#07b0ef]">{post.title}</H5>
              <p className="text-gray-300 mb-2 font-[var(--body-font)]">{post.summary}</p>
              <div className="flex items-center gap-2 text-sm text-[#fa8e10]">
                <span>{post.author}</span>
                <span>•</span>
                <time dateTime={new Date(post.createdAt).toISOString()}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </time>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </Container>
  );
}
