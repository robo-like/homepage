import type { Route } from "./+types/how-it-works";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "How Free Instagram Auto Liker Works - RoboLike" },
    {
      name: "description",
      content:
        "Learn how RoboLike's free Instagram auto liker works. Discover how our automated engagement tool drives real followers and boosts your Instagram growth safely.",
    },
    // OpenGraph tags
    {
      property: "og:title",
      content: "How Free Instagram Auto Liker Works - RoboLike",
    },
    {
      property: "og:description",
      content:
        "Learn how RoboLike's free Instagram auto liker works. Discover how our automated engagement tool drives real followers and boosts your Instagram growth safely.",
    },
    {
      property: "og:type",
      content: "website",
    },
  ];
}

export default function HowItWorks() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent pb-2">
            How RoboLike Works
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Power up your Instagram with real engagement
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-600 text-white text-2xl font-bold">
                  1
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Download & Install
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Get the app running on your machine. This gives you full control
                and maximum security since everything runs locally.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-pink-600 text-white text-2xl font-bold">
                  2
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Connect Account
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Log in to your Instagram securely through the app. Your
                credentials stay on your device - we never see them.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-600 text-white text-2xl font-bold">
                  3
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Target & Activate
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Choose hashtags that match your audience. Hit start and watch as
                RoboLike engages with potential followers in your niche.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Actually Works Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
            How Engagement Works
          </h2>

          <div className="space-y-6 text-lg">
            <p className="text-gray-700 leading-relaxed">
              RoboLike works by{" "}
              <span className="text-orange-600 font-bold">
                automatically liking posts
              </span>{" "}
              from hashtags you choose. This sends notifications to those users,
              showing your profile and content.
            </p>

            <p className="text-gray-700 leading-relaxed">
              When someone gets a like notification, they often{" "}
              <span className="text-pink-600 font-bold">
                check out who liked their post
              </span>
              . If your content resonates with them, they'll likely follow back,
              like your posts, or even leave comments.
            </p>

            <p className="text-gray-700 leading-relaxed">
              It's like walking into a networking event and introducing yourself
              to people who share your interests. Except RoboLike does this at
              scale, <span className="text-purple-600 font-bold">24/7</span>,
              while you focus on creating amazing content.
            </p>

            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200 my-8">
              <h3 className="text-xl font-bold mb-3 text-orange-800">
                The Instagram Algorithm Loves It
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Instagram's algorithm rewards active accounts. By consistently
                engaging with content in your niche, you signal to Instagram
                that you're an active, valuable community member - which can
                boost your own content's visibility.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results You Can Expect */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
            Results You Can Expect
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-start">
                <div className="text-orange-600 text-3xl mr-4">⬆️</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    More Followers
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Users who notice your likes often check out your profile and
                    follow if they like what they see. Grow your audience with
                    people who match your interests.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-start">
                <div className="text-pink-600 text-3xl mr-4">🔄</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    Higher Engagement
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    When you engage with others, they're more likely to engage
                    back. Expect more likes, comments, and DMs on your own
                    content.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-start">
                <div className="text-purple-600 text-3xl mr-4">🎯</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    Targeted Reach
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    By focusing on specific hashtags, you reach people who are
                    already interested in your niche. Better quality connections
                    lead to higher conversion rates.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-start">
                <div className="text-green-600 text-3xl mr-4">⏱️</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    Time Freedom
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Focus on creating great content while RoboLike handles the
                    time-consuming engagement work. Your account grows even
                    while you sleep.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
            Security & Privacy
          </h2>

          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed text-center mb-8">
              The RoboLike app runs completely on{" "}
              <span className="text-orange-600 font-bold">your machine</span>,
              giving you maximum security:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="text-orange-600 mr-4 text-2xl">🔒</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Local Credentials
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Your login info never leaves your computer
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-orange-600 mr-4 text-2xl">🌐</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Your IP Address
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    All activity comes from your own IP, just like normal usage
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-orange-600 mr-4 text-2xl">🛡️</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No Data Breaches
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    No central server storing your information
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-orange-600 mr-4 text-2xl">🎮</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Full Control
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Adjust settings or pause at any time
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200 mt-8">
              <p className="text-orange-800 text-sm leading-relaxed">
                <strong>Note:</strong> Your computer must remain on while
                RoboLike is running. It will work with your screen locked, but
                not in sleep mode or with the lid closed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Ready to Get Started?
          </h2>

          <p className="text-xl mb-8 text-gray-700 leading-relaxed">
            Join thousands of users who are growing their Instagram presence
            with RoboLike
          </p>

          <a
            href="/install-guide"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
          >
            Download Now
          </a>
        </div>
      </div>
    </div>
  );
}
