import Container from "~/components/Container";
import type { Route } from "./+types/blog";
import { Card } from "~/components/Card";
import { H1, H5 } from "~/components/H1";
import { postQueries } from "~/lib/db";
import { Link, useLoaderData } from "react-router";

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

export function meta({}: Route.MetaArgs) {
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
          className="px-4 py-2 bg-[#6A1E55] text-white rounded-lg hover:bg-opacity-90"
        >
          Previous
        </Link>
      )}

      <span className="px-4 py-2">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link
          to={`?page=${currentPage + 1}`}
          className="px-4 py-2 bg-[#6A1E55] text-white rounded-lg hover:bg-opacity-90"
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
    <Container className="mt-10 gap-6">
      <H1>Blog</H1>

      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <Link to={`/blog/${post.slug}`}>
              <H5>{post.title}</H5>
              <p className="text-gray-400 mb-2">{post.summary}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
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
