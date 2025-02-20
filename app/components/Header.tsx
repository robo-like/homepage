import logoDark from "../home/heart.png";
import NavLink from "./NavLink";

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
        <NavLink to="/">
          Home
        </NavLink>
        <NavLink to="/downloads">
          Download
        </NavLink>
        <NavLink to="/instagram-auto-liker-how-it-works">
          How it Works
        </NavLink>
        <NavLink to="/social-media-automation-pricing">
          Pricing
        </NavLink>
        <NavLink to="/blog">
          Blog
        </NavLink>
      </nav>
    </main>
  );
}