"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`bg-white w-full sticky top-0 z-50 transition-shadow duration-200 ${
        scrolled ? "shadow-lg" : "border-b border-on-surface"
      }`}
    >
      {/* Announcement bar */}
      <div className="bg-brand-blue text-white text-center py-2 px-4 font-label-lg text-label-lg">
        Free Standard Shipping on Orders $75+
      </div>

      {/* Main nav */}
      <nav className="max-w-container-max mx-auto px-margin-desktop py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo + nav links */}
        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-start">
          <Link
            href="#"
            className="font-display-lg text-headline-lg font-black text-on-surface"
          >
            Jelly
          </Link>
          <div className="hidden md:flex gap-6">
            {["Men", "Women", "Kids", "Gifting", "About", "Contact"].map(
              (label) => (
                <Link
                  key={label}
                  href="#"
                  className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-lg text-label-lg"
                >
                  {label}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Search + icons */}
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search..."
              className="bg-surface-container rounded-full px-6 py-2 border-2 border-outline focus:outline-none focus:ring-2 focus:ring-primary w-48 lg:w-64"
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:scale-105 transition-transform font-label-lg text-label-lg text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">public</span>
              <span>EN</span>
            </button>
            <button className="hover:scale-105 transition-transform">
              <span className="material-symbols-outlined">person</span>
            </button>
            <button className="hover:scale-105 transition-transform">
              <span className="material-symbols-outlined">favorite</span>
            </button>
            <button className="hover:scale-105 transition-transform relative">
              <span className="material-symbols-outlined">shopping_bag</span>
              <span className="absolute -top-1 -right-1 bg-primary-container text-on-primary-container text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                0
              </span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
