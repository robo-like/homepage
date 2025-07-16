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
    <main className="bg-white shadow-sm border-b border-gray-200 px-4 relative z-10">
      <div className="flex flex-row justify-between items-center max-w-6xl mx-auto">
        {/* LOGO */}
        <header className="flex flex-row items-center py-4">
          <a href="/" className="flex flex-row items-center cursor-pointer gap-0">
            <img
              src="/robolike-orange-robot-heart.png"
              alt="RoboLike"
              className="w-auto h-12 mr-[-8px]"
            />
            <h1 className="text-3xl font-black text-gray-900">
              RoboLike
            </h1>
          </a>
        </header>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden px-3 py-2 text-gray-600 hover:text-gray-900"
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
        <nav className="hidden md:flex flex-1 justify-end items-center space-x-6">
          <NavLink to="/instagram-auto-liker-how-it-works">
            How It Works
          </NavLink>
          <NavLink to="/social-media-automation-pricing">
            Pricing
          </NavLink>
          <NavLink to="/faq">
            FAQ
          </NavLink>
          <NavLink to="/blog">
            Blog
          </NavLink>
          <a
            href="/install-guide"
            className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Download
          </a>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <nav className="md:hidden flex flex-col space-y-4 px-4 py-4 border-t border-gray-200 bg-gray-50">
          <NavLink to="/instagram-auto-liker-how-it-works">
            How It Works
          </NavLink>
          <NavLink to="/social-media-automation-pricing">
            Pricing
          </NavLink>
          <NavLink to="/faq">
            FAQ
          </NavLink>
          <NavLink to="/blog">
            Blog
          </NavLink>
          <a
            href="/install-guide"
            className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors mt-2"
          >
            Download
          </a>
        </nav>
      )}
    </main>
  );
}
