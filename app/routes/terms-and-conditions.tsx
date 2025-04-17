import type { Route } from "./+types/terms-and-conditions";
import logoDark from "../home/heart.png";

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
            TERMS & CONDITIONS
          </h1>
          <div className="w-full max-w-4xl mx-auto h-1 my-6 bg-gradient-to-r from-[#ed1e79] via-[#07b0ef] to-[#f7ee2a]"></div>
          <p
            className="text-xl md:text-2xl text-[#f7ee2a] max-w-3xl mx-auto"
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            THE RULES OF THE GAME
          </p>
        </div>

        {/* Terms and Conditions Content */}
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
                1. YOU ARE THE HERO
              </h2>
              <p className="text-gray-100 mb-4">
                By downloading and using RoboLike,{" "}
                <span className="text-[#f7ee2a] font-bold">YOU</span> are taking
                control of your Instagram growth journey. This open-source tool
                empowers you to engage with your target audience, but with great
                power comes great responsibility.
              </p>
              <p className="text-gray-100">
                As the hero of this story, you agree to be financially
                responsible for any damages that may occur while using RoboLike.
                This includes (but is not limited to) any technical issues,
                account restrictions, or other consequences that might arise
                from the use of automation tools with social media platforms.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl mb-4 text-[#07b0ef]"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                2. FAIR PLAY AGREEMENT
              </h2>
              <p className="text-gray-100 mb-4">
                By using RoboLike, you agree to abide by our Fair Play
                Agreement. This means you will{" "}
                <span className="text-[#07b0ef] font-bold">NOT</span> use
                RoboLike in ways that:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
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
              <p className="text-gray-100">
                RoboLike is designed to enhance genuine engagement, not to game
                the system. Use it to connect with real people who might be
                interested in your content.
              </p>
            </section>

            <div className="bg-[#1c1c1c] p-4 rounded-lg border border-[#9633ac] my-8">
              <h3
                className="text-xl mb-3 text-[#9633ac]"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                IMPORTANT DISCLAIMER
              </h3>
              <p className="text-gray-100 mb-2">
                RoboLike is{" "}
                <span className="text-[#f7ee2a] font-bold">NOT</span> associated
                with or endorsed by Instagram or any other social media
                companies. We are an independent, open-source tool created by
                developers for developers and social media enthusiasts.
              </p>
              <p className="text-gray-100">
                Use of automation tools may violate the terms of service of some
                platforms. You're responsible for understanding and following
                the rules of any service you use RoboLike with.
              </p>
            </div>

            <section>
              <h2
                className="text-2xl mb-4 text-[#f7ee2a]"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                3. PRIVACY SHIELD
              </h2>
              <p className="text-gray-100 mb-4">
                If you're using RoboLike from within a Privacy State or Country,
                you should be aware that we follow data protection best
                practices to the best of our abilities. We honor the Standard
                Clauses as established in GDPR.
              </p>
              <p className="text-gray-100 mb-4">
                Your privacy is a priority for us. RoboLike operates locally on
                your machine, which means:
              </p>
              <ul className="grid md:grid-cols-2 gap-4">
                <li className="flex items-start bg-black bg-opacity-40 p-3 rounded border border-[#07b0ef]">
                  <div className="text-[#07b0ef] mr-3 text-xl">🔒</div>
                  <p>Your login credentials never leave your computer</p>
                </li>
                <li className="flex items-start bg-black bg-opacity-40 p-3 rounded border border-[#07b0ef]">
                  <div className="text-[#07b0ef] mr-3 text-xl">🛡️</div>
                  <p>No central servers storing your information</p>
                </li>
                <li className="flex items-start bg-black bg-opacity-40 p-3 rounded border border-[#07b0ef]">
                  <div className="text-[#07b0ef] mr-3 text-xl">🌐</div>
                  <p>All activity comes from your own IP address</p>
                </li>
                <li className="flex items-start bg-black bg-opacity-40 p-3 rounded border border-[#07b0ef]">
                  <div className="text-[#07b0ef] mr-3 text-xl">🎮</div>
                  <p>You have full control over the app at all times</p>
                </li>
              </ul>
            </section>

            <section>
              <h2
                className="text-2xl mb-4 text-[#FA8E10]"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                4. CHANGING THE RULES
              </h2>
              <p className="text-gray-100 mb-4">
                We live in a world where terms and conditions can change at a
                moment's notice. We reserve the right to update these terms as
                needed to adapt to changes in:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Technology landscape</li>
                <li>Legal requirements</li>
                <li>Social media platform policies</li>
                <li>User feedback and needs</li>
              </ul>
              <p className="text-gray-100 mb-4">
                Our goal is to be the best that we can be without profiting off
                consumers in ways that are not obviously objectifiable or
                counter to privacy principles. We're committed to transparent,
                ethical practices.
              </p>
              <p className="text-gray-100">
                When we make changes to these terms, we'll update the "Last
                Updated" date below and may notify users through the application
                or our website.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl mb-4 text-[#9633ac]"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                5. OPEN SOURCE COMMITMENT
              </h2>
              <p className="text-gray-100 mb-4">
                RoboLike is open source software, which means you can inspect,
                modify, and distribute the code under the terms of our license.
                This transparency ensures you can verify what the software is
                doing and make changes to suit your needs.
              </p>
              <p className="text-gray-100">
                However, modified versions are used at your own risk, and we
                cannot provide support for custom implementations.
              </p>
            </section>

            <div className="mt-12 p-6 bg-black bg-opacity-60 rounded-lg border border-[#f7ee2a]">
              <p
                className="text-md text-center text-[#f7ee2a]"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                By downloading, installing, or using RoboLike, you agree to
                these terms and conditions.
              </p>
              <p className="text-center text-gray-300 mt-2">
                Last updated: 17/03/2025
              </p>
              <p className="text-center text-gray-300 mt-4">
                <a href="/privacy-policy" className="text-[#07b0ef] hover:underline">
                  View our Privacy Policy
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
