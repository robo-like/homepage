import { useState } from "react";
import { cn } from "~/lib/utils";

interface FeatureRequestButtonProps {
  featureName: string;
  featureType: string;
  buttonText?: string;
  successMessage?: string;
  buttonClassName?: string;
  successClassName?: string;
}

export function FeatureRequestButton({
  featureName,
  featureType,
  buttonText = "CLICK TO REQUEST",
  successMessage = "OUR AI ROBOTS HAVE BEEN NOTIFIED OF YOUR REQUEST",
  buttonClassName,
  successClassName,
}: FeatureRequestButtonProps) {
  const [requested, setRequested] = useState(false);

  const handleRequest = async () => {
    try {
      await fetch("/api/metrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType: "productEvent",
          path: "/feature-requests",
          eventValue: featureType,
          description: `User requested ${featureName}`,
        }),
      });
      setRequested(true);
    } catch (error) {
      console.error("Error tracking feature request:", error);
    }
  };

  if (requested) {
    return (
      <div
        className={cn(
          "relative inline-block py-4 px-8 bg-[#1c1c1c] border-2 border-[#00ff00] rounded-lg text-center",
          successClassName
        )}
      >
        <p
          className="text-[#00ff00] font-medium"
          style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
        >
          {successMessage}
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={handleRequest}
      className={cn(
        "relative inline-block py-4 px-8 retro-button primary text-black font-medium transition-colors duration-200",
        buttonClassName
      )}
    >
      {buttonText}
    </button>
  );
} 