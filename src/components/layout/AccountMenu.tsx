"use client";

import { signOut, useSession } from "next-auth/react";
import { User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Props = {
  locale: string;
};

export default function AccountMenu({ locale }: Props) {
  const { status } = useSession();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (status !== "authenticated") {
    return (
      <Link
        href={`/${locale}/account`}
        className="hover:scale-105 transition-transform"
        aria-label="Account"
      >
        <User size={24} strokeWidth={2.25} aria-hidden="true" />
      </Link>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="hover:scale-105 transition-transform"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <User size={24} strokeWidth={2.25} aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-3 w-56 rounded-2xl border-2 border-outline bg-white p-2 shadow-lg z-50"
        >
          {[
            ["Account", `/${locale}/account`],
            ["Orders", `/${locale}/account/orders`],
            ["Wishlist", `/${locale}/wishlist`],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container"
            >
              {label}
            </Link>
          ))}
          <button
            type="button"
            role="menuitem"
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className="w-full rounded-lg px-4 py-2 text-left text-sm font-semibold text-error hover:bg-error-container"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
