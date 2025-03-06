import Container from "~/components/Container";
import type { Route } from "./+types/downloads";
import { H1, H2 } from "~/components/H1";
import { Card } from "~/components/Card";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Download RoboLike - Automated Social Media Growth" },
    { name: "description", content: "Download RoboLike for your platform. Available for Windows, MacOS, and Linux." },
  ];
}

interface DownloadCardProps {
  platform: string;
  icon: string;
  version: string;
  releaseDate: string;
  downloadUrl: string;
  requirements: string[];
}

function DownloadCard({ platform, icon, version, releaseDate, downloadUrl, requirements }: DownloadCardProps) {
  const handleDownloadClick = () => {
    // Get existing session ID from cookie
    const sessionId = document.cookie.match(/sessionId=([^;]+)/)?.[1];
    console.log('sessionId', sessionId);
    if (!sessionId) return;

    // Track download event
    fetch('/api/metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        path: '/downloads',
        eventType: 'productEvent',
        eventValue: platform.toLowerCase(),
        description: `User clicked download for ${platform}`,
      }),
    }).catch(error => {
      // Silently fail for analytics
      console.error('Error tracking download:', error);
    });
  };

  return (
    <Card className="flex-1 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <H2 className="mb-0">{platform}</H2>
      </div>

      <div className="text-gray-400 mb-4 text-sm">
        <p>Version {version}</p>
        <p>Released: {releaseDate}</p>
      </div>

      <div className="mb-6 flex-grow">
        <p className="text-sm font-medium mb-2">System Requirements:</p>
        <ul className="text-sm text-gray-400 list-disc pl-4 space-y-1">
          {requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>

      <a
        // href={downloadUrl}
        onClick={handleDownloadClick}
        className="w-full py-2 px-4 bg-darkPurple text-white rounded-lg text-center hover:bg-opacity-90 transition-colors"
      >
        Download for {platform}
      </a>
    </Card>
  );
}

export default function Downloads() {
  return (
    <Container className="flex-col gap-8 mt-10">
      <div className="text-center">
        <H1>Download RoboLike</H1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Choose your platform to get started with RoboLike. Our desktop application
          runs locally on your machine, providing better security and control over
          your social media automation.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <DownloadCard
          platform="MacOS"
          icon="🍎"
          version="2.1.0"
          releaseDate="March 15, 2024"
          downloadUrl="/downloads/robolike-mac.dmg"
          requirements={[
            "MacOS 11.0 or later",
            "4GB RAM minimum",
            "500MB free disk space",
            "Intel or Apple Silicon"
          ]}
        />
        <DownloadCard
          platform="Windows"
          icon="🪟"
          version="2.1.0"
          releaseDate="March 15, 2024"
          downloadUrl="/downloads/robolike-win.exe"
          requirements={[
            "Windows 10 or later",
            "4GB RAM minimum",
            "500MB free disk space",
            "64-bit processor"
          ]}
        />
        <DownloadCard
          platform="Linux"
          icon="🐧"
          version="2.1.0"
          releaseDate="March 15, 2024"
          downloadUrl="/downloads/robolike-linux.AppImage"
          requirements={[
            "Ubuntu 20.04 or equivalent",
            "4GB RAM minimum",
            "500MB free disk space",
            "64-bit processor"
          ]}
        />
      </div>

      <Card className="text-center p-8">
        <H2>Need Help Getting Started?</H2>
        <p className="text-gray-400 mb-4">
          Check out our documentation and guides to help you get up and running quickly.
        </p>
        <div className="flex justify-center gap-4">
          <a href="/instagram-auto-liker-how-it-works" className="text-lightPurple hover:underline font-bold text-lg">
            View Guide
          </a>
          <span className="text-gray-600">•</span>
          <a href="/blog" className="text-lightPurple hover:underline font-bold text-lg">
            Read Blog
          </a>
        </div>
      </Card>
    </Container>
  );
}
