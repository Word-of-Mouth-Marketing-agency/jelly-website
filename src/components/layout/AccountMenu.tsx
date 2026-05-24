"use client";

import { signOut, useSession } from "next-auth/react";
import { User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  locale: string;
};

export default function AccountMenu({ locale }: Props) {
  const { status } = useSession();
  const [open, setOpen] = useState(false);

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
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="hover:scale-105 transition-transform"
        aria-label="Account menu"
        aria-expanded={open}
      >
        <User size={24} strokeWidth={2.25} aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl border-2 border-outline bg-white p-2 shadow-lg z-50">
          {[
            ["Account", `/${locale}/account`],
            ["Orders", `/${locale}/account/orders`],
            ["Wishlist", `/${locale}/wishlist`],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container"
            >
              {label}
            </Link>
          ))}
          <button
            type="button"
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
