import type { Route } from "./+types/terms-and-conditions";
import logoDark from "../home/heart.png";

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
    <div className="font-set-1 min-h-screen text-white relative pb-16">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <a href="/">
              <img
                src={logoDark}
                alt="RoboLike Logo"
                className="w-20 h-20 animate-pulse mx-auto cursor-pointer"
              />
            </a>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl mb-4 gradient-text"
            style={{
              fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
            }}
          >
            PRIVACY POLICY
          </h1>
          <div className="w-full max-w-4xl mx-auto h-1 my-6 bg-gradient-to-r from-[#ed1e79] via-[#07b0ef] to-[#f7ee2a]"></div>
          <p
            className="text-xl md:text-2xl text-[#f7ee2a] max-w-3xl mx-auto"
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            YOUR DATA, YOUR CONTROL
          </p>
        </div>

        {/* Privacy Policy Content */}
        <div className="max-w-4xl mx-auto bg-black bg-opacity-70 p-8 rounded-lg border-2 border-[#07b0ef] mb-16">
          <div
            className="space-y-8 text-lg"
            style={{
              fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
            }}
          >
            <section>
              <h2
                className="text-2xl mb-4 text-[#ed1e79]"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                DATA CONTROLLERS & PROCESSORS
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl text-[#07b0ef] mb-2">Data Controllers</h3>
                  <p className="text-gray-100">
                    <span className="text-[#f7ee2a] font-bold">RoboLike</span> - As the primary data controller, we determine the purposes and means of processing personal data collected through our application.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl text-[#07b0ef] mb-2">Data Processors</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="text-[#f7ee2a] mr-2">•</span>
                      <span className="text-gray-100"><span className="text-[#07b0ef]">Vercel</span> - Hosts our application and processes user data through hosted components</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#f7ee2a] mr-2">•</span>
                      <span className="text-gray-100"><span className="text-[#07b0ef]">Turso (AWS)</span> - Database service that stores user data on AWS infrastructure</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#f7ee2a] mr-2">•</span>
                      <span className="text-gray-100"><span className="text-[#07b0ef]">Cloudflare</span> - Provides DNS services and processes IP addresses and traffic information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#f7ee2a] mr-2">•</span>
                      <span className="text-gray-100"><span className="text-[#07b0ef]">Brevo</span> - Handles email communications with users</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#f7ee2a] mr-2">•</span>
                      <span className="text-gray-100"><span className="text-[#07b0ef]">Facebook</span> - Processes user data when authorized through API keys</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#f7ee2a] mr-2">•</span>
                      <span className="text-gray-100"><span className="text-[#07b0ef]">GitHub</span> - Hosts our codebase and downloadable files</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#f7ee2a] mr-2">•</span>
                      <span className="text-gray-100"><span className="text-[#07b0ef]">OpenAI</span> - Processes user data through their API for generating content and responses</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2
                className="text-2xl mb-4 text-[#07b0ef]"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                DATA USE & STORAGE
              </h2>
              <div className="space-y-4">
                <p className="text-gray-100">
                  <span className="text-[#f7ee2a] font-bold">User Data Storage:</span> Your data is primarily stored in Turso databases hosted on AWS infrastructure.
                </p>
                <p className="text-gray-100">
                  <span className="text-[#f7ee2a] font-bold">AI Processing:</span> We use OpenAI's API to process certain user data for generating content and responses. OpenAI may temporarily store and process this data according to their privacy policy, but we do not share personally identifiable information with OpenAI.
                </p>
                <p className="text-gray-100">
                  <span className="text-[#f7ee2a] font-bold">Email Communications:</span> We use Brevo to handle all email communications with our users.
                </p>
                <p className="text-gray-100">
                  <span className="text-[#f7ee2a] font-bold">Cookies:</span> We do not track users with cookies.
                </p>
                <p className="text-gray-100">
                  <span className="text-[#f7ee2a] font-bold">Instagram Credentials:</span> While we request Instagram credentials, our implementation ensures these never leave your device or reach our servers.
                </p>
                <p className="text-gray-100">
                  <span className="text-[#f7ee2a] font-bold">API Integration:</span> We may use API keys for Facebook integration to make requests on users' behalf when authorized.
                </p>
                <p className="text-gray-100">
                  <span className="text-[#f7ee2a] font-bold">Source Code:</span> Our source code is available upon request and is hosted on GitHub.
                </p>
              </div>
            </section>

            <div className="mt-12 p-6 bg-black bg-opacity-60 rounded-lg border border-[#f7ee2a]">
              <p
                className="text-md text-center text-[#f7ee2a]"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                We are committed to protecting your privacy and handling your data responsibly.
              </p>
              <p className="text-center text-gray-300 mt-2">
                Last updated: 17/03/2025
              </p>
              <p className="text-center text-gray-300 mt-4">
                <a href="/terms-and-conditions" className="text-[#07b0ef] hover:underline">
                  View our Terms and Conditions
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative inline-block mx-auto w-full">
              <div className="absolute inset-0 bg-[#07b0ef] blur-lg opacity-30 animate-pulse rounded-lg"></div>
              <a
                href="/how-it-works"
                className="relative inline-block py-4 px-8 retro-button w-full"
              >
                HOW IT WORKS
              </a>
            </div>
            <div className="relative inline-block mx-auto w-full">
              <div className="absolute inset-0 bg-[#FA8E10] blur-lg opacity-30 animate-pulse rounded-lg"></div>
              <a
                href="/install-guide"
                className="relative inline-block py-4 px-8 retro-button primary w-full"
              >
                DOWNLOAD NOW
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
