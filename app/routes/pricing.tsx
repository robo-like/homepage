import Container from "~/components/Container";
import type { Route } from "./+types/pricing";
import { H1 } from "~/components/H1";
import { Card } from "~/components/Card";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "RoboLike Pricing - Automate Your Social Media Growth" },
    { name: "description", content: "Choose the perfect RoboLike plan for your social media automation needs. From Free trial to Premium features." },
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
}

function PricingTier({ name, price, originalPrice, description, features, highlighted, ctaText, discount }: PricingTierProps) {
  return (
    <Card className={`flex flex-col ${highlighted ? 'border-2 border-lightPurple relative' : ''}`}>
      {highlighted && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-lightPurple text-white px-3 py-1 rounded-full text-sm">
            Most Popular
          </span>
        </div>
      )}
      {discount && (
        <div className="absolute -top-3 right-3">
          <span className="bg-gradient-to-r from-pink-500 to-lightPurple text-white px-3 py-1 rounded-full text-sm font-bold">
            {discount}
          </span>
        </div>
      )}
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">{name}</h2>
        <div className="mb-3 flex items-baseline">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Free" && <span className="text-gray-400">/month</span>}
          {originalPrice && (
            <span className="ml-2 text-gray-400 line-through text-lg">${originalPrice}</span>
          )}
        </div>
        <p className="text-gray-400">{description}</p>
      </div>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <svg className="w-5 h-5 text-lightPurple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <button className={`w-full py-2 px-4 rounded-lg transition-colors ${highlighted
        ? 'bg-lightPurple text-white hover:bg-opacity-90'
        : 'bg-white/10 hover:bg-white/20'
        }`}>
        {ctaText}
      </button>
    </Card>
  );
}

export default function Pricing() {
  return (
    <Container className="mt-10">
      <div className="text-center mb-12">
        <H1>Simple, Transparent Pricing</H1>
        <p className="text-gray-400 text-lg">
          Choose the perfect plan for your social media automation needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <PricingTier
          name="Free Trial"
          price="Free"
          description="Perfect for testing the waters"
          features={[
            "1 Social Account",
            "3 Days of Premium Features",
            "Basic Analytics",
            "Community Support"
          ]}
          ctaText="Start Free Trial"
        />
        <PricingTier
          name="Starter"
          price="$9"
          description="Great for personal brands"
          features={[
            "2 Social Accounts",
            "500 Actions per Day",
            "Basic Analytics",
            "Email Support",
            "24/7 Customer Service"
          ]}
          ctaText="Get Started"
        />
        <PricingTier
          name="Premium"
          price="$19.99"
          originalPrice="29.99"
          discount="Founder Price"
          description="For power users"
          features={[
            "5 Social Accounts",
            "1000 Actions per Day",
            "Advanced Analytics",
            "AI Content Filtering",
            "Priority Support",
            "Custom Action Rules"
          ]}
          highlighted={true}
          ctaText="Go Premium"
        />
      </div>
    </Container>
  );
}
