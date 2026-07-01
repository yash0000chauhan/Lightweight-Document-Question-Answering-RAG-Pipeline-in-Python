import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, GitBranch, Info } from 'lucide-react';

export default function Navbar() {
  const { dark, setDark } = useTheme();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-surface-border dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">

        {/* Left: Logo + Name */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-lg"
          aria-label="DocQA Home"
        >
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-sm group-hover:bg-primary-700 transition-colors duration-300">
            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm font-bold text-neutral-text dark:text-gray-100 tracking-tight">
            DocQA
          </span>
        </Link>

        {/* Right: Actions */}
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          {/* Theme Toggle */}
          <button
            id="theme-toggle"
            onClick={() => setDark(!dark)}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="btn-ghost rounded-xl p-2.5"
          >
            {dark
              ? <Sun  className="w-4 h-4" aria-hidden="true" />
              : <Moon className="w-4 h-4" aria-hidden="true" />}
          </button>

          {/* GitHub */}
          <a
            id="github-link"
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="btn-ghost rounded-xl p-2.5"
          >
            <GitBranch className="w-4 h-4" aria-hidden="true" />
          </a>

          {/* About */}
          <Link
            id="about-link"
            to="/about"
            className={`btn-ghost rounded-xl px-3 py-2 text-sm font-medium flex items-center gap-1.5 ${location.pathname === '/about' ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30' : ''}`}
            aria-current={location.pathname === '/about' ? 'page' : undefined}
          >
            <Info className="w-4 h-4" aria-hidden="true" />
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
