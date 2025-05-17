import logoDark from "../home/heart.png";
import NavLink from "./NavLink";
import { useOutletContext } from "react-router";
import { useState } from "react";
import { type OutletContext } from "../root";
import "../retro-fonts.css";

export function Header() {
  const { user } = useOutletContext<OutletContext>();
  const isLoggedIn = !!user;
  const isAdmin = isLoggedIn && user.role === "admin";
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
          <div
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            <NavLink to="/instagram-auto-liker-how-it-works">
              HOW IT WORKS
            </NavLink>
          </div>
          <div
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            <NavLink to="/social-media-automation-pricing">PRICING</NavLink>
          </div>
          <div
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            <NavLink to="/blog">BLOG</NavLink>
          </div>
          <div
            className="retro-button primary"
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
              padding: "0.25rem 0.5rem",
              fontSize: "0.9rem",
              fontWeight: "bold",
            }}
          >
            <NavLink to="/install-guide">Get Started</NavLink>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <nav className="md:hidden flex flex-col space-y-4 px-3 py-4 border-t border-dashed border-gray-300">
          <div
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            <NavLink to="/instagram-auto-liker-how-it-works">
              HOW IT WORKS
            </NavLink>
          </div>
          <div
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            <NavLink to="/social-media-automation-pricing">PRICING</NavLink>
          </div>
          <div
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            <NavLink to="/blog">BLOG</NavLink>
          </div>
          <div
            className="retro-button primary"
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
              padding: "0.25rem 0.5rem",
              fontSize: "0.9rem",
              fontWeight: "bold",
            }}
          >
            <NavLink to="/auth/login">Get Started</NavLink>
          </div>
        </nav>
      )}
    </main>
  );
}
