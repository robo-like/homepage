import { useLoaderData, Link } from "react-router";
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
    <Container className="mt-10 font-set-1 max-w-4xl">
      {/* ╔═══════════════════════════════════════════════════════╗
          ║ HERO SECTION - Big, bold, and beautiful! 🎨          ║
          ╚═══════════════════════════════════════════════════════╝ */}
      <div className="relative mb-12">
        {/* Back to blog link */}
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-[#07b0ef] hover:text-[#fa8e10] transition-colors mb-6 font-[var(--subheading-font)]"
        >
          <span className="text-xl">←</span>
          <span>Back to Blog</span>
        </Link>

        {/* ASCII art decoration */}
        <div className="absolute -top-4 right-0 text-[#07b0ef] opacity-20 font-mono text-xs hidden md:block">
          ╭──────────────╮<br/>
          │ BLOG.POST(); │<br/>
          ╰──────────────╯
        </div>

        {/* Main title with animation */}
        <H1 className="gradient-text text-5xl md:text-7xl font-[var(--heading-font)] tracking-tight mb-6 animate-fade-in">
          {post.title}
        </H1>
        
        {/* Summary with style */}
        <p className="text-[#fa8e10] text-xl md:text-2xl font-[var(--subheading-font)] mb-8 leading-relaxed">
          {post.summary}
        </p>

        {/* Meta info bar */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-gradient-to-r from-[#1c1c1c] to-[#252525] border-l-4 border-[#07b0ef] rounded-r-lg">
          <div className="flex items-center gap-2">
            <span className="text-[#07b0ef] font-mono text-sm">AUTHOR:</span>
            <span className="text-[#fa8e10] font-[var(--subheading-font)]">{post.author}</span>
          </div>
          
          <span className="text-[#07b0ef]">•</span>
          
          <div className="flex items-center gap-2">
            <span className="text-[#07b0ef] font-mono text-sm">PUBLISHED:</span>
            <time 
              dateTime={new Date(post.createdAt).toISOString()}
              className="text-[#fa8e10] font-mono"
            >
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          
          {/* Reading time estimate (rough calc) */}
          <span className="text-[#07b0ef]">•</span>
          <div className="flex items-center gap-2">
            <span className="text-[#07b0ef] font-mono text-sm">EST:</span>
            <span className="text-[#fa8e10] font-mono">
              {Math.ceil(post.body.split(' ').length / 200)} min read
            </span>
          </div>
        </div>
      </div>

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <Card className="relative overflow-hidden border-2 border-[#07b0ef] bg-gradient-to-br from-[#1c1c1c] to-[#252525] shadow-[0_0_30px_rgba(7,176,239,0.2)]">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#07b0ef] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#fa8e10] opacity-5 rounded-full blur-3xl"></div>
        
        {/* Article content with enhanced typography */}
        <article className="relative z-10">
          <div
            className="prose prose-lg dark:prose-invert max-w-none 
              font-[var(--body-font)] 
              prose-headings:font-[var(--subheading-font)] 
              prose-headings:text-[#07b0ef] 
              prose-headings:mt-8 
              prose-headings:mb-4
              prose-h2:text-3xl
              prose-h3:text-2xl
              prose-p:text-gray-300 
              prose-p:leading-relaxed
              prose-p:mb-6
              prose-a:text-[#fa8e10] 
              prose-a:no-underline 
              prose-a:border-b-2 
              prose-a:border-[#fa8e10] 
              prose-a:hover:border-[#07b0ef]
              prose-a:transition-colors
              prose-strong:text-[#07b0ef]
              prose-code:text-[#fa8e10]
              prose-code:bg-[#0a0a0a]
              prose-code:px-2
              prose-code:py-1
              prose-code:rounded
              prose-code:before:content-['']
              prose-code:after:content-['']
              prose-pre:bg-[#0a0a0a]
              prose-pre:border-2
              prose-pre:border-[#07b0ef]
              prose-blockquote:border-l-4
              prose-blockquote:border-[#fa8e10]
              prose-blockquote:pl-6
              prose-blockquote:italic
              prose-blockquote:text-gray-400
              prose-li:text-gray-300
              prose-ul:list-disc
              prose-ol:list-decimal"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </article>
      </Card>

      {/* ═══ FOOTER SECTION ═══ */}
      <div className="mt-12 pt-8 border-t-2 border-[#07b0ef] border-opacity-30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link 
            to="/blog" 
            className="group flex items-center gap-3 text-[#07b0ef] hover:text-[#fa8e10] transition-colors font-[var(--subheading-font)]"
          >
            <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to all posts</span>
          </Link>
          
          {/* Fun ASCII signature */}
          <div className="text-[#07b0ef] font-mono text-xs opacity-50">
            // EOF - Thanks for reading! 🤖
          </div>
        </div>
      </div>
    </Container>
  );
}
