"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AccountMenu from "./AccountMenu";
import { Globe, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Men", slug: "men" },
  { label: "Women", slug: "women" },
  { label: "Kids", slug: "kids" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";

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
        Free Standard Shipping on Orders EGP 75+
      </div>

      {/* Main nav */}
      <nav className="px-margin-mobile md:px-margin-desktop py-4">
        <div className="max-w-container-max mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo + nav links */}
          <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-start">
            <Link href={`/${locale}`} className="relative flex-shrink-0">
              <Image
                src="/brand/jelly-logo.png"
                alt="Jelly logo"
                width={110}
                height={40}
                className="h-auto w-[90px] sm:w-[110px]"
                priority
              />
            </Link>
            <div className="hidden md:flex gap-6">
              {NAV_LINKS.map(({ label, slug }) => (
                <Link
                  key={slug}
                  href={`/${locale}/category/${slug}`}
                  className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-lg text-label-lg"
                >
                  {label}
                </Link>
              ))}
              <Link
                href={`/${locale}/about`}
                className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-lg text-label-lg"
              >
                About
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-lg text-label-lg"
              >
                Contact
              </Link>
            </div>
            <button
              type="button"
              className="md:hidden p-1 text-on-surface"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? (
                <X size={24} strokeWidth={2.25} aria-hidden="true" />
              ) : (
                <Menu size={24} strokeWidth={2.25} aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Search + icons */}
          <div className="flex items-center gap-4">
            <form
              action={`/${locale}/search`}
              className="relative hidden sm:block"
            >
              <input
                name="q"
                type="text"
                placeholder="Search..."
                className="bg-surface-container rounded-full px-6 py-2 border-2 border-outline focus:outline-none focus:ring-2 focus:ring-primary w-48 lg:w-64"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
              >
                <Search size={20} strokeWidth={2.25} aria-hidden="true" />
              </button>
            </form>

            <div className="flex items-center gap-4">
              <Link
                href={locale === "ar" ? "/en" : "/ar"}
                className="flex items-center gap-1 hover:scale-105 transition-transform font-label-lg text-label-lg text-on-surface-variant"
              >
                <Globe size={20} strokeWidth={2.25} aria-hidden="true" />
                <span>{locale.toUpperCase()}</span>
              </Link>
              <AccountMenu locale={locale} />
              <Link
                href={`/${locale}/wishlist`}
                className="hover:scale-105 transition-transform"
                aria-label="Wishlist"
              >
                <Heart size={24} strokeWidth={2.25} aria-hidden="true" />
              </Link>
              <Link
                href={`/${locale}/cart`}
                className="hover:scale-105 transition-transform relative"
                aria-label="Cart"
              >
                <ShoppingBag size={24} strokeWidth={2.25} aria-hidden="true" />
                <span className="absolute -top-1 -right-1 bg-primary-container text-on-primary-container text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-outline-variant bg-white px-margin-mobile py-4 flex flex-col gap-4"
        >
          {NAV_LINKS.map(({ label, slug }) => (
            <Link
              key={slug}
              href={`/${locale}/category/${slug}`}
              className="font-label-lg text-label-lg text-on-surface hover:text-primary transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href={`/${locale}/about`}
            className="font-label-lg text-label-lg text-on-surface hover:text-primary transition-colors duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="font-label-lg text-label-lg text-on-surface hover:text-primary transition-colors duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <form action={`/${locale}/search`} className="relative mt-2">
            <input
              name="q"
              type="text"
              placeholder="Search..."
              className="w-full bg-surface-container rounded-full px-6 py-2 border-2 border-outline focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
            >
              <Search size={20} strokeWidth={2.25} aria-hidden="true" />
            </button>
          </form>
        </nav>
      )}
    </header>
  );
}
