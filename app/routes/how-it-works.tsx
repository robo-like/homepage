import Container from "~/components/Container";
import type { Route } from "./+types/how-it-works";
import { H1, H2 } from "~/components/H1";
import { Card } from "~/components/Card";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "How RoboLike Works - Automated Social Media Engagement" },
    { name: "description", content: "RoboLike is an auto liker which means we like posts on your behalf (not the other way around). We don't give you fake likes, we reach out to real people." },
  ];
}

export default function HowItWorks() {
  return (
    <Container className="mt-10">
      <div className="text-center mb-12">
        <H1>How RoboLike Works</H1>
        <p className="text-lg text-gray-400">
          Reach your target audience authentically and grow your following organically
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card className="text-center">
          <div className="text-8xl mb-5 font-serif">1</div>
          <H2>Download App</H2>
          <p className="text-gray-400">
            Get started by downloading RoboLike from our downloads page. The app runs locally on your machine for maximum privacy and security.
          </p>
        </Card>

        <Card className="text-center">
          <div className="text-8xl mb-5 font-serif">2</div>
          <H2>Connect Account</H2>
          <p className="text-gray-400">
            Log in to your social media account directly through the app. Your credentials are stored locally and never leave your machine.
          </p>
        </Card>

        <Card className="text-center">
          <div className="text-8xl mb-5 font-serif">3</div>
          <H2>Select Tags</H2>
          <p className="text-gray-400">
            Choose hashtags relevant to your niche. RoboLike will engage with popular posts from these tags to reach your target audience.
          </p>
        </Card>
      </div>

      <Card className="mb-16">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-3xl font-bold mb-6">The Power of Authentic Engagement</h2>
          <p>
            When you like someone's post, you're not just clicking a button – you're making a connection.
            RoboLike automates this process by engaging with posts from your target audience, creating
            genuine opportunities for reciprocal engagement.
          </p>

          <p>
            Unlike services that promise fake followers or engagement, RoboLike helps you reach real
            people who are actively posting content in your niche. When these users receive a notification
            that you've liked their post, they often check out your profile and engage back if they find
            your content relevant.
          </p>

          <h3 className="text-2xl font-bold mt-8 mb-4">Privacy First Approach</h3>
          <p>
            Your security is our priority. The new RoboLike runs entirely on your local machine, which means:
          </p>
          <ul>
            <li>Your login credentials never leave your computer</li>
            <li>You maintain complete control over the application</li>
            <li>Engagement comes from your IP address, just like normal usage</li>
            <li>No risk of centralized data breaches</li>
          </ul>

          <h3 className="text-2xl font-bold mt-8 mb-4">Getting Results</h3>
          <p>
            Once you start RoboLike, it will begin engaging with posts based on your selected hashtags.
            Monitor your dashboard to see your engagement metrics and adjust your tags as needed. The key
            is to stay relevant to your niche and maintain consistent activity.
          </p>
        </div>
      </Card>

      <Card className="text-center p-8">
        <H2>Ready to Grow Your Following?</H2>
        <p className="text-gray-400 mb-6">
          Start reaching your target audience today with RoboLike's automated engagement.
        </p>
        <a
          href="/downloads"
          className="inline-block px-6 py-3 bg-[#6A1E55] text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Download RoboLike
        </a>
      </Card>
    </Container>
  );
}
