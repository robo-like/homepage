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
    <div className="min-h-screen flex flex-col bg-[var(--color-charcoal)] text-[var(--color-platinum)] mt-[5px] pt-[73px]">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 text-center flex-1 z-2">
        <h1 className="text-3xl md:text-4xl mb-6 text-white font-bold">
          Install RoboLike
        </h1>

        <div className="w-full h-1 my-4 bg-gradient-to-r from-[var(--color-primaryOrange)] to-[var(--color-secondaryOrange)]"></div>

        <p className="text-xl mb-12 max-w-2xl mx-auto text-[var(--color-platinum)]">
          Follow our simple installation guide to install RoboLike and
          start growing your Instagram presence.
        </p>

        {/* Platform Selector */}
        <div className="mb-16">
          {detectedOS && (
            <div className="mb-2 text-center">
              <span className="inline-block px-4 mb-3 py-1 text-xs bg-[var(--color-primaryOrange)] text-white rounded-md font-medium">
                Detected OS: {detectedOS.toUpperCase()}
                {macArchitecture && ` (${macArchitecture.toUpperCase()})`}
              </span>
            </div>
          )}

          <div className="inline-flex rounded-md overflow-hidden border border-[var(--color-steel)] mx-auto">
            <div
              onClick={() => setSelectedPlatform("macos")}
              className={cn(
                "px-6 py-3 font-medium text-lg cursor-pointer transition-colors",
                selectedPlatform === "macos"
                  ? "bg-[var(--color-primaryOrange)] text-white"
                  : "hover:bg-[var(--color-slate)] text-[var(--color-platinum)]"
              )}
            >
              macOS
            </div>
            <div
              onClick={() => setSelectedPlatform("windows")}
              className={cn(
                "px-6 py-3 font-medium text-lg cursor-pointer border-l border-r border-[var(--color-steel)] transition-colors",
                selectedPlatform === "windows"
                  ? "bg-[var(--color-primaryOrange)] text-white"
                  : "hover:bg-[var(--color-slate)] text-[var(--color-platinum)]"
              )}
            >
              Windows
            </div>
            <div
              onClick={() => setSelectedPlatform("linux")}
              className={cn(
                "px-6 py-3 font-medium text-lg cursor-pointer transition-colors",
                selectedPlatform === "linux"
                  ? "bg-[var(--color-primaryOrange)] text-white"
                  : "hover:bg-[var(--color-slate)] text-[var(--color-platinum)]"
              )}
            >
              Linux
            </div>
          </div>
        </div>

        {/* Mac Architecture Selector */}
        {selectedPlatform === "macos" && (
          <div className="mb-8">
            <div className="inline-flex rounded-md overflow-hidden border border-[var(--color-steel)] mx-auto">
              <div
                onClick={() => setMacArchitecture("arm64")}
                className={cn(
                  "px-6 py-3 font-medium text-lg cursor-pointer transition-colors",
                  macArchitecture === "arm64"
                    ? "bg-[var(--color-primaryOrange)] text-white"
                    : "hover:bg-[var(--color-slate)] text-[var(--color-platinum)]"
                )}
              >
                Apple Silicon (M1/M2/M3)
              </div>
              <div
                onClick={() => setMacArchitecture("x64")}
                className={cn(
                  "px-6 py-3 font-medium text-lg cursor-pointer border-l border-[var(--color-steel)] transition-colors",
                  macArchitecture === "x64"
                    ? "bg-[var(--color-primaryOrange)] text-white"
                    : "hover:bg-[var(--color-slate)] text-[var(--color-platinum)]"
                )}
              >
                Intel
              </div>
            </div>
          </div>
        )}

        {/* Installation Steps */}
        <div className="bg-[var(--color-slate)] rounded-xl p-8 mb-12 border border-[var(--color-steel)]">
          {selectedPlatform === "macos" && (
            <div className="text-left">
              <h2 className="text-2xl mb-6 text-white text-center font-semibold">
                Installing on macOS
              </h2>

              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-[var(--color-primaryOrange)] text-white rounded-full flex items-center justify-center font-semibold">1</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[var(--color-primaryOrange)] font-semibold">
                      Download the Installer
                    </h3>
                    <p className="text-[var(--color-platinum)]">
                      Click the download button at the bottom to get the latest
                      version of RoboLike for macOS. You may need to click
                      "Accept" or "Keep" in your browser since this is a zip
                      file.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-[var(--color-infoBlue)] text-white rounded-full flex items-center justify-center font-semibold">2</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[var(--color-infoBlue)] font-semibold">
                      Open the Zip File
                    </h3>
                    <p className="text-[var(--color-platinum)]">
                      Locate the downloaded zip file and double-click to extract
                      it. This will create the RoboLike application file.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-[var(--color-warningAmber)] text-white rounded-full flex items-center justify-center font-semibold">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[var(--color-warningAmber)] font-semibold">
                      Drag to Applications
                    </h3>
                    <p className="text-[var(--color-platinum)]">
                      Drag the RoboLike application to your Applications folder
                      to install it. This ensures the app is properly registered
                      with your system.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-[var(--color-accent)] text-white rounded-full flex items-center justify-center font-semibold">4</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[var(--color-accent)] font-semibold">
                      Right-click and Open
                    </h3>
                    <p className="text-[var(--color-platinum)]">
                      Navigate to your Applications folder, right-click (or
                      Control-click) on the RoboLike app and select "Open" from
                      the menu. This is important for first-time launch on
                      macOS.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-[var(--color-successGreen)] text-white rounded-full flex items-center justify-center font-semibold">5</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[var(--color-successGreen)] font-semibold">
                      Confirm Permissions
                    </h3>
                    <p className="text-[var(--color-platinum)]">
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
              <h2 className="text-2xl mb-6 text-white text-center font-semibold">
                Installing on Windows
              </h2>

              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-[var(--color-primaryOrange)] text-white rounded-full flex items-center justify-center font-semibold">1</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[var(--color-primaryOrange)] font-semibold">
                      Download the Installer
                    </h3>
                    <p className="text-[var(--color-platinum)]">
                      Click the download button at the bottom to get the latest
                      version of RoboLike for Windows (.exe file).
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-[var(--color-infoBlue)] text-white rounded-full flex items-center justify-center font-semibold">2</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[var(--color-infoBlue)] font-semibold">
                      Run the Installer
                    </h3>
                    <p className="text-[var(--color-platinum)]">
                      Locate the downloaded .exe file and double-click to run
                      it.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-[var(--color-warningAmber)] text-white rounded-full flex items-center justify-center font-semibold">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[var(--color-warningAmber)] font-semibold">
                      Accept Security Prompts
                    </h3>
                    <p className="text-[var(--color-platinum)]">
                      If Windows SmartScreen appears, click "More info" and then
                      "Run anyway" to proceed.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-[var(--color-accent)] text-white rounded-full flex items-center justify-center font-semibold">4</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[var(--color-accent)] font-semibold">
                      Follow Installation Wizard
                    </h3>
                    <p className="text-[var(--color-platinum)]">
                      Follow the prompts in the installation wizard, choosing
                      your preferred installation location.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-[var(--color-successGreen)] text-white rounded-full flex items-center justify-center font-semibold">5</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[var(--color-successGreen)] font-semibold">
                      Launch RoboLike
                    </h3>
                    <p className="text-[var(--color-platinum)]">
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
              <h2 className="text-2xl mb-6 text-white text-center font-semibold">
                Installing on Linux
              </h2>

              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-[var(--color-primaryOrange)] text-white rounded-full flex items-center justify-center font-semibold">1</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[var(--color-primaryOrange)] font-semibold">
                      Download the DEB Package
                    </h3>
                    <p className="text-[var(--color-platinum)]">
                      Click the download button at the bottom to get the latest
                      version of RoboLike for Linux (.deb file).
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-[var(--color-infoBlue)] text-white rounded-full flex items-center justify-center font-semibold">2</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[var(--color-infoBlue)] font-semibold">
                      Install with DPKG
                    </h3>
                    <p className="text-[var(--color-platinum)]">
                      Open a terminal, navigate to the download location, and
                      run:
                    </p>
                    <p className="mt-2">
                      <code className="bg-[var(--color-charcoal)] px-2 py-1 rounded border border-[var(--color-steel)]">
                        sudo dpkg -i robolike_0.0.1_amd64.deb
                      </code>
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-[var(--color-successGreen)] text-white rounded-full flex items-center justify-center font-semibold">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[var(--color-successGreen)] font-semibold">
                      Launch RoboLike
                    </h3>
                    <p className="text-[var(--color-platinum)]">
                      After installation, you can launch RoboLike from your
                      application menu or by running{" "}
                      <code className="bg-[var(--color-charcoal)] px-2 py-1 rounded border border-[var(--color-steel)]">
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

        {/* Download CTA Button */}
        <div className="relative mb-4">
          <a
            href={getDownloadUrl()}
            className="inline-block py-4 px-8 bg-[var(--color-primaryOrange)] hover:bg-[var(--color-secondaryOrange)] text-white font-semibold rounded-lg transition-colors"
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            Download for {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
          </a>
        </div>

        {/* Release Info */}
        <div className="text-sm text-[var(--color-metallic)] mb-6">
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
          <div className="w-full h-1 bg-gradient-to-r from-[var(--color-primaryOrange)] to-[var(--color-secondaryOrange)]"></div>
          <p className="mt-6 text-[var(--color-metallic)] text-sm">
            By downloading, you agree to our{" "}
            <a
              href="/terms-and-conditions"
              className="text-[var(--color-primaryOrange)] hover:underline"
            >
              Terms and Conditions
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 border-t border-[var(--color-steel)] text-center text-[var(--color-metallic)] text-sm z-10">
        <p>© {new Date().getFullYear()} RoboLike. All rights reserved.</p>
      </div>
    </div>
  );
}
