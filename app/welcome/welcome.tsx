import { Header } from './Header';
import logoDark from './heart.png';
import { AnimatedText } from './AnimatedText';

export function Welcome() {
  return (
    <>
      <Header />
      <section className="flex justify-center items-center w-full py-10">
        <div className="max-w-[850px] flex flex-row items-center w-full px-4 pt-10">
          <div className="flex-[3] pr-4">
            <h1 className="text-4xl font-bold mb-4">Welcome to the new RoboLike</h1>
            <p className="text-lg">
              Discover the power of automation with RoboLike. 
              Reach your fans, audience, and customers effortlessly.
            </p>
          </div>
          <div className="flex-1 flex justify-center pt-5">
            <img
              src={logoDark}
              alt="RoboLike Heart Logo"
              className="w-[150px] animate-float"
            />
          </div>
        </div>
      </section>
      <section className="flex flex-col justify-center items-center w-full py-10">
        <AnimatedText />
        <div className="max-w-[850px] flex flex-row gap-6 w-full px-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Download App</h3>
            <p className="text-lg">Download the app from the app store.</p>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Log Into Your Social Account</h3>
            <p className="text-lg">
              Follow on-screen steps to authorize the API to get recent posts.
            </p>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Select Tags</h3>
            <p className="text-lg">
              Monitor the usage and make sure it's relevant to your profile.
            </p>
          </div>
        </div>
      </section>
      <section className="flex justify-center items-center w-full py-10">
        <div className="max-w-[850px] w-full px-4">
          <h2 className="text-3xl font-bold mb-4">How it works</h2>
          <p className="text-lg">
            If you think about how it feels to have someone "like" a post you publish, 
            you might conjure images of dopamine, success, and connection. Since the 
            dawn of social media, we've been spending our days liking this and that. 
            However, not many people know that liking posts is an evil genius way to 
            get other people to come to your content. RoboLike makes that process 
            automated so you can reach more people than you would have just doing that 
            on your own.
          </p>
        </div>
      </section>

      {/* FAQ section :: accordion with the first one open by default */}
    </>
  );
}
