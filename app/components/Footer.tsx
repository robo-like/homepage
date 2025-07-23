import { Link } from "react-router";

// Define the blog post type for the footer
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  createdAt: number;
  author: string;
}

interface FooterProps {
  className?: string;
  latestPosts?: BlogPost[];
}

export function Footer({ className = "", latestPosts = [] }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`w-full bg-gray-800 text-white ${className}`}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-0 mb-4">
              <img
                src="/robolike-orange-robot-heart.png"
                alt="RoboLike"
                className="w-auto h-10 mr-[-6px]"
              />
              <h3 className="text-2xl font-black text-white">
                RoboLike
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              The safe, local Instagram automation tool that helps you grow your audience while you focus on creating amazing content.
            </p>
            <p className="text-gray-400 text-xs">
              © {currentYear} RoboLike. All rights reserved.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/instagram-auto-liker-how-it-works" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/social-media-automation-pricing" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/install-guide" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  Download
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Support & Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    if ((window as any).BrevoConversations) {
                      (window as any).BrevoConversations('openChat');
                    }
                  }}
                  className="text-gray-300 hover:text-orange-400 transition-colors text-sm text-left"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Latest Blog Posts */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Latest from Our Blog</h4>
            {latestPosts.length > 0 ? (
              <div className="space-y-3">
                {latestPosts.slice(0, 3).map((post) => (
                  <div key={post.id}>
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <h5 className="text-sm font-medium text-gray-300 group-hover:text-orange-400 transition-colors line-clamp-2 mb-1">
                        {post.title}
                      </h5>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <Link to="/blog" className="block group">
                    <h5 className="text-sm font-medium text-gray-300 group-hover:text-orange-400 transition-colors mb-1">
                      Getting Started with Instagram Automation
                    </h5>
                    <p className="text-xs text-gray-500">Recent</p>
                  </Link>
                </div>
                <div>
                  <Link to="/blog" className="block group">
                    <h5 className="text-sm font-medium text-gray-300 group-hover:text-orange-400 transition-colors mb-1">
                      Best Practices for Instagram Growth
                    </h5>
                    <p className="text-xs text-gray-500">Recent</p>
                  </Link>
                </div>
                <div>
                  <Link to="/blog" className="block group">
                    <h5 className="text-sm font-medium text-gray-300 group-hover:text-orange-400 transition-colors mb-1">
                      Instagram Safety Tips
                    </h5>
                    <p className="text-xs text-gray-500">Recent</p>
                  </Link>
                </div>
              </div>
            )}
            <div className="mt-4">
              <Link 
                to="/blog" 
                className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
              >
                View All Posts →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
