import { useLoaderData } from "react-router";
import type { Route } from "./+types/post";
import { db } from "~/lib/db";
import { posts } from "~/lib/db/schema";
import { eq } from "drizzle-orm";
import Container from "~/components/Container";
import { Card } from "~/components/Card";
import { H1 } from "~/components/H1";
import "~/retro-fonts.css";

export async function loader({ params }: Route.LoaderArgs) {
  const post = await db
    .select()
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
      {
        name: "description",
        content: "The requested post could not be found.",
      },
    ];
  }

  return [
    { title: data.post.seoTitle || data.post.title },
    {
      name: "description",
      content: data.post.seoDescription || data.post.summary,
    },
  ];
}

export default function Post() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <Container className="mt-10 gap-1 font-set-1">
      <div>
        <H1 className="gradient-text">{post.title}</H1>
        <p className="text-[#07b0ef] mb-4 font-[var(--subheading-font)]">{post.summary}</p>
      </div>

      <Card className="border-2 border-[#07b0ef] grid-lines">
        <div className="flex items-center gap-2 text-sm text-[#fa8e10] mb-4">
          <span>{post.author}</span>
          <span>•</span>
          <time dateTime={new Date(post.createdAt).toISOString()}>
            {new Date(post.createdAt).toLocaleDateString()}
          </time>
        </div>
        <div
          className="prose dark:prose-invert max-w-none font-[var(--body-font)] prose-headings:font-[var(--subheading-font)] prose-headings:text-[#07b0ef] prose-a:text-[#fa8e10]"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </Card>
    </Container>
  );
}
