"use client";

import { clearLocalCart, readLocalCart, setLocalCartItem } from "@/lib/client-cart";
import type { CartQuote } from "@/lib/cart";
import { money } from "@/lib/money";
import { ShoppingBag } from "lucide-react";
import StorefrontContainer from "@/components/layout/StorefrontContainer";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

type Props = {
  locale: string;
};

export default function CartClient({ locale }: Props) {
  const { status } = useSession();
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [isPending, startTransition] = useTransition();
  const isLoggedIn = status === "authenticated";

  function loadCart(code = couponCode) {
    startTransition(async () => {
      if (isLoggedIn) {
        const response = await fetch("/api/cart", { cache: "no-store" });
        const payload = (await response.json()) as CartQuote;
        if (code) {
          const quoted = await fetch("/api/cart/quote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: payload.items.map((item) => ({
                variantId: item.variantId,
                quantity: item.quantity,
              })),
              couponCode: code,
            }),
          });
          setQuote((await quoted.json()) as CartQuote);
        } else {
          setQuote(payload);
        }
        return;
      }

      const response = await fetch("/api/cart/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: readLocalCart(), couponCode: code }),
      });
      setQuote((await response.json()) as CartQuote);
    });
  }

  useEffect(() => {
    if (status === "loading") return;
    loadCart();
    const handler = () => loadCart();
    window.addEventListener("jelly-cart-change", handler);
    return () => window.removeEventListener("jelly-cart-change", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function updateItem(variantId: string, quantity: number) {
    startTransition(async () => {
      if (isLoggedIn) {
        await fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantId, quantity }),
        });
        window.dispatchEvent(new Event("jelly-cart-change"));
      } else {
        setLocalCartItem(variantId, quantity);
      }
      loadCart();
    });
  }

  function removeItem(variantId: string) {
    updateItem(variantId, 0);
  }

  function clearCart() {
    startTransition(async () => {
      if (isLoggedIn) {
        await fetch("/api/cart", { method: "DELETE" });
        window.dispatchEvent(new Event("jelly-cart-change"));
      } else {
        clearLocalCart();
      }
      setCouponCode("");
      loadCart("");
    });
  }

  const items = quote?.items ?? [];

  return (
    <StorefrontContainer className="py-12" as="div">
      {items.length === 0 ? (
        <div className="text-center py-24">
          <ShoppingBag size={72} strokeWidth={1.75} className="mx-auto mb-6 text-outline-variant" aria-hidden="true" />
          <h2 className="font-headline-md text-headline-md mb-3">
            Your cart is empty
          </h2>
          <p className="text-on-surface-variant mb-8">
            Find a pair you love and add it here.
          </p>
          <Link
            href={`/${locale}/search`}
            className="inline-block bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-label-lg text-label-lg sticker-border"
          >
            Browse socks
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-gutter">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="bg-white rounded-2xl sticker-border p-4 grid grid-cols-[96px_1fr] gap-4"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-container">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.nameEn}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : null}
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <Link
                      href={`/${locale}/product/${item.slug}`}
                      className="font-bold text-on-surface hover:text-primary"
                    >
                      {locale === "ar" ? item.nameAr : item.nameEn}
                    </Link>
                    <p className="text-sm text-on-surface-variant">
                      {item.size} / {locale === "ar" ? item.colorAr : item.colorEn}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Decrease quantity for ${item.nameEn}`}
                        className="h-11 w-11 rounded-full border-2 border-outline-variant"
                        onClick={() => updateItem(item.variantId, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity for ${item.nameEn}`}
                        className="h-11 w-11 rounded-full border-2 border-outline-variant"
                        disabled={item.quantity >= item.stock}
                        onClick={() => updateItem(item.variantId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{money(item.lineTotal)}</p>
                      <button
                        type="button"
                        className="text-sm text-error hover:underline"
                        onClick={() => removeItem(item.variantId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="bg-white rounded-2xl sticker-border p-6 h-fit order-first lg:order-last">
            <h2 className="font-headline-md text-headline-md mb-5">Summary</h2>
            <form
              className="flex gap-2 mb-5"
              onSubmit={(event) => {
                event.preventDefault();
                loadCart(couponCode);
              }}
            >
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="Coupon code"
                className="min-w-0 flex-1 rounded-lg border-2 border-outline-variant px-3 py-2"
              />
              <button className="rounded-full bg-primary-container px-4 font-bold sticker-border">
                Apply
              </button>
            </form>
            {quote?.couponError && (
              <p className="text-sm text-error mb-4">{quote.couponError}</p>
            )}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{money(quote?.subtotal ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-{money(quote?.discount ?? 0)}</span>
              </div>
              <div className="flex justify-between border-t border-outline-variant pt-3 text-lg font-black">
                <span>Total</span>
                <span>{money(quote?.total ?? 0)}</span>
              </div>
            </div>
            <Link
              href={`/${locale}/checkout${couponCode ? `?coupon=${encodeURIComponent(couponCode)}` : ""}`}
              className="mt-6 block text-center bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-label-lg text-label-lg sticker-border"
            >
              Checkout
            </Link>
            <button
              type="button"
              onClick={clearCart}
              disabled={isPending}
              className="mt-3 w-full text-sm text-on-surface-variant hover:text-error"
            >
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </StorefrontContainer>
  );
}
