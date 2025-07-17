import type { Route } from "./+types/terms-and-conditions";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Terms and Conditions - RoboLike" },
    {
      name: "description",
      content:
        "Terms and conditions for using the RoboLike application. Understanding your rights and responsibilities.",
    },
    // OpenGraph tags
    {
      property: "og:title",
      content: "Terms and Conditions - RoboLike",
    },
    {
      property: "og:description",
      content:
        "Terms and conditions for using the RoboLike application. Understanding your rights and responsibilities.",
    },
    {
      property: "og:type",
      content: "website",
    },
  ];
}

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent pb-2">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            The rules that govern your use of RoboLike
          </p>
        </div>
      </div>

      {/* Terms and Conditions Content */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-8 text-lg">
            <section>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                1. You Are The Hero
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                By downloading and using RoboLike,{" "}
                <span className="text-orange-600 font-bold">YOU</span> are taking
                control of your Instagram growth journey. This tool
                empowers you to engage with your target audience, but with great
                power comes great responsibility.
              </p>
              <p className="text-gray-700 leading-relaxed">
                As the hero of this story, you agree to be financially
                responsible for any damages that may occur while using RoboLike.
                This includes (but is not limited to) any technical issues,
                account restrictions, or other consequences that might arise
                from the use of automation tools with social media platforms.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                2. Fair Play Agreement
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                By using RoboLike, you agree to abide by our Fair Play
                Agreement. This means you will{" "}
                <span className="text-orange-600 font-bold">NOT</span> use
                RoboLike in ways that:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>
                  Negatively impact the overall experience of any social media
                  platform
                </li>
                <li>
                  Violate the terms of service of Instagram or other platforms
                </li>
                <li>Spam or harass other users</li>
                <li>
                  Artificially inflate engagement in ways that damage the
                  platform ecosystem
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                RoboLike is designed to enhance genuine engagement, not to game
                the system. Use it to connect with real people who might be
                interested in your content.
              </p>
            </section>

            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200 my-8">
              <h3 className="text-xl font-bold mb-3 text-orange-800">
                Important Disclaimer
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                RoboLike is{" "}
                <span className="text-orange-600 font-bold">NOT</span> associated
                with or endorsed by Instagram or any other social media
                companies. We are an independent tool created by
                developers for developers and social media enthusiasts.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Use of automation tools may violate the terms of service of some
                platforms. You're responsible for understanding and following
                the rules of any service you use RoboLike with.
              </p>
            </div>

            <section>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                3. Privacy & Security
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Your privacy is a priority for us. RoboLike operates locally on
                your machine, which means:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-orange-600 mr-3 text-xl">🔒</div>
                  <p className="text-gray-700">Your login credentials never leave your computer</p>
                </div>
                <div className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-orange-600 mr-3 text-xl">🛡️</div>
                  <p className="text-gray-700">No central servers storing your information</p>
                </div>
                <div className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-orange-600 mr-3 text-xl">🌐</div>
                  <p className="text-gray-700">All activity comes from your own IP address</p>
                </div>
                <div className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-orange-600 mr-3 text-xl">🎮</div>
                  <p className="text-gray-700">You have full control over the app at all times</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                4. Changes to Terms
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We reserve the right to update these terms as needed to adapt to changes in:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Technology landscape</li>
                <li>Legal requirements</li>
                <li>Social media platform policies</li>
                <li>User feedback and needs</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                When we make changes to these terms, we'll update the "Last
                Updated" date below and may notify users through the application
                or our website.
              </p>
            </section>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-lg text-center text-gray-900 font-semibold mb-2">
                By downloading, installing, or using RoboLike, you agree to
                these terms and conditions.
              </p>
              <p className="text-center text-gray-600 mt-4">
                Last updated: July 16, 2025
              </p>
              <p className="text-center text-gray-600 mt-4">
                <Link to="/privacy-policy" className="text-orange-600 hover:text-orange-700 transition-colors">
                  View our Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
