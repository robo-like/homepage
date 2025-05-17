import type { Route } from "./+types/home";
import React, { useEffect, useRef, useState } from "react";
import logoDark from "../home/heart.png";

const futureDate = new Date("2025-05-01");

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RoboLike, Instagram Auto Liker" },
    {
      name: "description",
      content:
        "Get more Instagram followers effortlessly with RoboLike's powerful auto liker. Grow your audience, increase engagement, and connect with real followers automatically.",
    },
    // Standard OpenGraph Meta Tags
    {
      property: "og:title",
      content: "RoboLike, Instagram Auto Liker",
    },
    {
      property: "og:description",
      content:
        "Get more Instagram followers effortlessly with RoboLike's powerful auto liker. Grow your audience, increase engagement, and connect with real followers automatically.",
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

function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  size = 80
) {
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
}

const retro80sColors = [
  "#f7ee2a", // Vibrant Yellow
  "#ed1e79", // Hot Pink
  "#07b0ef", // Electric Blue
  "#9633ac", // Purple
  "#FA8E10", // Orange
];

export default function Home() {
  return (
    <div className="font-set-1 min-h-screen overflow-hidden relative">
      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white p-6">
        <div className="max-w-5xl w-full bg-[#0A0A0A] bg-opacity-70 rounded-lg border-2 border-[#07b0ef] p-8 backdrop-blur-sm">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={logoDark}
              alt="RoboLike Logo"
              className="w-24 animate-pulse"
            />
          </div>

          {/* Main Title */}
          <h1
            className="text-center text-4xl md:text-5xl lg:text-6xl mb-4 gradient-text"
            style={{
              fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
            }}
          >
            BOOST YOUR INSTAGRAM
          </h1>

          {/* Subtitle */}
          <p
            className="text-center text-xl md:text-2xl mb-6 text-[#f7ee2a]"
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            CONNECT WITH FANS. FIND NEW CLIENTS. GROW YOUR PRESENCE.
          </p>

          {/* Divider */}
          <div className="w-full h-1 my-4 bg-gradient-to-r from-[#ed1e79] via-[#07b0ef] to-[#f7ee2a]"></div>

          {/* Feature Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="bg-black bg-opacity-40 p-6 rounded-lg border border-[#ed1e79] text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#ed1e79] text-2xl font-bold">
                  1
                </div>
              </div>
              <h3
                className="text-xl mb-2 text-[#ed1e79]"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                PICK A HASHTAG
              </h3>
              <p
                className="text-gray-300"
                style={{
                  fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                }}
              >
                Target your audience with relevant hashtags for your niche or
                industry.
              </p>
            </div>

            <div className="bg-black bg-opacity-40 p-6 rounded-lg border border-[#07b0ef] text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#07b0ef] text-2xl font-bold">
                  2
                </div>
              </div>
              <h3
                className="text-xl mb-2 text-[#07b0ef]"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                LOG IN & START
              </h3>
              <p
                className="text-gray-300"
                style={{
                  fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                }}
              >
                Connect your Instagram account and let RoboLike do the work
                while you focus on creating content.
              </p>
            </div>

            <div className="bg-black bg-opacity-40 p-6 rounded-lg border border-[#f7ee2a] text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#f7ee2a] text-black text-2xl font-bold">
                  3
                </div>
              </div>
              <h3
                className="text-xl mb-2 text-[#f7ee2a]"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                GROW FOLLOWERS
              </h3>
              <p
                className="text-gray-300"
                style={{
                  fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                }}
              >
                Watch as new followers, likes, and comments start flowing to
                your account.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col md:flex-row items-center justify-center my-16">
            <a
              href="/install-guide"
              className="relative py-4 px-8 retro-button primary w-full md:w-auto text-center"
            >
              GET STARTED
            </a>
          </div>

          {/* Benefits */}
          <div className="mb-8">
            <h2
              className="text-2xl md:text-3xl mb-4 text-center neon-glow"
              style={{
                fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
              }}
            >
              LEVEL UP YOUR SOCIAL GAME
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-start">
                <div className="text-[#9633ac] text-2xl mr-3">⚡</div>
                <div>
                  <h4
                    className="text-xl text-[#9633ac] mb-1"
                    style={{
                      fontFamily:
                        'var(--subheading-font, "Orbitron", sans-serif)',
                    }}
                  >
                    More Engagement
                  </h4>
                  <p
                    className="text-gray-300"
                    style={{
                      fontFamily:
                        'var(--body-font, "Chakra Petch", sans-serif)',
                    }}
                  >
                    Increase likes, comments, and follows on your content
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-[#FA8E10] text-2xl mr-3">🚀</div>
                <div>
                  <h4
                    className="text-xl text-[#FA8E10] mb-1"
                    style={{
                      fontFamily:
                        'var(--subheading-font, "Orbitron", sans-serif)',
                    }}
                  >
                    Grow Your Audience
                  </h4>
                  <p
                    className="text-gray-300"
                    style={{
                      fontFamily:
                        'var(--body-font, "Chakra Petch", sans-serif)',
                    }}
                  >
                    Connect with potential followers who share your interests
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-[#ed1e79] text-2xl mr-3">💰</div>
                <div>
                  <h4
                    className="text-xl text-[#ed1e79] mb-1"
                    style={{
                      fontFamily:
                        'var(--subheading-font, "Orbitron", sans-serif)',
                    }}
                  >
                    Find New Clients
                  </h4>
                  <p
                    className="text-gray-300"
                    style={{
                      fontFamily:
                        'var(--body-font, "Chakra Petch", sans-serif)',
                    }}
                  >
                    Turn followers into customers with increased visibility
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-[#07b0ef] text-2xl mr-3">⚙️</div>
                <div>
                  <h4
                    className="text-xl text-[#07b0ef] mb-1"
                    style={{
                      fontFamily:
                        'var(--subheading-font, "Orbitron", sans-serif)',
                    }}
                  >
                    Run On Your Machine
                  </h4>
                  <p
                    className="text-gray-300"
                    style={{
                      fontFamily:
                        'var(--body-font, "Chakra Petch", sans-serif)',
                    }}
                  >
                    Keep your account secure by running locally (just keep your
                    computer on)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-black bg-opacity-50 p-4 rounded-lg border border-[#f7ee2a] mb-8">
            <p
              className="text-[#f7ee2a] text-sm"
              style={{
                fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
              }}
            >
              <strong>NOTE:</strong> Your computer must remain on while RoboLike
              is running. It will work with your screen locked, but not in sleep
              mode or with the lid closed.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col md:flex-row items-center justify-center my-16">
            <a
              href="/install-guide"
              className="relative py-4 px-8 retro-button primary w-full md:w-auto text-center"
            >
              GET STARTED
            </a>
          </div>

          {/* Divider */}
          <div className="w-full h-1 my-6 bg-gradient-to-r from-[#f7ee2a] via-[#ed1e79] to-[#07b0ef]"></div>
        </div>
      </div>
    </div>
  );
}
