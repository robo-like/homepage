import type { Route } from "./+types/blog";
import { postQueries } from "~/lib/db";
import { Link, useLoaderData } from "react-router";
import { useEffect, useRef } from "react";

// Parallax hearts background component
function ParallaxHeartsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    // Heart drawing function
    const drawHeart = (x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = '#f97316'; // Orange-500
      ctx.lineWidth = 2;
      ctx.beginPath();

      const scale = size / 16;
      for (let t = 0; t <= Math.PI * 2; t += 0.1) {
        const heartX = 16 * Math.sin(t) ** 3;
        const heartY = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        ctx.lineTo(x + heartX * scale, y - heartY * scale);
      }

      ctx.stroke();
      ctx.restore();
    };

    // Create hearts
    const hearts: Array<{x: number, y: number, size: number, speed: number, opacity: number}> = [];
    
    for (let i = 0; i < 12; i++) {
      hearts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 25 + 8,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.08 + 0.02
      });
    }

    let scrollY = 0;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      hearts.forEach((heart) => {
        // Parallax effect based on scroll
        const parallaxY = heart.y + scrollY * heart.speed * 0.05;
        drawHeart(heart.x, parallaxY, heart.size, heart.opacity);
        
        // Float hearts slowly
        heart.y -= heart.speed;
        if (heart.y < -50) {
          heart.y = canvas.height + 50;
          heart.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(animate);
    };

    // Listen for scroll
    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const postsPerPage = 6; // Reduced for better visual layout

  const posts = await postQueries.getPosts({
    limit: postsPerPage,
    offset: (page - 1) * postsPerPage,
    orderBy: "desc",
  });

  // Get featured post (most recent)
  const featuredPost = posts[0] || null;
  const regularPosts = posts.slice(1);

  // Get total count for pagination
  const totalPosts = await postQueries.getPosts({
    limit: 1000, // This is a hack, ideally we'd have a count query
  });

  return {
    posts: regularPosts,
    featuredPost,
    currentPage: page,
    totalPages: Math.ceil(totalPosts.length / postsPerPage),
  };
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Instagram Growth Blog - RoboLike" },
    {
      name: "description",
      content:
        "Expert tips and strategies for Instagram growth, automation, and building an engaged following. Learn from the RoboLike team.",
    },
    // OpenGraph tags
    {
      property: "og:title",
      content: "Instagram Growth Blog - RoboLike",
    },
    {
      property: "og:description",
      content:
        "Expert tips and strategies for Instagram growth, automation, and building an engaged following. Learn from the RoboLike team.",
    },
    {
      property: "og:type",
      content: "website",
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
    <div className="flex justify-center items-center gap-4 mt-16">
      {currentPage > 1 && (
        <Link
          to={`?page=${currentPage - 1}`}
          className="bg-white border border-gray-300 px-6 py-3 rounded-lg text-gray-700 hover:text-orange-600 hover:border-orange-300 font-medium transition-all shadow-sm hover:shadow-md"
        >
          ← Previous
        </Link>
      )}

      <div className="bg-orange-50 border border-orange-200 px-6 py-3 rounded-lg text-orange-800 font-medium">
        Page {currentPage} of {totalPages}
      </div>

      {currentPage < totalPages && (
        <Link
          to={`?page=${currentPage + 1}`}
          className="bg-white border border-gray-300 px-6 py-3 rounded-lg text-gray-700 hover:text-orange-600 hover:border-orange-300 font-medium transition-all shadow-sm hover:shadow-md"
        >
          Next →
        </Link>
      )}
    </div>
  );
}

export default function Blog() {
  const { posts, featuredPost, currentPage, totalPages } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-white">
      <ParallaxHeartsBackground />
      
      {/* Hero Section */}
      <div className="relative z-10 bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Instagram Growth
              </span>
              <br />
              <span className="text-gray-900">Insights & Tips</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Expert strategies for growing your Instagram presence, building engagement, 
              and connecting with your ideal audience.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
              Growth Strategies
            </span>
            <span className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-medium">
              Automation Tips
            </span>
            <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
              Content Creation
            </span>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              Engagement
            </span>
          </div>
        </div>
      </div>

      {/* Featured Post Section */}
      {featuredPost && (
        <div className="relative z-10 py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Article
              </h2>
              <p className="text-gray-600">Our latest insights on Instagram growth</p>
            </div>
            
            <Link to={`/blog/${featuredPost.slug}`} className="block group">
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-8 md:p-12 border border-orange-200 hover:border-orange-300 transition-all duration-500 hover:shadow-xl transform hover:scale-[1.02]">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium inline-block mb-6">
                    Featured Post
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-6 leading-tight">
                    {featuredPost.title}
                  </h3>
                  <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                    {featuredPost.summary}
                  </p>
                  <div className="flex items-center justify-center gap-4 text-gray-600 mb-6">
                    <span className="font-medium">{featuredPost.author}</span>
                    <span className="text-gray-400">•</span>
                    <time dateTime={new Date(featuredPost.createdAt).toISOString()}>
                      {new Date(featuredPost.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-bold group-hover:bg-orange-700 transition-colors">
                    Read Article
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Recent Posts Grid */}
      <div className="relative z-10 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Articles
            </h2>
            <p className="text-gray-600">Discover more insights to grow your Instagram presence</p>
          </div>

          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post, index) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="block group">
                  <article className="bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] h-full flex flex-col">
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                        {post.summary}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="font-medium">{post.author}</span>
                        <span className="text-gray-300">•</span>
                        <time dateTime={new Date(post.createdAt).toISOString()}>
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                      <div className="text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium text-sm">
                        Read →
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">Check back soon for Instagram growth insights!</p>
            </div>
          )}
          
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="relative z-10 py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-8 md:p-12 border border-orange-200">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Get the latest Instagram growth tips and RoboLike updates delivered to your inbox.
            </p>
            <Link
              to="/social-media-automation-pricing"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started with RoboLike
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
