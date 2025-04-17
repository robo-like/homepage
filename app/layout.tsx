import { Outlet, useOutletContext } from "react-router";
import { Header } from "~/components/Header";
import type { Route } from "./+types/layout";
import React from "react";
import { FloatingContactButton } from "~/components/FloatingContactButton";
import type { OutletContext } from "./root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'const page = new RoboLike("(internal) Layout"); //@todo' },
    {
      name: "description",
      content: "***INTERAL USE ONLY*** this page is a backdoor.",
    },
  ];
}

export default function Layout() {
  const { user } = useOutletContext<OutletContext>();
  const isLoggedIn = !!user;

  return (
    <>
      {/* Background Canvas for Hearts */}
      <FloatingHeartsBackground />
      
      {/* Layout Container */}
      <div className="min-h-screen flex flex-col relative z-10">
        <Header />
        <main className="flex-grow pb-10">
          <Outlet />
        </main>
        {/* <Footer /> */}
      </div>
      {isLoggedIn && <FloatingContactButton />}
    </>
  );
}

// Reusable Floating Hearts Component
function FloatingHeartsBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
      speed: number;
    }[] = [];

    // Initialize hearts
    const initHearts = () => {
      hearts.length = 0;
      for (let i = 0; i < 15; i++) {
        hearts.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          color: retro80sColors[Math.floor(Math.random() * retro80sColors.length)],
          size: 30 + Math.random() * 70,
          speed: 0.5 + Math.random() * 1.5,
        });
      }
    };

    const drawHeart = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      color: string,
      size = 80
    ) => {
      const scale = size / 16; // Scale factor for smooth resolution

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
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
    };

    const drawHearts = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines for retro effect
      const gridSize = 40;
      ctx.strokeStyle = "rgba(7, 176, 239, 0.1)";
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
      hearts.forEach((heart) => {
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
    <canvas
      ref={canvasRef}
      className="block w-full h-full fixed top-0 left-0 z-0 pointer-events-none"
      style={{ backgroundColor: "rgba(10, 10, 10, 0.95)" }}
    />
  );
}
