import type { Route } from "./+types/home";
import React, { useEffect, useRef, useState } from "react";
import logoDark from "../home/heart.png";

const futureDate = new Date("2025-05-01");

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RoboLike - Under Construction" },
    {
      name: "description",
      content:
        "RoboLike is under construction. Coming soon - your entry point to reaching your fans, audience, customers, all at the click of a robot's button.",
    },
    {
      name: "image",
      content: "/homepage-image.gif",
    },
  ];
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size = 80) {
  const scale = size / 16; // Scale factor for smooth resolution
  
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let t = 0; t <= Math.PI * 2; t += 0.01) {
    const heartX = 16 * Math.sin(t) ** 3;
    const heartY = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    
    ctx.lineTo(x + heartX * scale, y - heartY * scale);
  }
  
  ctx.stroke();
}

const retro80sColors = [
  "#f7ee2a", // Vibrant Yellow
  "#ed1e79", // Hot Pink
  "#07b0ef", // Electric Blue
  "#9633ac", // Purple
  "#FA8E10", // Orange
];

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [countdown, setCountdown] = useState<number>(0);
  
  // Calculate countdown to a future date (30 days from now)
  useEffect(() => {
    futureDate.setDate(futureDate.getDate() + 30);
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = futureDate.getTime() - now.getTime();
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      setCountdown(days);
    };
    
    updateCountdown();
    const timer = setInterval(updateCountdown, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const hearts: {x: number, y: number, color: string, size: number, speed: number}[] = [];
    
    // Initialize hearts
    const initHearts = () => {
      hearts.length = 0;
      for (let i = 0; i < 15; i++) {
        hearts.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          color: retro80sColors[Math.floor(Math.random() * retro80sColors.length)],
          size: 30 + Math.random() * 70,
          speed: 0.5 + Math.random() * 1.5
        });
      }
    };
    
    const drawHearts = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid lines for retro effect (same as the installation page)
      const gridSize = 40;
      ctx.strokeStyle = 'rgba(7, 176, 239, 0.1)';
      ctx.lineWidth = 1;
      
      // Draw vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Draw horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw hearts
      hearts.forEach(heart => {
        drawHeart(ctx, heart.x, heart.y, heart.color, heart.size);
        // Move heart upward
        heart.y -= heart.speed;
        
        // If heart moves off screen, reset it at the bottom
        if (heart.y < -heart.size) {
          heart.y = canvas.height + heart.size;
          heart.x = Math.random() * canvas.width;
          heart.color = retro80sColors[Math.floor(Math.random() * retro80sColors.length)];
        }
      });
      
      requestAnimationFrame(drawHearts);
    };

    resizeCanvas();
    initHearts();
    drawHearts();
    window.addEventListener("resize", () => {
      resizeCanvas();
      initHearts();
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="font-set-1 min-h-screen overflow-hidden relative">
      {/* Canvas Background */}
      <canvas ref={canvasRef} className="block w-full h-full fixed top-0 left-0 z-0" />
      
      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white p-6 mt-[-60px]">
        <div className="max-w-5xl w-full bg-[#0A0A0A] bg-opacity-70 rounded-lg border-2 border-[#07b0ef] p-8 backdrop-blur-sm">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src={logoDark} 
              alt="RoboLike Logo" 
              className="w-24 animate-pulse" 
            />
          </div>
          
          {/* Main Title */}
          <h1 
            className="text-center text-4xl md:text-5xl lg:text-6xl mb-6 neon-glow" 
            style={{ fontFamily: 'var(--heading-font, "Press Start 2P", cursive)' }}
          >
            UNDER CONSTRUCTION
          </h1>
          
          {/* Divider */}
          <div className="w-full h-1 my-4 bg-gradient-to-r from-[#ed1e79] via-[#07b0ef] to-[#f7ee2a]"></div>
          
          {/* Countdown */}
          <div className="text-center my-8">
            <p 
              className="text-xl mb-2" 
              style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
            >
              LAUNCHING IN
            </p>
            <div 
              className="text-6xl font-bold text-[#f7ee2a]" 
              style={{ fontFamily: 'var(--heading-font, "Press Start 2P", cursive)' }}
            >
              {countdown}
            </div>
            <p 
              className="text-xl mt-2" 
              style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
            >
              DAYS
            </p>
          </div>
          
          {/* Description */}
          <p 
            className="text-center text-lg md:text-xl mb-8" 
            style={{ fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)' }}
          >
            We're building something awesome! Our new site is coming soon with 
            powerful social media automation tools to help you reach your audience.
          </p>
          
          {/* CTA */}
          <div className="flex justify-center">
            <a 
              href="/install-guide" 
              className="relative py-4 px-8 retro-button primary mx-2"
            >
              INSTALLATION GUIDE
            </a>
            <a 
              href="/install-guide" 
              className="relative py-4 px-8 retro-button mx-2"
            >
              DOWNLOAD NOW
            </a>
          </div>
          
          {/* Divider */}
          <div className="w-full h-1 my-6 bg-gradient-to-r from-[#f7ee2a] via-[#ed1e79] to-[#07b0ef]"></div>
          
          {/* Social Media */}
          <div className="text-center mt-4">
            <p 
              className="text-gray-400 mb-2" 
              style={{ fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)' }}
            >
              Stay tuned for updates:
            </p>
            <div className="flex justify-center space-x-4">
              {/* Social Icons - using simple text for now */}
              <a 
                href="#" 
                className="text-[#07b0ef] hover:text-[#f7ee2a] transition-colors"
                style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
              >
                TWITTER
              </a>
              <a 
                href="#" 
                className="text-[#07b0ef] hover:text-[#f7ee2a] transition-colors"
                style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
              >
                INSTAGRAM
              </a>
              <a 
                href="#" 
                className="text-[#07b0ef] hover:text-[#f7ee2a] transition-colors"
                style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
              >
                DISCORD
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
