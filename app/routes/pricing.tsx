import Container from "~/components/Container";
import type { Route } from "./+types/pricing";
import { H1 } from "~/components/H1";
import { Card } from "~/components/Card";
import { TextInput } from "~/components/TextInput";
import { useState } from "react";
import { cn } from "~/lib/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RoboLike Pricing - Automate Your Instagram Growth" },
    {
      name: "description",
      content:
        "Choose the perfect RoboLike plan for your Instagram automation needs. Affordable plans starting at $19/month with a special founder discount.",
    },
  ];
}

interface PricingTierProps {
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
  discount?: string;
  ctaLink: string;
}

function PricingTier({
  name,
  price,
  originalPrice,
  description,
  features,
  highlighted,
  ctaText,
  discount,
  ctaLink,
}: PricingTierProps) {
  return (
    <div
      className={cn(
        "bg-black bg-opacity-40 p-6 rounded-lg border",
        (discount || highlighted) ? "border-[#07b0ef] border-2 relative" : "border-gray-700"
      )}
    >
      {highlighted && !discount && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-[#07b0ef] text-black px-3 py-1 rounded-full text-sm font-bold">
            Most Popular
          </span>
        </div>
      )}
      {discount || !highlighted && (
        <div className="absolute -top-3 right-3">
          <span className="bg-gradient-to-r from-[#ed1e79] to-[#07b0ef] text-white px-3 py-1 rounded-full text-sm font-bold">
            {discount}
          </span>
        </div>
      )}
      <div className="mb-6">
        <h2
          className="text-2xl font-bold mb-2"
          style={{
            fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
          }}
        >
          {name}
        </h2>
        <div className="mb-3 flex items-baseline">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Free" && <span className="text-gray-400">/month</span>}
          {originalPrice && (
            <span className="ml-2 text-gray-400 line-through text-lg">
              ${originalPrice}
            </span>
          )}
        </div>
        <p
          className="text-gray-300"
          style={{ fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)' }}
        >
          {description}
        </p>
      </div>
      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-2"
            style={{
              fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
            }}
          >
            <div className="text-[#07b0ef] text-xl mr-2 mt-0.5">⚡</div>
            {feature}
          </li>
        ))}
      </ul>
      <a
        href={ctaLink}
        className={`block w-full py-3 px-4 text-center rounded-lg transition-colors ${
          highlighted
            ? "bg-[#07b0ef] text-black hover:bg-opacity-90 relative retro-button primary"
            : "bg-[#9633ac] text-white hover:bg-opacity-90 relative retro-button"
        }`}
        style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
      >
        {ctaText}
      </a>
    </div>
  );
}

