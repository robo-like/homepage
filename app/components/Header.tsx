import logoDark from "../home/heart.png";
import NavLink from "./NavLink";

export function Header() {
  return (
    <main className="flex border-b border-dashed border-gray-300 px-2 font-set-4">
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
            fontFamily: 'var(--heading-font, "Syncopate", sans-serif)',
            textRendering: 'optimizeLegibility'
          }}>
            ROBO<span style={{ color: '#07b0ef' }}>LIKE</span>
          </h1>
        </a>
      </header>
      {/* Navigation */}
      {/* <nav className="flex-1 flex justify-end items-center space-x-4 px-3 py-2">
        <NavLink to="/" style={{
          fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
        }}>
          Home
        </NavLink>
        <NavLink to="/downloads" style={{
          fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
        }}>
          Download
        </NavLink>
        <NavLink to="/instagram-auto-liker-how-it-works" style={{
          fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
        }}>
          How it Works
        </NavLink>
        <NavLink to="/social-media-automation-pricing" style={{
          fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
        }}>
          Pricing
        </NavLink>
        <NavLink to="/blog" style={{
          fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
        }}>
          Blog
        </NavLink>
        <NavLink to="/install-guide" style={{
          fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
          color: '#07b0ef',
          fontWeight: 'bold'
        }}>
          Installation Guide
        </NavLink>
      </nav> */}
    </main>
  );
}