import logoDark from "../home/heart.png";

export function Header() {
  return (
    <main className="flex border-b border-dashed border-gray-300 px-2">
      {/* LOGO */}
      <header className="flex flex-row items-center px-3 py-3 ">
        <a href="/" className="flex flex-row items-center cursor-pointer">
          <div className="w-[35px] mr-2">
            <img
              src={logoDark}
              alt="RoboLike Heart Logo"
              className="w-full"
            />
          </div>
          <h1 className="text-2xl font-bold" style={{
            fontFamily: 'Inter, sans-serif',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility'
          }}>
            Robo<i style={{
              letterSpacing: '0.04em'
            }}>Like</i>
          </h1>
        </a>
      </header>
      {/* Navigation */}
      <nav className="flex-1 flex justify-end items-center space-x-4 px-3 py-2">
        <a href="/downloads" className="leading-6 text-gray-700 dark:text-gray-200 text-center font-bold">
          Download
        </a>
        <a href="/instagram-auto-liker-how-it-works" className="leading-6 text-gray-700 dark:text-gray-200 text-center font-bold">
          How it Works
        </a>
        <a href="/social-media-automation-pricing" className="leading-6 text-gray-700 dark:text-gray-200 text-center font-bold">
          Pricing
        </a>
        <a href="/blog" className="leading-6 text-gray-700 dark:text-gray-200 text-center font-bold">
          Blog
        </a>
      </nav>
    </main>
  );
}