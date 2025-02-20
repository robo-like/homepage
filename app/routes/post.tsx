import { useLoaderData } from "react-router";
import type { Route } from "./+types/post";
import { db } from "~/lib/db";
import { posts } from "~/lib/db/schema";
import { eq } from "drizzle-orm";
import Container from "~/components/Container";
import { Card } from "~/components/Card";
import { H1 } from "~/components/H1";

export async function loader({ params }: Route.LoaderArgs) {
  const post = await db.select()
    .from(posts)
    .where(eq(posts.slug, params.pid))
    .get();

  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  return { post };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data?.post) {
    return [
      { title: "Post Not Found" },
      { name: "description", content: "The requested post could not be found." },
    ];
  }

  return [
    { title: data.post.seoTitle || data.post.title },
    { name: "description", content: data.post.seoDescription || data.post.summary },
  ];
}

export default function Post() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <Container className="mt-10 gap-1">
      <div>
        <H1>{post.title}</H1>
        <p className="text-gray-400 mb-4">{post.summary}</p>
      </div>

      <Card>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>{post.author}</span>
          <span>•</span>
          <time dateTime={new Date(post.createdAt).toISOString()}>
            {new Date(post.createdAt).toLocaleDateString()}
          </time>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          {post.body}
        </div>
      </Card>
    </Container>
  );
}
