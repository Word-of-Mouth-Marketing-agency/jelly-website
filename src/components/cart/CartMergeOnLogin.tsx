"use client";

import { clearLocalCart, readLocalCart } from "@/lib/client-cart";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function CartMergeOnLogin() {
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;
    const items = readLocalCart();
    if (items.length === 0) return;

    let cancelled = false;
    fetch("/api/cart/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    }).then((response) => {
      if (!cancelled && response.ok) clearLocalCart();
    });

    return () => {
      cancelled = true;
    };
  }, [status]);

  return null;
}
