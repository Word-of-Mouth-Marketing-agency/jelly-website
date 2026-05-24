"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  productId: string;
  initialActive: boolean;
  hasSession: boolean;
  locale: string;
  className?: string;
};

export default function WishlistToggle({
  productId,
  initialActive,
  hasSession,
  locale,
  className = "",
}: Props) {
  const router = useRouter();
  const [active, setActive] = useState(initialActive);
  const [isPending, startTransition] = useTransition();

  function toggleWishlist() {
    if (!hasSession) {
      const callbackUrl = encodeURIComponent(window.location.pathname);
      router.push(`/${locale}/login?callbackUrl=${callbackUrl}`);
      return;
    }

    const nextActive = !active;
    setActive(nextActive);

    startTransition(async () => {
      const response = await fetch("/api/wishlist", {
        method: nextActive ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (response.status === 401) {
        setActive(active);
        const callbackUrl = encodeURIComponent(window.location.pathname);
        router.push(`/${locale}/login?callbackUrl=${callbackUrl}`);
        return;
      }

      if (!response.ok) {
        setActive(active);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggleWishlist}
      disabled={isPending}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      title={hasSession ? "Save to wishlist" : "Sign in to save"}
      className={`inline-flex items-center justify-center rounded-full bg-white text-on-surface shadow-md border border-outline-variant transition-all hover:text-error hover:scale-105 disabled:opacity-60 ${className}`}
    >
      <Heart
        size={20}
        strokeWidth={2.25}
        fill={active ? "currentColor" : "none"}
        className={active ? "text-error" : ""}
        aria-hidden="true"
      />
    </button>
  );
}
