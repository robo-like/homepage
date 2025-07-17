import type { Route } from "./+types/privacy-policy";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Privacy Policy - RoboLike" },
    {
      name: "description",
      content:
        "Privacy policy for RoboLike. Learn how we handle your data and protect your privacy.",
    },
    // OpenGraph tags
    {
      property: "og:title",
      content: "Privacy Policy - RoboLike",
    },
    {
      property: "og:description",
      content:
        "Privacy policy for RoboLike. Learn how we handle your data and protect your privacy.",
    },
    {
      property: "og:type",
      content: "website",
    },
  ];
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent pb-2">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            How we protect and handle your data
          </p>
        </div>
      </div>

      {/* Privacy Policy Content */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-8 text-lg">
            <section>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Data Controllers & Processors
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Controllers</h3>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="text-orange-600 font-bold">RoboLike</span> - As the primary data controller, we determine the purposes and means of processing personal data collected through our application.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Processors</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      <span className="text-gray-700"><span className="font-semibold">Vercel</span> - Hosts our application and processes user data through hosted components</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      <span className="text-gray-700"><span className="font-semibold">Turso (AWS)</span> - Database service that stores user data on AWS infrastructure</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      <span className="text-gray-700"><span className="font-semibold">Cloudflare</span> - Provides DNS services and processes IP addresses and traffic information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      <span className="text-gray-700"><span className="font-semibold">Brevo</span> - Handles email communications with users</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      <span className="text-gray-700"><span className="font-semibold">Facebook</span> - Processes user data when authorized through API keys</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      <span className="text-gray-700"><span className="font-semibold">GitHub</span> - Hosts our codebase and downloadable files</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      <span className="text-gray-700"><span className="font-semibold">OpenAI</span> - Processes user data through their API for generating content and responses</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Data Use & Storage
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <span className="text-orange-600 font-bold">User Data Storage:</span> Your data is primarily stored in Turso databases hosted on AWS infrastructure.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <span className="text-orange-600 font-bold">AI Processing:</span> We use OpenAI's API to process certain user data for generating content and responses. OpenAI may temporarily store and process this data according to their privacy policy, but we do not share personally identifiable information with OpenAI.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <span className="text-orange-600 font-bold">Email Communications:</span> We use Brevo to handle all email communications with our users.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <span className="text-orange-600 font-bold">Cookies:</span> We do not track users with cookies.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <span className="text-orange-600 font-bold">Instagram Credentials:</span> While we request Instagram credentials, our implementation ensures these never leave your device or reach our servers.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <span className="text-orange-600 font-bold">API Integration:</span> We may use API keys for Facebook integration to make requests on users' behalf when authorized.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <span className="text-orange-600 font-bold">Source Code:</span> Our source code is available upon request and is hosted on GitHub.
                </p>
              </div>
            </section>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-lg text-center text-gray-900 font-semibold mb-2">
                We are committed to protecting your privacy and handling your data responsibly.
              </p>
              <p className="text-center text-gray-600 mt-4">
                Last updated: July 16, 2025
              </p>
              <p className="text-center text-gray-600 mt-4">
                <Link to="/terms-and-conditions" className="text-orange-600 hover:text-orange-700 transition-colors">
                  View our Terms and Conditions
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