export default function Pricing() {
  const [enterpriseEmail, setEnterpriseEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleEnterpriseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("email", enterpriseEmail);

      const response = await fetch("/api/enterprise-lead", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("There was an error submitting your request. Please try again.");
        console.error(
          "Error submitting enterprise lead:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error submitting your request. Please try again.");
    }
  };

  return (
    <div className="font-set-1 min-h-screen py-12 px-4">
      <Container className="mt-10">
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl mb-4 gradient-text"
            style={{
              fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
            }}
          >
            LEVEL UP YOUR INSTAGRAM
          </h1>
          <p
            className="text-gray-300 text-lg"
            style={{
              fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
            }}
          >
            Choose the perfect plan for your Instagram automation needs
          </p>

          {/* Divider */}
          <div className="w-full h-1 my-6 bg-gradient-to-r from-[#ed1e79] via-[#07b0ef] to-[#f7ee2a]"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <PricingTier
            name="BASIC PLAN"
            price="$19"
            originalPrice="29"
            discount="Founder Price"
            description="Perfect for individual content creators"
            features={[
              "Run on 1 machine",
              "1 Instagram account",
              "Unlimited likes per day",
              "Target by hashtag",
              "Email support",
              "No rate limiting",
            ]}
            highlighted={false}
            ctaText="START NOW"
            ctaLink="/install-guide"
          />
          <PricingTier
            name="CREATOR PLAN"
            price="$39"
            originalPrice="59"
            discount="Founder Price"
            description="Ideal for serious creators and small businesses"
            features={[
              "Run on up to 5 machines",
              "3 Instagram accounts",
              "Unlimited likes per day",
              "Advanced targeting options",
              "Priority email support",
              "Engagement analytics",
            ]}
            highlighted={true}
            ctaText="UPGRADE TO CREATOR"
            ctaLink="/install-guide"
          />
          <div className="bg-black bg-opacity-40 p-6 rounded-lg border border-[#f7ee2a]">
            <h2
              className="text-2xl font-bold mb-2 text-[#f7ee2a]"
              style={{
                fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
              }}
            >
              ENTERPRISE
            </h2>
            <p
              className="text-gray-300 mb-6"
              style={{
                fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
              }}
            >
              Custom solutions for agencies and large businesses
            </p>

            <ul className="space-y-4 mb-8">
              <li
                className="flex items-start gap-2"
                style={{
                  fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                }}
              >
                <div className="text-[#f7ee2a] text-xl mr-2 mt-0.5">⚡</div>
                Unlimited machines and accounts
              </li>
              <li
                className="flex items-start gap-2"
                style={{
                  fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                }}
              >
                <div className="text-[#f7ee2a] text-xl mr-2 mt-0.5">⚡</div>
                Custom integration with your workflow
              </li>
              <li
                className="flex items-start gap-2"
                style={{
                  fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                }}
              >
                <div className="text-[#f7ee2a] text-xl mr-2 mt-0.5">⚡</div>
                Dedicated account manager
              </li>
              <li
                className="flex items-start gap-2"
                style={{
                  fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                }}
              >
                <div className="text-[#f7ee2a] text-xl mr-2 mt-0.5">⚡</div>
                Custom reporting and analytics
              </li>
            </ul>

            {!submitted ? (
              <form onSubmit={handleEnterpriseSubmit} className="space-y-4">
                <div>
                  <TextInput
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={enterpriseEmail}
                    onChange={(e) => setEnterpriseEmail(e.target.value)}
                    className="w-full bg-black bg-opacity-70 border border-[#f7ee2a] text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#f7ee2a] text-black rounded-lg transition-colors hover:bg-opacity-90 relative retro-button"
                  style={{
                    fontFamily:
                      'var(--subheading-font, "Orbitron", sans-serif)',
                  }}
                >
                  GET ENTERPRISE QUOTE
                </button>
              </form>
            ) : (
              <div
                className="text-center p-4 border border-[#f7ee2a] rounded-lg"
                style={{
                  fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                }}
              >
                <p className="text-[#f7ee2a] font-bold mb-2">
                  Thanks for your interest!
                </p>
                <p className="text-gray-300">
                  Our team will contact you shortly to discuss enterprise
                  options.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2
            className="text-3xl font-bold mb-8 text-center gradient-text"
            style={{
              fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
            }}
          >
            FREQUENTLY ASKED QUESTIONS
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black bg-opacity-30 p-6 rounded-lg border border-gray-700">
              <h3
                className="text-xl font-bold mb-2 text-[#07b0ef]"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                How does RoboLike work?
              </h3>
              <p
                className="text-gray-300"
                style={{
                  fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                }}
              >
                RoboLike runs on your computer and automatically likes posts on
                Instagram based on hashtags you select. This helps you engage
                with potential followers and grow your audience organically.
              </p>
            </div>

            <div className="bg-black bg-opacity-30 p-6 rounded-lg border border-gray-700">
              <h3
                className="text-xl font-bold mb-2 text-[#07b0ef]"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                Is my account safe?
              </h3>
              <p
                className="text-gray-300"
                style={{
                  fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                }}
              >
                Yes! RoboLike uses natural engagement patterns and respects
                Instagram's rate limits. The app runs locally on your machine,
                so your login credentials are never sent to our servers.
              </p>
            </div>

            <div className="bg-black bg-opacity-30 p-6 rounded-lg border border-gray-700">
              <h3
                className="text-xl font-bold mb-2 text-[#07b0ef]"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                Can I cancel anytime?
              </h3>
              <p
                className="text-gray-300"
                style={{
                  fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                }}
              >
                Absolutely! All plans come with a no-questions-asked
                cancellation policy. You can upgrade, downgrade, or cancel your
                subscription at any time from your account dashboard.
              </p>
            </div>

            <div className="bg-black bg-opacity-30 p-6 rounded-lg border border-gray-700">
              <h3
                className="text-xl font-bold mb-2 text-[#07b0ef]"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                Do I need to keep my computer on?
              </h3>
              <p
                className="text-gray-300"
                style={{
                  fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                }}
              >
                Yes, RoboLike runs locally on your machine. Your computer needs
                to be on and connected to the internet, but you can lock your
                screen or use other apps while RoboLike runs in the background.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
