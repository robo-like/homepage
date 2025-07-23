import { useLoaderData, Link } from "react-router";
import React from "react";
import type { Route } from "./+types/post";
import { db } from "~/lib/db";
import { posts } from "~/lib/db/schema";
import { eq } from "drizzle-orm";
import Container from "~/components/Container";
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

  const post = data.post;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.summary,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "RoboLike",
      "logo": {
        "@type": "ImageObject",
        "url": "https://robolike.com/robolike-orange-robot-heart.png"
      }
    },
    "datePublished": new Date(post.createdAt).toISOString(),
    "dateModified": new Date(post.createdAt).toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://robolike.com/blog/${post.slug}`
    },
    "image": post.seoImage || "https://robolike.com/robolike-orange-robot-heart.png",
    "url": `https://robolike.com/blog/${post.slug}`
  };

  return [
    { title: post.seoTitle || post.title },
    {
      name: "description",
      content: post.seoDescription || post.summary,
    },
    {
      property: "og:title",
      content: post.seoTitle || post.title,
    },
    {
      property: "og:description",
      content: post.seoDescription || post.summary,
    },
    {
      property: "og:type",
      content: "article",
    },
    {
      property: "og:image",
      content: post.seoImage || "https://robolike.com/robolike-orange-robot-heart.png",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      "script:ld+json": structuredData,
    },
  ];
}

export default function Post() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen">
      {/* ╔═══════════════════════════════════════════════════════╗
          ║ HERO SECTION - Big, bold, and beautiful! 🎨          ║
          ╚═══════════════════════════════════════════════════════╝ */}
      <div className="relative bg-gray-50 overflow-hidden">
        {/* Parallax Hearts Background */}
        <ParallaxHeartsBackground />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-8 pb-16">
          {/* Back to blog link */}
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors mb-8 font-medium"
          >
            <span className="text-xl">←</span>
            <span>Back to Blog</span>
          </Link>

          {/* Main title with gradient */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            {post.title}
          </h1>
          
          {/* Summary */}
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-3xl">
            {post.summary}
          </p>

          {/* Meta info bar */}
          <div className="flex flex-wrap items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium text-sm">By</span>
              <span className="text-gray-900 font-semibold">{post.author}</span>
            </div>
            
            <span className="text-gray-400">•</span>
            
            <div className="flex items-center gap-2">
              <time 
                dateTime={new Date(post.createdAt).toISOString()}
                className="text-gray-600"
              >
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">
                {Math.ceil(post.body.split(' ').length / 200)} min read
              </span>
            </div>
          </div>
        </div>
      </div>

        {/* Article content with clean typography */}
        <article className="bg-white py-12 px-6">
          <div className="max-w-[800px] mx-auto">
            <div
              className="prose prose-lg max-w-none
                prose-headings:text-gray-900
                prose-headings:font-bold
                prose-headings:mt-8 
                prose-headings:mb-4
                prose-h2:text-3xl
                prose-h3:text-2xl
                prose-p:text-gray-700
                prose-p:leading-relaxed
                prose-p:mb-6
                prose-a:text-orange-600
                prose-a:hover:text-orange-700
                prose-a:transition-colors
                prose-strong:text-gray-900
                prose-strong:font-semibold
                prose-code:text-orange-600
                prose-code:bg-gray-100
                prose-code:px-2
                prose-code:py-1
                prose-code:rounded
                prose-code:before:content-['']
                prose-code:after:content-['']
                prose-pre:bg-gray-50
                prose-pre:border
                prose-pre:border-gray-200
                prose-blockquote:border-l-4
                prose-blockquote:border-orange-600
                prose-blockquote:pl-6
                prose-blockquote:italic
                prose-blockquote:text-gray-600
                prose-li:text-gray-700
                prose-ul:list-disc
                prose-ol:list-decimal"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </div>
        </article>

      {/* ═══ FOOTER SECTION ═══ */}
      <div className="bg-gray-50 py-12 px-6">
        <div className="max-w-[800px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link 
              to="/blog" 
              className="group flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back to all posts</span>
            </Link>
            
            <div className="text-gray-500 text-sm">
              Thanks for reading!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Parallax Hearts Background Component
function ParallaxHeartsBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const retro80sColors = [
      "#f7ee2a", // Vibrant Yellow
      "#ed1e79", // Hot Pink
      "#07b0ef", // Electric Blue
      "#9633ac", // Purple
      "#FA8E10", // Orange
    ];

    const hearts: {
      x: number;
      y: number;
      color: string;
      size: number;
      initialY: number;
    }[] = [];

    // Initialize static hearts for parallax
    const initHearts = () => {
      hearts.length = 0;
      for (let i = 0; i < 8; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        hearts.push({
          x,
          y,
          initialY: y,
          color: retro80sColors[Math.floor(Math.random() * retro80sColors.length)],
          size: 20 + Math.random() * 40,
        });
      }
    };

    const drawHeart = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      color: string,
      size = 30
    ) => {
      const scale = size / 16;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.1;
      ctx.beginPath();

      for (let t = 0; t <= Math.PI * 2; t += 0.01) {
        const heartX = 16 * Math.sin(t) ** 3;
        const heartY =
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t);

        ctx.lineTo(x + heartX * scale, y - heartY * scale);
      }

      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const drawHearts = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get scroll position for parallax effect
      const scrollY = window.scrollY;

      hearts.forEach((heart, index) => {
        // Apply parallax effect - hearts move at different speeds based on their index
        const parallaxSpeed = 0.1 + (index * 0.02);
        const newY = heart.initialY + (scrollY * parallaxSpeed);
        
        drawHeart(ctx, heart.x, newY, heart.color, heart.size);
      });
    };

    const handleScroll = () => {
      drawHearts();
    };

    resizeCanvas();
    initHearts();
    drawHearts();
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", () => {
      resizeCanvas();
      initHearts();
      drawHearts();
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", () => {
        resizeCanvas();
        initHearts();
        drawHearts();
      });
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
