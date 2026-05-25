"use client";

import { readLocalCart } from "@/lib/client-cart";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState, useTransition } from "react";

export default function CartCount() {
  const { status } = useSession();
  const [count, setCount] = useState(0);
  const [, startTransition] = useTransition();

  const refresh = useCallback(() => {
    if (status === "loading") return;

    startTransition(async () => {
      if (status === "authenticated") {
        try {
          const res = await fetch("/api/cart", { cache: "no-store" });
          if (!res.ok) {
            setCount(0);
            return;
          }
          const data = (await res.json()) as { items?: { quantity: number }[] };
          setCount(data.items?.reduce((s, i) => s + i.quantity, 0) ?? 0);
        } catch {
          setCount(0);
        }
      } else {
        setCount(readLocalCart().reduce((s, i) => s + i.quantity, 0));
      }
    });
  }, [status]);

  useEffect(() => {
    refresh();
    window.addEventListener("jelly-cart-change", refresh);
    return () => window.removeEventListener("jelly-cart-change", refresh);
  }, [refresh]);

  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-primary-container text-on-primary-container text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
      {count > 99 ? "99+" : count}
    </span>
  );
}
