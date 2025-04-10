import logoDark from "../home/heart.png";
import NavLink from "./NavLink";
import { useOutletContext } from "react-router";
import { useState } from "react";
import { type OutletContext } from "../root";

export function Header() {
  const { user } = useOutletContext<OutletContext>();
  const isLoggedIn = !!user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <main className="border-b border-dashed border-gray-300 px-2 font-set-4 relative z-10">
      <div className="flex flex-row justify-between items-center">
        {/* LOGO */}
        <header className="flex flex-row items-center px-3 py-3">
          <a href="/" className="flex flex-row items-center cursor-pointer">
            <div className="w-[35px] mr-2">
              <img
                src={logoDark}
                alt="RoboLike Heart Logo"
                className="w-full"
              />
            </div>
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: 'var(--heading-font, "Syncopate", sans-serif)',
                textRendering: "optimizeLegibility",
              }}
            >
              ROBO<span style={{ color: "#07b0ef" }}>LIKE</span>
            </h1>
          </a>
        </header>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden px-3 py-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-end items-center space-x-4 px-3 py-2">
          <NavLink
            to="/instagram-auto-liker-how-it-works"
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            HOW IT WORKS
          </NavLink>
          <NavLink
            to="/install-guide"
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            DOWNLOAD
          </NavLink>
          <NavLink
            to="/social-media-automation-pricing"
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            PRICING
          </NavLink>
          <NavLink
            to="/blog"
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            BLOG
          </NavLink>
          {isLoggedIn ? (
            <NavLink
              to="/auth/logout"
              style={{
                fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                color: "#b11b0c",
                fontWeight: "bold",
              }}
            >
              LOGOUT
            </NavLink>
          ) : (
            <NavLink
              to="/auth/login"
              style={{
                fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                color: "#0fcc45",
                fontWeight: "bold",
              }}
              className="px-3 py-1 rounded border border-current hover:bg-green-50"
            >
              LOGIN/SIGNUP
            </NavLink>
          )}
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <nav className="md:hidden flex flex-col space-y-4 px-3 py-4 border-t border-dashed border-gray-300">
          <NavLink
            to="/instagram-auto-liker-how-it-works"
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            HOW IT WORKS
          </NavLink>
          <NavLink
            to="/install-guide"
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            DOWNLOAD
          </NavLink>
          <NavLink
            to="/social-media-automation-pricing"
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            PRICING
          </NavLink>
          <NavLink
            to="/blog"
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            BLOG
          </NavLink>
          {isLoggedIn ? (
            <NavLink
              to="/auth/logout"
              style={{
                fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                color: "#b11b0c",
                fontWeight: "bold",
              }}
            >
              LOGOUT
            </NavLink>
          ) : (
            <NavLink
              to="/auth/login"
              style={{
                fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                color: "#0fcc45",
                fontWeight: "bold",
              }}
              className="px-3 py-1 rounded border border-current hover:bg-green-50"
            >
              LOGIN/SIGNUP
            </NavLink>
          )}
        </nav>
      )}
    </main>
  );
}
