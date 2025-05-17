import { useState, useEffect } from "react";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/install-guide";
import { cn } from "~/lib/utils";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const REPO_OWNER = "robo-like";
    const REPO_NAME = "desktop";
    const REPO_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`;
    const response = await fetch(REPO_URL, {
      headers: {
        Authorization: `token ${process.env.GITHUB_PAT}`,
      },
    });
    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const releaseData = await response.json();

    return {
      releaseVersion: releaseData.tag_name || "Unknown",
      releaseDate: releaseData.published_at
        ? new Date(releaseData.published_at).toLocaleDateString()
        : "Unknown",
      assets: releaseData.assets || [],
      releaseUrl: releaseData.html_url || "#",
      repoOwner: REPO_OWNER,
      repoName: REPO_NAME,
    };
  } catch (error) {
    console.error("ERROR FETCHING LATEST RELEASE FROM GITHUB");
    return {
      releaseVersion: "v1.0.0",
      releaseDate: "Coming Soon",
      assets: [],
      releaseUrl: "#",
      repoOwner: "robo-like",
      repoName: "new-homepage",
    };
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RoboLike Installation Guide - Power Up Your Social Media" },
    {
      name: "description",
      content:
        "Download and install RoboLike to supercharge your social media presence. Easy setup for Windows, MacOS, and Linux.",
    },
    // OpenGraph tags
    {
      property: "og:title",
      content: "RoboLike Installation Guide - Power Up Your Social Media",
    },
    {
      property: "og:description",
      content:
        "Download and install RoboLike to supercharge your social media presence. Easy setup for Windows, MacOS, and Linux.",
    },
    {
      property: "og:type",
      content: "website",
    },
  ];
}

export default function InstallGuide() {
  const releaseData = useLoaderData<typeof loader>();
  const [selectedPlatform, setSelectedPlatform] = useState<string>("macos");
  const [detectedOS, setDetectedOS] = useState<string | null>(null);
  const [macArchitecture, setMacArchitecture] = useState<
    "arm64" | "x64" | null
  >(null);
  const [intelRequested, setIntelRequested] = useState(false);

  // Get the download URL for the selected platform
  const getDownloadUrl = () => {
    if (!releaseData.assets || releaseData.assets.length === 0) {
      return null;
    }
    const macExtensions = {
      arm64: ["darwin-arm64", "arm64.dmg", "arm64.pkg"],
      x64: ["darwin-x64", "x64.dmg", "x64.pkg"],
      default: ["darwin", ".dmg", ".pkg"],
    };
    const otherExtensions = {
      windows: ["win", ".exe", ".msi"],
      linux: ["linux", ".deb", ".AppImage", ".rpm"],
    };
    let platformExtensions: string[] = [];
    if (selectedPlatform === "macos" && macArchitecture) {
      platformExtensions =
        macExtensions[macArchitecture] || macExtensions.default;
    } else {
      platformExtensions =
        otherExtensions[selectedPlatform as keyof typeof otherExtensions] || [];
    }
    // Find the first asset that matches the selected platform
    const asset = releaseData.assets.find(
      (asset: { name: string; browser_download_url: string }) => {
        const name = asset.name.toLowerCase();
        return platformExtensions.some((ext: string) => name.includes(ext));
      }
    );
    return asset ? asset.browser_download_url : null;
  };

  // Detect user's operating system on mount
  useEffect(() => {
    const detectOS = () => {
      const platform = window.navigator.platform.toLowerCase();
      const userAgent = window.navigator.userAgent.toLowerCase();

      if (platform.includes("mac") || userAgent.includes("mac")) {
        // Check for MacOS version to determine architecture
        const macVersionMatch = userAgent.match(
          /Mac OS X (\d+)[_.](\d+)|macOS (\d+)[_.](\d+)/
        );
        if (!macVersionMatch) {
          setMacArchitecture("arm64"); // Default to arm64 for newer Macs
          return "macos";
        }
        const majorVersion = parseInt(macVersionMatch[1]);
        const minorVersion = parseInt(macVersionMatch[2]);
        // MacOS 10.15 or higher is likely Apple Silicon
        const isAppleSilicon =
          majorVersion > 10 || (majorVersion === 10 && minorVersion >= 15);
        setMacArchitecture(isAppleSilicon ? "arm64" : "x64");
      } else if (platform.includes("win") || userAgent.includes("win")) {
        return "windows";
      } else if (platform.includes("linux") || userAgent.includes("linux")) {
        return "linux";
      }
      return null;
    };

    const os = detectOS();
    if (os) {
      setDetectedOS(os);
      setSelectedPlatform(os);
    }
  }, []);

  return (
    <div className="font-set-1 min-h-screen flex flex-col text-white mt-[5px] pt-[73px]">
      {/* Grid Lines Background */}
      <div className="fixed inset-0 grid-lines opacity-70 z-[-1]"></div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 text-center flex-1 z-2">
        <h1
          className="text-3xl md:text-4xl mb-6 gradient-text"
          style={{
            fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
            lineHeight: "1.4",
          }}
        >
          POWER UP YOUR SOCIAL MEDIA
        </h1>

        <div className="w-full h-1 my-4 bg-gradient-to-r from-[#ed1e79] via-[#07b0ef] to-[#f7ee2a]"></div>

        <p
          className="text-xl mb-12 max-w-2xl mx-auto"
          style={{
            fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
          }}
        >
          Follow our arcade-simple installation guide to install RoboLike and
          start your journey to social media domination.
        </p>

        {/* Platform Selector */}
        <div className="mb-16">
          {detectedOS && (
            <div className="mb-2 text-center">
              <span
                className="inline-block px-4 mb-3 py-1 text-xs bg-[#07b0ef] text-black rounded-md"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                🎮 WE DETECTED YOUR OS: {detectedOS.toUpperCase()}
                {macArchitecture && ` (${macArchitecture.toUpperCase()})`}
                🎮
              </span>
            </div>
          )}

          <div className="inline-flex rounded-md overflow-hidden border border-[#07b0ef] mx-auto">
            <div
              onClick={() => setSelectedPlatform("macos")}
              className={cn(
                "px-6 py-3 font-medium text-lg cursor-pointer",
                selectedPlatform === "macos"
                  ? "bg-[#07b0ef] text-black"
                  : "hover:bg-[rgba(7,176,239,0.2)]"
              )}
              style={{
                fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
              }}
            >
              MACOS
            </div>
            <div
              onClick={() => setSelectedPlatform("windows")}
              className={cn(
                "px-6 py-3 font-medium text-lg cursor-pointer border-l border-r border-[#07b0ef]",
                selectedPlatform === "windows"
                  ? "bg-[#07b0ef] text-black"
                  : "hover:bg-[rgba(7,176,239,0.2)]"
              )}
              style={{
                fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
              }}
            >
              WINDOWS
            </div>
            <div
              onClick={() => setSelectedPlatform("linux")}
              className={cn(
                "px-6 py-3 font-medium text-lg cursor-pointer",
                selectedPlatform === "linux"
                  ? "bg-[#07b0ef] text-black"
                  : "hover:bg-[rgba(7,176,239,0.2)]"
              )}
              style={{
                fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
              }}
            >
              LINUX
            </div>
          </div>
        </div>

        {/* Mac Architecture Selector */}
        {selectedPlatform === "macos" && (
          <div className="mb-8">
            <div className="inline-flex rounded-md overflow-hidden border border-[#07b0ef] mx-auto">
              <div
                onClick={() => setMacArchitecture("arm64")}
                className={cn(
                  "px-6 py-3 font-medium text-lg cursor-pointer",
                  macArchitecture === "arm64"
                    ? "bg-[#07b0ef] text-black"
                    : "hover:bg-[rgba(7,176,239,0.2)]"
                )}
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                APPLE SILICON (M1/M2/M3)
              </div>
              <div
                onClick={() => setMacArchitecture("x64")}
                className={cn(
                  "px-6 py-3 font-medium text-lg cursor-pointer border-l border-[#07b0ef]",
                  macArchitecture === "x64"
                    ? "bg-[#07b0ef] text-black"
                    : "hover:bg-[rgba(7,176,239,0.2)]"
                )}
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                INTEL
              </div>
            </div>
          </div>
        )}

        {/* Installation Steps */}
        <div className="bg-[#1c1c1c] rounded-xl p-8 mb-12 border-2 border-[#07b0ef]">
          {selectedPlatform === "macos" && (
            <div className="text-left">
              <h2
                className="text-2xl mb-6 text-[#f7ee2a] text-center neon-glow"
                style={{
                  fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
                }}
              >
                INSTALLING ON MACOS
              </h2>

              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#ed1e79]">1</div>
                  </div>
                  <div>
                    <h3
                      className="text-xl mb-2 text-[#ed1e79]"
                      style={{
                        fontFamily:
                          'var(--subheading-font, "Orbitron", sans-serif)',
                      }}
                    >
                      DOWNLOAD THE INSTALLER
                    </h3>
                    <p
                      className="text-gray-300"
                      style={{
                        fontFamily:
                          'var(--body-font, "Chakra Petch", sans-serif)',
                      }}
                    >
                      Click the download button at the bottom to get the latest
                      version of RoboLike for MacOS. You may need to click
                      "Accept" or "Keep" in your browser since this is a zip
                      file.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#07b0ef]">2</div>
                  </div>
                  <div>
                    <h3
                      className="text-xl mb-2 text-[#07b0ef]"
                      style={{
                        fontFamily:
                          'var(--subheading-font, "Orbitron", sans-serif)',
                      }}
                    >
                      OPEN THE ZIP FILE
                    </h3>
                    <p
                      className="text-gray-300"
                      style={{
                        fontFamily:
                          'var(--body-font, "Chakra Petch", sans-serif)',
                      }}
                    >
                      Locate the downloaded zip file and double-click to extract
                      it. This will create the RoboLike application file.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#f7ee2a] text-black">
                      3
                    </div>
                  </div>
                  <div>
                    <h3
                      className="text-xl mb-2 text-[#f7ee2a]"
                      style={{
                        fontFamily:
                          'var(--subheading-font, "Orbitron", sans-serif)',
                      }}
                    >
                      DRAG TO APPLICATIONS
                    </h3>
                    <p
                      className="text-gray-300"
                      style={{
                        fontFamily:
                          'var(--body-font, "Chakra Petch", sans-serif)',
                      }}
                    >
                      Drag the RoboLike application to your Applications folder
                      to install it. This ensures the app is properly registered
                      with your system.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#9633ac]">4</div>
                  </div>
                  <div>
                    <h3
                      className="text-xl mb-2 text-[#9633ac]"
                      style={{
                        fontFamily:
                          'var(--subheading-font, "Orbitron", sans-serif)',
                      }}
                    >
                      RIGHT-CLICK AND OPEN
                    </h3>
                    <p
                      className="text-gray-300"
                      style={{
                        fontFamily:
                          'var(--body-font, "Chakra Petch", sans-serif)',
                      }}
                    >
                      Navigate to your Applications folder, right-click (or
                      Control-click) on the RoboLike app and select "Open" from
                      the menu. This is important for first-time launch on
                      macOS.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#FA8E10]">5</div>
                  </div>
                  <div>
                    <h3
                      className="text-xl mb-2 text-[#FA8E10]"
                      style={{
                        fontFamily:
                          'var(--subheading-font, "Orbitron", sans-serif)',
                      }}
                    >
                      CONFIRM PERMISSIONS
                    </h3>
                    <p
                      className="text-gray-300"
                      style={{
                        fontFamily:
                          'var(--body-font, "Chakra Petch", sans-serif)',
                      }}
                    >
                      When prompted by macOS security dialog, click "Open" to
                      confirm you want to run the app. After doing this once,
                      you'll be able to open the app normally in the future.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedPlatform === "windows" && (
            <div className="text-left">
              <h2
                className="text-2xl mb-6 text-[#f7ee2a] text-center neon-glow"
                style={{
                  fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
                }}
              >
                INSTALLING ON WINDOWS
              </h2>

              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#ed1e79]">1</div>
                  </div>
                  <div>
                    <h3
                      className="text-xl mb-2 text-[#ed1e79]"
                      style={{
                        fontFamily:
                          'var(--subheading-font, "Orbitron", sans-serif)',
                      }}
                    >
                      DOWNLOAD THE INSTALLER
                    </h3>
                    <p
                      className="text-gray-300"
                      style={{
                        fontFamily:
                          'var(--body-font, "Chakra Petch", sans-serif)',
                      }}
                    >
                      Click the download button at the bottom to get the latest
                      version of RoboLike for Windows (.exe file).
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#07b0ef]">2</div>
                  </div>
                  <div>
                    <h3
                      className="text-xl mb-2 text-[#07b0ef]"
                      style={{
                        fontFamily:
                          'var(--subheading-font, "Orbitron", sans-serif)',
                      }}
                    >
                      RUN THE INSTALLER
                    </h3>
                    <p
                      className="text-gray-300"
                      style={{
                        fontFamily:
                          'var(--body-font, "Chakra Petch", sans-serif)',
                      }}
                    >
                      Locate the downloaded .exe file and double-click to run
                      it.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#f7ee2a] text-black">
                      3
                    </div>
                  </div>
                  <div>
                    <h3
                      className="text-xl mb-2 text-[#f7ee2a]"
                      style={{
                        fontFamily:
                          'var(--subheading-font, "Orbitron", sans-serif)',
                      }}
                    >
                      ACCEPT SECURITY PROMPTS
                    </h3>
                    <p
                      className="text-gray-300"
                      style={{
                        fontFamily:
                          'var(--body-font, "Chakra Petch", sans-serif)',
                      }}
                    >
                      If Windows SmartScreen appears, click "More info" and then
                      "Run anyway" to proceed.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#9633ac]">4</div>
                  </div>
                  <div>
                    <h3
                      className="text-xl mb-2 text-[#9633ac]"
                      style={{
                        fontFamily:
                          'var(--subheading-font, "Orbitron", sans-serif)',
                      }}
                    >
                      FOLLOW INSTALLATION WIZARD
                    </h3>
                    <p
                      className="text-gray-300"
                      style={{
                        fontFamily:
                          'var(--body-font, "Chakra Petch", sans-serif)',
                      }}
                    >
                      Follow the prompts in the installation wizard, choosing
                      your preferred installation location.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#FA8E10]">5</div>
                  </div>
                  <div>
                    <h3
                      className="text-xl mb-2 text-[#FA8E10]"
                      style={{
                        fontFamily:
                          'var(--subheading-font, "Orbitron", sans-serif)',
                      }}
                    >
                      LAUNCH ROBOLIKE
                    </h3>
                    <p
                      className="text-gray-300"
                      style={{
                        fontFamily:
                          'var(--body-font, "Chakra Petch", sans-serif)',
                      }}
                    >
                      Once installation is complete, launch RoboLike from your
                      desktop shortcut or Start menu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedPlatform === "linux" && (
            <div className="text-left">
              <h2
                className="text-2xl mb-6 text-[#f7ee2a] text-center neon-glow"
                style={{
                  fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
                }}
              >
                INSTALLING ON LINUX
              </h2>

              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#ed1e79]">1</div>
                  </div>
                  <div>
                    <h3
                      className="text-xl mb-2 text-[#ed1e79]"
                      style={{
                        fontFamily:
                          'var(--subheading-font, "Orbitron", sans-serif)',
                      }}
                    >
                      DOWNLOAD THE DEB PACKAGE
                    </h3>
                    <p
                      className="text-gray-300"
                      style={{
                        fontFamily:
                          'var(--body-font, "Chakra Petch", sans-serif)',
                      }}
                    >
                      Click the download button at the bottom to get the latest
                      version of RoboLike for Linux (.deb file).
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#07b0ef]">2</div>
                  </div>
                  <div>
                    <h3
                      className="text-xl mb-2 text-[#07b0ef]"
                      style={{
                        fontFamily:
                          'var(--subheading-font, "Orbitron", sans-serif)',
                      }}
                    >
                      INSTALL WITH DPKG
                    </h3>
                    <p
                      className="text-gray-300"
                      style={{
                        fontFamily:
                          'var(--body-font, "Chakra Petch", sans-serif)',
                      }}
                    >
                      Open a terminal, navigate to the download location, and
                      run:
                    </p>
                    <p className="mt-2">
                      <code className="bg-[#0A0A0A] px-2 py-1 rounded border border-[#07b0ef]">
                        sudo dpkg -i robolike_0.0.1_amd64.deb
                      </code>
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#f7ee2a] text-black">
                      3
                    </div>
                  </div>
                  <div>
                    <h3
                      className="text-xl mb-2 text-[#f7ee2a]"
                      style={{
                        fontFamily:
                          'var(--subheading-font, "Orbitron", sans-serif)',
                      }}
                    >
                      LAUNCH ROBOLIKE
                    </h3>
                    <p
                      className="text-gray-300"
                      style={{
                        fontFamily:
                          'var(--body-font, "Chakra Petch", sans-serif)',
                      }}
                    >
                      After installation, you can launch RoboLike from your
                      application menu or by running{" "}
                      <code className="bg-[#0A0A0A] px-2 py-1 rounded border border-[#f7ee2a]">
                        robolike
                      </code>{" "}
                      in the terminal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Download CTA Button with Animation */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-[#FA8E10] blur-lg opacity-30 animate-pulse"></div>

          <a
            href={getDownloadUrl()}
            className="relative inline-block py-4 px-8 retro-button primary"
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            DOWNLOAD FOR {selectedPlatform.toUpperCase()}
          </a>
        </div>

        {/* Release Info */}
        <div
          className="text-sm text-[#07b0ef] mb-6"
          style={{
            fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
          }}
        >
          {releaseData.releaseDate !== "Coming Soon" ? (
            <>
              Latest version: {releaseData.releaseVersion} (Released:{" "}
              {releaseData.releaseDate})
              {getDownloadUrl() ? (
                <span className="ml-2">• Ready for download</span>
              ) : (
                <span className="ml-2">
                  • No {selectedPlatform} build available yet
                </span>
              )}
            </>
          ) : (
            "Release coming soon! Check back later."
          )}
        </div>

        <div className="mt-12 relative">
          <div className="w-full h-1 bg-gradient-to-r from-[#f7ee2a] via-[#ed1e79] to-[#07b0ef]"></div>
          <p
            className="mt-6 text-gray-400 text-sm"
            style={{
              fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
            }}
          >
            By downloading, you agree to our{" "}
            <a
              href="/terms-and-conditions"
              className="text-[#07b0ef] hover:underline"
            >
              Terms and Conditions
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        className="py-6 border-t border-[#1c1c1c] text-center text-gray-500 text-sm z-10"
        style={{
          fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
        }}
      >
        <p>© {new Date().getFullYear()} RoboLike. All rights reserved.</p>
      </div>
    </div>
  );
}
