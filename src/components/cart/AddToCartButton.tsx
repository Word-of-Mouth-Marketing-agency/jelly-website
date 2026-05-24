"use client";

import { addLocalCartItem } from "@/lib/client-cart";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useTransition } from "react";

type Props = {
  variantId: string | null;
  locale: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
};

export default function AddToCartButton({
  variantId,
  locale,
  quantity = 1,
  disabled = false,
  className = "",
}: Props) {
  const { status } = useSession();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function addToCart() {
    if (!variantId || disabled) return;
    setMessage("");

    if (status === "authenticated") {
      startTransition(async () => {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantId, quantity }),
        });
        const payload = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        setMessage(response.ok ? "Added to cart." : payload.error ?? "Try again.");
      });
      return;
    }

    addLocalCartItem(variantId, quantity);
    setMessage("Added to cart.");
  }

  return (
    <div>
      <button
        type="button"
        disabled={!variantId || disabled || isPending}
        onClick={addToCart}
        className={`bg-primary-container text-on-primary-container rounded-full font-label-lg text-label-lg sticker-border hover:bg-primary-fixed-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isPending ? "Adding..." : "Add to Cart"}
      </button>
      {message && (
        <p className="mt-2 text-sm text-on-surface-variant">
          {message}{" "}
          {message.startsWith("Added") && (
            <Link href={`/${locale}/cart`} className="font-semibold text-primary">
              View cart
            </Link>
          )}
        </p>
      )}
    </div>
  );
}
