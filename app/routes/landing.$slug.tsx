import type { Route } from "./+types/landing.$slug";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: "RoboLike - Smart Instagram Automation" },
    {
      name: "description",
      content:
        "Grow your Instagram presence with RoboLike's intelligent automation tool. Start your free trial and connect with your target audience.",
    },
    {
      property: "og:title",
      content: "RoboLike - Smart Instagram Automation",
    },
    {
      property: "og:description",
      content:
        "Grow your Instagram presence with RoboLike's intelligent automation tool. Start your free trial and connect with your target audience.",
    },
    {
      property: "og:image",
      content: "/seo/homepage-seo-image.gif",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:image",
      content: "/seo/homepage-seo-image.gif",
    },
  ];
}

export default function Landing({ params }: Route.ComponentProps) {

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-50 border-b border-gray-200">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-orange-200/20 to-coral-200/30 pointer-events-none"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Logo and Brand */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-0 mb-8">
              <img
                src="/robolike-orange-robot-heart.png"
                alt="RoboLike"
                className="w-auto h-20 mr-[-20px]"
              />
              <h1 className="text-6xl font-black text-gray-900">
                RoboLike
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Grow your Instagram presence automatically with smart, safe automation that works while you focus on creating great content.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/install-guide"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Start Free Trial
            </a>
            <a
              href="/instagram-auto-liker-how-it-works"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-16 pb-24 bg-white overflow-hidden">

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <span className="text-3xl font-bold text-orange-600 drop-shadow-sm">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Download & Install
              </h3>
              <p className="text-gray-600">
                Get our desktop app for Mac or Windows and connect your Instagram account securely.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <span className="text-3xl font-bold text-orange-600 drop-shadow-sm">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Set Your Hashtag
              </h3>
              <p className="text-gray-600">
                Choose a hashtag to like posts for that matches your niche to engage with the right audience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <span className="text-3xl font-bold text-orange-600 drop-shadow-sm">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Watch It Like
              </h3>
              <p className="text-gray-600">
                RoboLike works in the background, engaging with users while you create content.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="relative py-16 bg-gray-50 border-t border-gray-200">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tl from-orange-200/40 via-pink-200/30 to-purple-200/40 pointer-events-none"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose RoboLike
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Safe & Secure
              </h3>
              <p className="text-gray-600 text-sm">
                Runs locally on your computer. Your credentials never leave your device.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Real Engagement
              </h3>
              <p className="text-gray-600 text-sm">
                Connect with users genuinely interested in your content and niche.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Save Time
              </h3>
              <p className="text-gray-600 text-sm">
                Automate engagement while you focus on creating quality content.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Grow Your Instagram?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of creators and businesses using RoboLike to build their audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/install-guide"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-orange-600 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            >
              Download Free Trial
            </a>
            <a
              href="/social-media-automation-pricing"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-transparent border-2 border-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              View Pricing
            </a>
          </div>
          <p className="text-orange-100 mt-6 text-sm">
            No credit card required • Works on Mac & Windows • Cancel anytime
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="py-8 bg-gray-100 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <p className="text-gray-600 text-sm">
            <strong>Note:</strong> RoboLike requires your computer to stay on while running. Works with screen locked but not in sleep mode.
          </p>
        </div>
      </div>
    </div>
  );
}