import type { Route } from "./+types/faq";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Free Instagram Auto Liker FAQ - RoboLike" },
    {
      name: "description",
      content:
        "Free Instagram auto liker FAQ. Get answers about RoboLike's automated Instagram growth tool. Learn how our free Instagram automation works safely.",
    },
    {
      name: "keywords",
      content: "free instagram auto liker, instagram automation free, auto like instagram, instagram growth tool free, FAQ, questions",
    },
    {
      property: "og:title",
      content: "Free Instagram Auto Liker FAQ - RoboLike",
    },
    {
      property: "og:description",
      content: "Free Instagram auto liker FAQ. Get answers about RoboLike's automated Instagram growth tool. Learn how our free Instagram automation works safely.",
    },
  ];
}

export default function FAQ() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent pb-2">
            Instagram Auto Liker FAQ
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
            Everything you need to know about RoboLike's Instagram auto liker and automation features. 
            Get answers to the most common questions about growing your Instagram presence safely and effectively.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our Instagram auto liker helps you engage with your target audience while you focus on creating amazing content.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-8">
            
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                How does RoboLike's Instagram auto liker work?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                RoboLike is an Instagram auto liker that runs directly on your computer and automatically likes posts on
                Instagram based on hashtags you select. This Instagram automation tool helps you engage
                with potential followers and grow your audience organically by targeting users who are already
                interested in your niche.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The auto liker works by searching for posts with your chosen hashtags and liking them at natural intervals,
                helping you connect with users who share similar interests.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Is RoboLike's Instagram auto liker safe for my account?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Yes! Our Instagram auto liker is designed with safety as the top priority. RoboLike uses natural engagement 
                patterns and respects Instagram's rate limits to keep your account safe. The app runs locally on your machine,
                so your login credentials are never sent to our servers.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Unlike web-based Instagram automation tools, RoboLike operates directly from your computer, 
                giving you complete control over your account security and automation settings.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                What makes RoboLike different from other Instagram auto likers?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                RoboLike stands out as an Instagram auto liker because it runs locally on your computer rather than
                in the cloud. This means better security, more control, and no dependency on external servers that
                could be shut down or compromised.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our Instagram automation tool also focuses specifically on hashtag-based targeting, which is one of the
                most effective and safe methods for organic Instagram growth.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Can I cancel my Instagram auto liker subscription anytime?
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Absolutely! All RoboLike plans come with a no-questions-asked cancellation policy. 
                You can upgrade, downgrade, or cancel your Instagram auto liker subscription at any time 
                from your account dashboard. We believe in giving you complete control over your Instagram automation journey.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Do I need to keep my computer on for the Instagram auto liker to work?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Yes, since RoboLike is a desktop Instagram auto liker, your computer needs to be on and connected 
                to the internet for the automation to run. However, you can lock your screen or use other apps 
                while RoboLike runs quietly in the background.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This desktop approach is actually a security advantage - your Instagram automation runs from your own 
                device rather than unknown servers, giving you complete control over your account safety.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                How many likes per day does the Instagram auto liker provide?
              </h2>
              <p className="text-gray-700 leading-relaxed">
                RoboLike provides unlimited likes per day with all plans. However, our Instagram auto liker 
                automatically manages the pace of liking to stay within Instagram's safety guidelines and 
                maintain natural engagement patterns. This ensures your account remains safe while maximizing 
                your growth potential.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                What targeting options are available with the Instagram auto liker?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                RoboLike's Instagram auto liker currently focuses on hashtag-based targeting, which is one of the 
                most effective methods for finding and engaging with your ideal audience. You can set up multiple 
                hashtags related to your niche, and the auto liker will engage with posts using those hashtags.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Advanced plans include additional targeting options and analytics to help you optimize your 
                Instagram automation strategy for better results.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Does the Instagram auto liker work on both Mac and Windows?
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Yes! RoboLike's Instagram auto liker is available for both Mac and Windows computers. 
                The installation process is simple, and the app works identically on both platforms, 
                giving you the same powerful Instagram automation features regardless of your operating system.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                How quickly will I see results with the Instagram auto liker?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Results with RoboLike's Instagram auto liker typically start within the first few days of use. 
                However, sustainable Instagram growth is a gradual process. Most users see noticeable increases 
                in followers and engagement within 2-4 weeks of consistent use.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The key to success with any Instagram automation tool is consistency, quality content, and 
                proper hashtag targeting. RoboLike handles the engagement automation while you focus on creating 
                great content for your growing audience.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}