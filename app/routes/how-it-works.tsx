import type { Route } from "./+types/how-it-works";
import logoDark from "../home/heart.png";
import { useRef, useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "How RoboLike Works - Level Up Your Instagram Game" },
    {
      name: "description",
      content:
        "Discover how RoboLike powers up your Instagram presence by engaging with your target audience, driving real followers, and boosting your social credibility.",
    },
    // OpenGraph tags
    {
      property: "og:title",
      content: "How RoboLike Works - Level Up Your Instagram Game",
    },
    {
      property: "og:description",
      content:
        "Discover how RoboLike powers up your Instagram presence by engaging with your target audience, driving real followers, and boosting your social credibility.",
    },
    {
      property: "og:type",
      content: "website",
    },
  ];
}

export default function HowItWorks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Add grid background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(document.body.scrollHeight, window.innerHeight);
    };

    const drawGrid = () => {
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
    };

    resizeCanvas();
    drawGrid();

    window.addEventListener("resize", () => {
      resizeCanvas();
      drawGrid();
    });

    // Redraw on scroll to ensure grid covers full scrollable area
    window.addEventListener("scroll", () => {
      resizeCanvas();
      drawGrid();
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", drawGrid);
    };
  }, []);

  return (
    <div className="font-set-1 min-h-screen text-white relative pb-16">
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <a href="/">
              <img
                src={logoDark}
                alt="RoboLike Logo"
                className="w-20 h-20 animate-pulse mx-auto cursor-pointer"
              />
            </a>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl mb-4 gradient-text"
            style={{
              fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
            }}
          >
            HOW ROBOLIKE WORKS
          </h1>
          <div className="w-full max-w-4xl mx-auto h-1 my-6 bg-gradient-to-r from-[#ed1e79] via-[#07b0ef] to-[#f7ee2a]"></div>
          <p
            className="text-xl md:text-2xl text-[#f7ee2a] max-w-3xl mx-auto"
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            POWER UP YOUR INSTAGRAM WITH REAL ENGAGEMENT
          </p>
        </div>

        {/* Steps Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          <div className="bg-black bg-opacity-40 p-6 rounded-lg border-2 border-[#ed1e79] text-center">
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 flex items-center justify-center rounded-full bg-[#ed1e79] text-3xl font-bold"
                style={{
                  fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
                }}
              >
                1
              </div>
            </div>
            <h2
              className="text-2xl mb-3 text-[#ed1e79]"
              style={{
                fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
              }}
            >
              DOWNLOAD & INSTALL
            </h2>
            <p
              className="text-gray-300"
              style={{
                fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
              }}
            >
              Get the app running on your machine. This gives you full control
              and maximum security since everything runs locally.
            </p>
          </div>

          <div className="bg-black bg-opacity-40 p-6 rounded-lg border-2 border-[#07b0ef] text-center">
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 flex items-center justify-center rounded-full bg-[#07b0ef] text-3xl font-bold"
                style={{
                  fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
                }}
              >
                2
              </div>
            </div>
            <h2
              className="text-2xl mb-3 text-[#07b0ef]"
              style={{
                fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
              }}
            >
              CONNECT ACCOUNT
            </h2>
            <p
              className="text-gray-300"
              style={{
                fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
              }}
            >
              Log in to your Instagram securely through the app. Your
              credentials stay on your device - we never see them.
            </p>
          </div>

          <div className="bg-black bg-opacity-40 p-6 rounded-lg border-2 border-[#f7ee2a] text-center">
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 flex items-center justify-center rounded-full bg-[#f7ee2a] text-3xl font-bold text-black"
                style={{
                  fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
                }}
              >
                3
              </div>
            </div>
            <h2
              className="text-2xl mb-3 text-[#f7ee2a]"
              style={{
                fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
              }}
            >
              TARGET & ACTIVATE
            </h2>
            <p
              className="text-gray-300"
              style={{
                fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
              }}
            >
              Choose hashtags that match your audience. Hit start and watch as
              RoboLike engages with potential followers in your niche.
            </p>
          </div>
        </div>

        {/* How It Actually Works Section */}
        <div className="max-w-4xl mx-auto bg-black bg-opacity-60 p-8 rounded-lg border-2 border-[#07b0ef] mb-16">
          <h2
            className="text-3xl mb-6 text-center neon-glow"
            style={{
              fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
            }}
          >
            ENGAGEMENT POWERUP
          </h2>

          <div
            className="space-y-6 text-lg"
            style={{
              fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
            }}
          >
            <p className="text-gray-100">
              RoboLike works by{" "}
              <span className="text-[#ed1e79] font-bold">
                automatically liking posts
              </span>{" "}
              from hashtags you choose. This sends notifications to those users,
              showing your profile and content.
            </p>

            <p className="text-gray-100">
              When someone gets a like notification, they often{" "}
              <span className="text-[#f7ee2a] font-bold">
                check out who liked their post
              </span>
              . If your content resonates with them, they'll likely follow back,
              like your posts, or even leave comments.
            </p>

            <p className="text-gray-100">
              It's like walking into a networking event and introducing yourself
              to people who share your interests. Except RoboLike does this at
              scale, <span className="text-[#07b0ef] font-bold">24/7</span>,
              while you focus on creating amazing content.
            </p>

            <div className="bg-[#1c1c1c] p-4 rounded-lg border border-[#9633ac] my-8">
              <h3
                className="text-xl mb-3 text-[#9633ac]"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                THE INSTAGRAM ALGORITHM LOVES IT
              </h3>
              <p className="text-gray-100">
                Instagram's algorithm rewards active accounts. By consistently
                engaging with content in your niche, you signal to Instagram
                that you're an active, valuable community member - which can
                boost your own content's visibility.
              </p>
            </div>
          </div>
        </div>

        {/* Results You Can Expect */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2
            className="text-3xl mb-8 text-center text-[#f7ee2a]"
            style={{
              fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
            }}
          >
            LEVEL UP YOUR STATS
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-black bg-opacity-40 p-6 rounded-lg border border-[#ed1e79]">
              <div className="flex items-start">
                <div className="text-[#ed1e79] text-3xl mr-4">⬆️</div>
                <div>
                  <h3
                    className="text-xl mb-2 text-[#ed1e79]"
                    style={{
                      fontFamily:
                        'var(--subheading-font, "Orbitron", sans-serif)',
                    }}
                  >
                    MORE FOLLOWERS
                  </h3>
                  <p
                    className="text-gray-300"
                    style={{
                      fontFamily:
                        'var(--body-font, "Chakra Petch", sans-serif)',
                    }}
                  >
                    Users who notice your likes often check out your profile and
                    follow if they like what they see. Grow your audience with
                    people who match your interests.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black bg-opacity-40 p-6 rounded-lg border border-[#07b0ef]">
              <div className="flex items-start">
                <div className="text-[#07b0ef] text-3xl mr-4">🔄</div>
                <div>
                  <h3
                    className="text-xl mb-2 text-[#07b0ef]"
                    style={{
                      fontFamily:
                        'var(--subheading-font, "Orbitron", sans-serif)',
                    }}
                  >
                    HIGHER ENGAGEMENT
                  </h3>
                  <p
                    className="text-gray-300"
                    style={{
                      fontFamily:
                        'var(--body-font, "Chakra Petch", sans-serif)',
                    }}
                  >
                    When you engage with others, they're more likely to engage
                    back. Expect more likes, comments, and DMs on your own
                    content.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black bg-opacity-40 p-6 rounded-lg border border-[#f7ee2a]">
              <div className="flex items-start">
                <div className="text-[#f7ee2a] text-3xl mr-4">🎯</div>
                <div>
                  <h3
                    className="text-xl mb-2 text-[#f7ee2a]"
                    style={{
                      fontFamily:
                        'var(--subheading-font, "Orbitron", sans-serif)',
                    }}
                  >
                    TARGETED REACH
                  </h3>
                  <p
                    className="text-gray-300"
                    style={{
                      fontFamily:
                        'var(--body-font, "Chakra Petch", sans-serif)',
                    }}
                  >
                    By focusing on specific hashtags, you reach people who are
                    already interested in your niche. Better quality connections
                    lead to higher conversion rates.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black bg-opacity-40 p-6 rounded-lg border border-[#9633ac]">
              <div className="flex items-start">
                <div className="text-[#9633ac] text-3xl mr-4">⏱️</div>
                <div>
                  <h3
                    className="text-xl mb-2 text-[#9633ac]"
                    style={{
                      fontFamily:
                        'var(--subheading-font, "Orbitron", sans-serif)',
                    }}
                  >
                    TIME FREEDOM
                  </h3>
                  <p
                    className="text-gray-300"
                    style={{
                      fontFamily:
                        'var(--body-font, "Chakra Petch", sans-serif)',
                    }}
                  >
                    Focus on creating great content while RoboLike handles the
                    time-consuming engagement work. Your account grows even
                    while you sleep.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="max-w-4xl mx-auto mb-16 bg-black bg-opacity-40 p-8 rounded-lg border-2 border-[#f7ee2a]">
          <h2
            className="text-2xl mb-6 text-center text-[#f7ee2a]"
            style={{
              fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
            }}
          >
            SECURITY SHIELD
          </h2>

          <div className="space-y-4">
            <p
              className="text-gray-200 text-lg mb-4"
              style={{
                fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
              }}
            >
              The RoboLike app runs completely on{" "}
              <span className="text-[#f7ee2a] font-bold">YOUR MACHINE</span>,
              giving you maximum security:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="text-[#07b0ef] mr-3 text-2xl">🔒</div>
                <div>
                  <p
                    className="text-gray-200"
                    style={{
                      fontFamily:
                        'var(--body-font, "Chakra Petch", sans-serif)',
                    }}
                  >
                    <span className="text-[#07b0ef] font-bold">
                      Local Credentials
                    </span>{" "}
                    - Your login info never leaves your computer
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-[#07b0ef] mr-3 text-2xl">🌐</div>
                <div>
                  <p
                    className="text-gray-200"
                    style={{
                      fontFamily:
                        'var(--body-font, "Chakra Petch", sans-serif)',
                    }}
                  >
                    <span className="text-[#07b0ef] font-bold">
                      Your IP Address
                    </span>{" "}
                    - All activity comes from your own IP, just like normal
                    usage
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-[#07b0ef] mr-3 text-2xl">🛡️</div>
                <div>
                  <p
                    className="text-gray-200"
                    style={{
                      fontFamily:
                        'var(--body-font, "Chakra Petch", sans-serif)',
                    }}
                  >
                    <span className="text-[#07b0ef] font-bold">
                      No Data Breaches
                    </span>{" "}
                    - No central server storing your information
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-[#07b0ef] mr-3 text-2xl">🎮</div>
                <div>
                  <p
                    className="text-gray-200"
                    style={{
                      fontFamily:
                        'var(--body-font, "Chakra Petch", sans-serif)',
                    }}
                  >
                    <span className="text-[#07b0ef] font-bold">
                      Full Control
                    </span>{" "}
                    - Adjust settings or pause at any time
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black p-4 rounded mt-6 border-t border-b border-[#07b0ef]">
              <p
                className="text-[#f7ee2a] text-sm"
                style={{
                  fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                }}
              >
                <strong>NOTE:</strong> Your computer must remain on while
                RoboLike is running. It will work with your screen locked, but
                not in sleep mode or with the lid closed.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl mb-6 gradient-text"
            style={{
              fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
            }}
          >
            READY TO POWER UP?
          </h2>

          <p
            className="text-xl mb-8 text-white"
            style={{
              fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
            }}
          >
            Join thousands of users who are growing their Instagram presence
            with RoboLike
          </p>

          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#FA8E10] blur-lg opacity-30 animate-pulse rounded-lg"></div>
            <a
              href="/install-guide"
              className="relative inline-block py-4 px-12 retro-button primary text-xl"
            >
              DOWNLOAD NOW
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
