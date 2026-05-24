"use client";

import { clearLocalCart, readLocalCart } from "@/lib/client-cart";
import type { CartQuote } from "@/lib/cart";
import { money } from "@/lib/money";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type Props = {
  locale: string;
};

const emptyCustomer = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
};

export default function CheckoutClient({ locale }: Props) {
  const { status, data } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [couponCode, setCouponCode] = useState(searchParams.get("coupon") ?? "");
  const [customer, setCustomer] = useState(emptyCustomer);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const isLoggedIn = status === "authenticated";

  function cartItems() {
    return (
      quote?.items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })) ?? readLocalCart()
    );
  }

  function loadQuote(code = couponCode) {
    startTransition(async () => {
      if (isLoggedIn) {
        const cart = await fetch("/api/cart", { cache: "no-store" });
        const cartQuote = (await cart.json()) as CartQuote;
        const response = await fetch("/api/cart/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartQuote.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
            })),
            couponCode: code,
          }),
        });
        setQuote((await response.json()) as CartQuote);
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
    loadQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function submitOrder(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems(),
          couponCode,
          customer,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        orderId?: string;
      };

      if (!response.ok || !payload.orderId) {
        setError(payload.error ?? "Checkout failed. Please try again.");
        return;
      }

      if (!isLoggedIn) clearLocalCart();
      router.push(`/${locale}/order-success?order=${payload.orderId}`);
    });
  }

  const items = quote?.items ?? [];

  return (
    <div className="max-w-container-max mx-auto px-margin-desktop py-12">
      <form
        onSubmit={submitOrder}
        className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-gutter"
      >
        <section className="bg-white rounded-2xl sticker-border p-6">
          <h2 className="font-headline-md text-headline-md mb-6">
            Customer information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["name", "Full name"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["city", "City"],
            ].map(([key, label]) => (
              <label key={key}>
                <span className="block text-sm font-semibold text-on-surface-variant mb-2">
                  {label}
                </span>
                <input
                  required
                  type={key === "email" ? "email" : "text"}
                  placeholder={
                    key === "email" ? data?.user?.email ?? "" : undefined
                  }
                  value={customer[key as keyof typeof customer]}
                  onChange={(event) =>
                    setCustomer((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none"
                />
              </label>
            ))}
            <label className="md:col-span-2">
              <span className="block text-sm font-semibold text-on-surface-variant mb-2">
                Delivery address
              </span>
              <textarea
                required
                value={customer.address}
                onChange={(event) =>
                  setCustomer((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
                className="min-h-28 w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none"
              />
            </label>
          </div>

          <div className="mt-8 rounded-2xl bg-surface-container p-5">
            <h3 className="font-bold mb-2">Payment method</h3>
            <p className="text-sm text-on-surface-variant">
              Cash on Delivery. You will pay when your order arrives.
            </p>
          </div>
        </section>

        <aside className="bg-white rounded-2xl sticker-border p-6 h-fit">
          <h2 className="font-headline-md text-headline-md mb-5">Order</h2>
          <div className="space-y-3 mb-5">
            {items.map((item) => (
              <div key={item.variantId} className="flex justify-between gap-3 text-sm">
                <span>
                  {locale === "ar" ? item.nameAr : item.nameEn} x {item.quantity}
                </span>
                <span className="font-semibold">{money(item.lineTotal)}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mb-5">
            <input
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
              placeholder="Coupon code"
              className="min-w-0 flex-1 rounded-lg border-2 border-outline-variant px-3 py-2"
            />
            <button
              type="button"
              onClick={() => loadQuote(couponCode)}
              className="rounded-full bg-primary-container px-4 font-bold sticker-border"
            >
              Apply
            </button>
          </div>
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
          {error && <p className="mt-4 text-sm text-error">{error}</p>}
          <button
            disabled={isPending || items.length === 0}
            className="mt-6 w-full bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-label-lg text-label-lg sticker-border disabled:opacity-50"
          >
            Place order
          </button>
        </aside>
      </form>
    </div>
  );
}
