import type { Route } from "./+types/home";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Free Instagram Auto Liker - RoboLike" },
    {
      name: "description",
      content:
        "Free Instagram auto liker to boost followers instantly. RoboLike's powerful automation tool helps you grow your audience, increase engagement, and connect with real followers automatically.",
    },
    // Standard OpenGraph Meta Tags
    {
      property: "og:title",
      content: "Free Instagram Auto Liker - RoboLike",
    },
    {
      property: "og:description",
      content:
        "Free Instagram auto liker to boost followers instantly. RoboLike's powerful automation tool helps you grow your audience, increase engagement, and connect with real followers automatically.",
    },
    {
      property: "og:image",
      content: "/seo/homepage-seo-image.gif",
    },
    {
      property: "og:type",
      content: "website",
    },
    // Twitter Card Meta Tags
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:image",
      content: "/seo/homepage-seo-image.gif",
    },
  ];
}

// Floating heart animation component
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
    
    for (let i = 0; i < 15; i++) {
      hearts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 30 + 10,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.1 + 0.05
      });
    }

    let scrollY = 0;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      hearts.forEach((heart) => {
        // Parallax effect based on scroll
        const parallaxY = heart.y + scrollY * heart.speed * 0.1;
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
      style={{ opacity: 0.3 }}
    />
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <ParallaxHeartsBackground />
      
      {/* Hero Section */}
      <div className="relative z-10 bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/robolike-orange-robot-heart.png"
              alt="RoboLike"
              className="h-20 w-auto"
            />
          </div>

          {/* Main Hero Content */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
            <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Grow Your Instagram
            </span>
            <br />
            <span className="text-gray-900">On Autopilot</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            The safe, local Instagram automation tool that helps you connect with real followers 
            while you focus on creating amazing content.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/install-guide"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Download Free
            </Link>
            <Link
              to="/instagram-auto-liker-how-it-works"
              className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg border-2 border-gray-200 transition-colors"
            >
              How It Works
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>100% Local & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>No Passwords Stored</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Real Engagement</span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with RoboLike in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-orange-600 text-3xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pick Your Hashtags</h3>
              <p className="text-gray-600 leading-relaxed">
                Target your ideal audience by selecting hashtags relevant to your niche or industry.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-pink-600 text-3xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect & Start</h3>
              <p className="text-gray-600 leading-relaxed">
                Securely connect your Instagram account and let RoboLike handle the engagement automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-purple-600 text-3xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Watch Growth</h3>
              <p className="text-gray-600 leading-relaxed">
                See real followers, likes, and engagement flowing to your account while you create content.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Why Choose RoboLike?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for creators who want real growth without compromising security
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
              <div className="text-orange-500 text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real Growth</h3>
              <p className="text-gray-600">
                Connect with genuine followers who are actually interested in your content
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
              <div className="text-green-500 text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Secure</h3>
              <p className="text-gray-600">
                Runs locally on your machine - your credentials never leave your computer
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
              <div className="text-blue-500 text-4xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Setup</h3>
              <p className="text-gray-600">
                Get started in minutes with our simple, user-friendly interface
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
              <div className="text-purple-500 text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Save Time</h3>
              <p className="text-gray-600">
                Focus on creating while RoboLike handles the time-consuming engagement work
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
            Join Thousands of Happy Users
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="p-6">
              <div className="text-4xl font-bold text-orange-600 mb-2">100K+</div>
              <div className="text-gray-600">Users Served</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-pink-600 mb-2">10B+</div>
              <div className="text-gray-600">Likes Delivered</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">500K+</div>
              <div className="text-gray-600">New Followers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-20 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Ready to Grow Your Instagram?
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Download RoboLike today and start connecting with your ideal audience. 
            It's free to get started!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              to="/install-guide"
              className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-lg font-bold text-xl transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Download Free Now
            </Link>
            <Link
              to="/social-media-automation-pricing"
              className="text-orange-600 hover:text-orange-700 font-medium text-lg"
            >
              View Pricing →
            </Link>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200 max-w-2xl mx-auto">
            <p className="text-orange-800 text-sm leading-relaxed">
              <strong>Note:</strong> Your computer must remain on while RoboLike is running. 
              It works with your screen locked, but not in sleep mode.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
