import Container from "~/components/Container";
import type { Route } from "./+types/pricing";
import { TextInput } from "~/components/TextInput";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { requireAuth } from "~/lib/auth";
import { useLoaderData } from "react-router";
import { getUserSubscriptionDetails } from "~/lib/billing/stripe";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const authData = await requireAuth(request, "/auth/login");
    if (!authData?.user) {
      return { user: null, subscriptionDetails: null };
    }
    const subscriptionDetails = await getUserSubscriptionDetails(
      authData.user.id
    );
    return { user: authData.user, subscriptionDetails };
  } catch (error) {
    return { user: null, subscriptionDetails: null };
  }
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Free Instagram Auto Liker Pricing - RoboLike" },
    {
      name: "description",
      content:
        "Free Instagram auto liker with affordable premium plans. Start with RoboLike's free Instagram automation features or upgrade from $19/month.",
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
        "bg-white p-8 rounded-lg border shadow-sm relative h-full flex flex-col",
        highlighted
          ? "border-orange-300 shadow-lg scale-105"
          : "border-gray-200"
      )}
    >
      {discount && (
        <div className="absolute -top-3 right-3">
          <span className="bg-gradient-to-r from-pink-600 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            {discount}
          </span>
        </div>
      )}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3 text-gray-900">
          {name}
        </h2>
        <div className="mb-3 flex items-baseline">
          <span className="text-4xl font-black text-gray-900">{price}</span>
          {price !== "Free" && <span className="text-gray-600 ml-1">/month</span>}
          {originalPrice && (
            <span className="ml-2 text-gray-500 line-through text-lg">
              ${originalPrice}
            </span>
          )}
        </div>
        <p className="text-gray-700 leading-relaxed">
          {description}
        </p>
      </div>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="text-orange-600 text-lg mt-0.5">✓</div>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <a
        href={ctaLink}
        className={cn(
          "block w-full py-4 px-6 text-center rounded-lg transition-colors font-semibold",
          highlighted
            ? "bg-orange-600 text-white hover:bg-orange-700"
            : "bg-gray-900 text-white hover:bg-gray-800"
        )}
      >
        {ctaText}
      </a>
    </div>
  );
}

export default function Pricing() {
  const loaderData = useLoaderData<typeof loader>();
  const userData = loaderData?.user;
  const isLoggedIn = !!userData;
  const hasSubscription = loaderData?.subscriptionDetails?.subscribed;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent pb-2">
            Take Control of Your Instagram Growth
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
            You're the creator, the entrepreneur, the one building something amazing. RoboLike is simply your tool to connect with the right audience while you focus on what you do best—creating incredible content.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Choose the plan that fits your journey and let automation handle the engagement while you build your empire.
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">

          <div className="grid md:grid-cols-3 gap-8">
            <PricingTier
              name="Basic Plan"
              price="$19"
              originalPrice="29"
              discount="Founder Price"
              description="Perfect for individual content creators who want to grow their audience naturally"
              features={[
                "Run on 1 machine",
                "1 Instagram account",
                "Unlimited likes per day",
                "Target by hashtag",
                "Email support",
                "No rate limiting",
              ]}
              highlighted={true}
              ctaText={!isLoggedIn ? "Login & Start" : hasSubscription ? "Download Now" : "Start Now"}
              ctaLink={!isLoggedIn ? "/auth/login?returnTo=/u/profile" : hasSubscription ? "/install-guide" : "/u/profile"}
            />

            {/* Creator Plan */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm relative h-full flex flex-col">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-3 text-gray-900">
                  Creator Plan
                </h2>
                <div className="mb-3">
                  <span className="text-4xl font-black text-gray-900">Contact Us</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Ideal for serious creators and small businesses scaling their presence
                </p>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <div className="text-orange-600 text-lg mt-0.5">✓</div>
                  <span className="text-gray-700">Run on up to 5 machines</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-orange-600 text-lg mt-0.5">✓</div>
                  <span className="text-gray-700">3 Instagram accounts</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-orange-600 text-lg mt-0.5">✓</div>
                  <span className="text-gray-700">Unlimited likes per day</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-orange-600 text-lg mt-0.5">✓</div>
                  <span className="text-gray-700">Advanced targeting options</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-orange-600 text-lg mt-0.5">✓</div>
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-orange-600 text-lg mt-0.5">✓</div>
                  <span className="text-gray-700">Engagement analytics</span>
                </li>
              </ul>
              <button
                onClick={() => {
                  // Brevo chat will handle enterprise inquiries
                  if ((window as any).BrevoConversations) {
                    (window as any).BrevoConversations('openChat');
                  }
                }}
                className="block w-full py-4 px-6 text-center rounded-lg transition-colors font-semibold bg-gray-900 text-white hover:bg-gray-800"
              >
                Contact
              </button>
            </div>
            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm relative h-full flex flex-col">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-3 text-gray-900">
                  Enterprise
                </h2>
                <div className="mb-3">
                  <span className="text-4xl font-black text-gray-900">Custom</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Custom solutions for agencies and large businesses ready to scale
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <div className="text-orange-600 text-lg mt-0.5">✓</div>
                  <span className="text-gray-700">Unlimited machines and accounts</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-orange-600 text-lg mt-0.5">✓</div>
                  <span className="text-gray-700">Custom integration with your workflow</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-orange-600 text-lg mt-0.5">✓</div>
                  <span className="text-gray-700">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-orange-600 text-lg mt-0.5">✓</div>
                  <span className="text-gray-700">Custom reporting and analytics</span>
                </li>
              </ul>

              <button
                onClick={() => {
                  // Brevo chat will handle enterprise inquiries
                  if ((window as any).BrevoConversations) {
                    (window as any).BrevoConversations('openChat');
                  }
                }}
                className="block w-full py-4 px-6 text-center rounded-lg transition-colors font-semibold bg-gray-900 text-white hover:bg-gray-800"
              >
                Contact
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
            What Our Users Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <div className="mb-6">
                <svg className="w-8 h-8 text-orange-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                "Before using RoboLike, I didn't think social media was working for me. Now, that's where 90% of my business comes from."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  SM
                </div>
                <div className="ml-3">
                  <p className="text-gray-900 font-semibold">@sarahm_designs</p>
                  <p className="text-gray-600 text-sm">Verified User</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <div className="mb-6">
                <svg className="w-8 h-8 text-orange-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                "I've been using RoboLike for almost a decade, this new version is absolutely insane. It works. No shadow banning. No login issues."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  MJ
                </div>
                <div className="ml-3">
                  <p className="text-gray-900 font-semibold">@mikej_photo</p>
                  <p className="text-gray-600 text-sm">Long-time User</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <div className="mb-6">
                <svg className="w-8 h-8 text-orange-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                "This is the only auto liker I could find that's still working. The best part is that it runs on my PC and I know my password is safe and sound."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  AL
                </div>
                <div className="ml-3">
                  <p className="text-gray-900 font-semibold">@alexl_tech</p>
                  <p className="text-gray-600 text-sm">Security-Conscious User</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
