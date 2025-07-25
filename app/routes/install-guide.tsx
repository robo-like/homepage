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

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Free Instagram Auto Liker Installation - RoboLike" },
    {
      name: "description",
      content:
        "Download free Instagram auto liker RoboLike. Easy installation guide for Windows, MacOS, and Linux. Start growing your Instagram followers today.",
    },
    // OpenGraph tags
    {
      property: "og:title",
      content: "Free Instagram Auto Liker Installation - RoboLike",
    },
    {
      property: "og:description",
      content:
        "Download free Instagram auto liker RoboLike. Easy installation guide for Windows, MacOS, and Linux. Start growing your Instagram followers today.",
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
  const [detectedMacArchitecture, setDetectedMacArchitecture] = useState<
    "arm64" | "x64" | null
  >(null);
  const [intelRequested, setIntelRequested] = useState(false);

  // Get the download URL for the selected platform
  const getDownloadUrl = () => {
    if (!releaseData.assets || releaseData.assets.length === 0) {
      return null;
    }
    const macExtensions = {
      arm64: ["darwin-arm64", "arm64.dmg", "arm64.pkg", "mac.dmg"],
      x64: ["darwin-x64", "x64.dmg", "x64.pkg"],
      default: ["darwin", ".dmg", ".pkg", "mac.dmg"],
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
          setDetectedMacArchitecture("arm64");
          return "macos";
        }
        const majorVersion = parseInt(macVersionMatch[1]);
        const minorVersion = parseInt(macVersionMatch[2]);
        // MacOS 10.15 or higher is likely Apple Silicon
        const isAppleSilicon =
          majorVersion > 10 || (majorVersion === 10 && minorVersion >= 15);
        const detectedArch = isAppleSilicon ? "arm64" : "x64";
        setMacArchitecture(detectedArch);
        setDetectedMacArchitecture(detectedArch);
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Install RoboLike
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Follow our simple installation guide to install RoboLike and start growing your Instagram presence.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Platform Selector & Download */}
        <div className="mb-8">
          {detectedOS && (
            <div className="text-center mb-4">
              <span className="inline-block px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg font-medium border border-green-200">
                🎯 Detected: {detectedOS.toUpperCase()}{detectedMacArchitecture && ` (${detectedMacArchitecture.toUpperCase()})`}
              </span>
            </div>
          )}

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Choose Platform & Download</h2>

            {/* Platform Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Choose Platform</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedPlatform("macos")}
                  className={cn(
                    "px-4 py-2 font-medium rounded-lg transition-colors",
                    selectedPlatform === "macos"
                      ? "bg-orange-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  🍎 macOS
                </button>
                <button
                  onClick={() => setSelectedPlatform("windows")}
                  className={cn(
                    "px-4 py-2 font-medium rounded-lg transition-colors",
                    selectedPlatform === "windows"
                      ? "bg-orange-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  🪟 Windows
                </button>
                <button
                  onClick={() => setSelectedPlatform("linux")}
                  className={cn(
                    "px-4 py-2 font-medium rounded-lg transition-colors",
                    selectedPlatform === "linux"
                      ? "bg-orange-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  🐧 Linux
                </button>
              </div>
            </div>

            {/* Download Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Download</h3>
              <div className="text-center">
                {selectedPlatform === "macos" ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setMacArchitecture("arm64")}
                          className={cn(
                            "px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
                            macArchitecture === "arm64"
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-600 hover:text-gray-900"
                          )}
                        >
                          🚀 Apple Silicon
                        </button>
                        <button
                          onClick={() => setMacArchitecture("x64")}
                          className={cn(
                            "px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
                            macArchitecture === "x64"
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-600 hover:text-gray-900"
                          )}
                        >
                          ⚡ Intel
                        </button>
                      </div>
                      <a
                        href={getDownloadUrl()}
                        className="py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors shadow-sm"
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        📥 Download for macOS
                      </a>
                    </div>
                  </div>
                ) : (
                  <a
                    href={getDownloadUrl()}
                    className="inline-block py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors shadow-sm"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📥 Download for {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
                  </a>
                )}
              </div>
            </div>

            {/* Release Info */}
            <div className="text-xs text-gray-500 text-center">
              {releaseData.releaseDate !== "Coming Soon" ? (
                <div className="space-y-1">
                  <p>Version {releaseData.releaseVersion} • Released {releaseData.releaseDate}</p>
                  {getDownloadUrl() ? (
                    <p className="text-green-600 font-medium">✅ Ready for download</p>
                  ) : (
                    <p className="text-amber-600 font-medium">⏳ No {selectedPlatform} build available yet</p>
                  )}
                </div>
              ) : (
                <p className="text-amber-600 font-medium mt-4">🚧 Release coming soon!</p>
              )}
            </div>
          </div>
        </div>

        {/* Installation Steps */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {selectedPlatform === "macos" && (
            <div>
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 text-center">
                  Installation Instructions for macOS
                </h2>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-2 text-orange-600 font-bold">
                      📥 Download the Installer
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Click the download button above. You may need to click "Accept" or "Keep" in your browser.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-2 text-blue-600 font-bold">
                      📦 Extract the Zip File
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Double-click the downloaded zip file to extract the RoboLike application.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-2 text-amber-600 font-bold">
                      📂 Move to Applications
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Drag the RoboLike app to your Applications folder.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-2 text-purple-600 font-bold">
                      🖱️ Right-click and Open
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Right-click the RoboLike app in Applications and select "Open" for first launch.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">5</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-2 text-green-600 font-bold">
                      ✅ Confirm Security
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Click "Open" in the macOS security dialog to confirm and launch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedPlatform === "windows" && (
            <div>
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 text-center">
                  Installation Instructions for Windows
                </h2>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-2 text-orange-600 font-bold">
                      📥 Download the Installer
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Click the download button above to get the .exe file.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-2 text-blue-600 font-bold">
                      ▶️ Run the Installer
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Double-click the downloaded .exe file to run it.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-2 text-amber-600 font-bold">
                      🛡️ Accept Security Prompts
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      If SmartScreen appears, click "More info" then "Run anyway".
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-2 text-purple-600 font-bold">
                      🧙‍♂️ Follow Installation Wizard
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Follow the prompts and choose your installation location.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">5</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-2 text-green-600 font-bold">
                      🚀 Launch RoboLike
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Launch from desktop shortcut or Start menu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedPlatform === "linux" && (
            <div>
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 text-center">
                  Installation Instructions for Linux
                </h2>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-2 text-orange-600 font-bold">
                      📥 Download the DEB Package
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Click the download button above to get the .deb file.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-2 text-blue-600 font-bold">
                      💻 Install with DPKG
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">
                      Open terminal and run:
                    </p>
                    <div className="bg-gray-900 text-green-400 px-3 py-2 rounded-lg font-mono text-xs">
                      sudo dpkg -i robolike_0.0.1_amd64.deb
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-2 text-green-600 font-bold">
                      🚀 Launch RoboLike
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">
                      Launch from app menu or run:
                    </p>
                    <div className="bg-gray-900 text-green-400 px-3 py-2 rounded-lg font-mono text-xs">
                      robolike
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}