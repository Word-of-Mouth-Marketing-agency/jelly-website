import CartClient from "@/components/cart/CartClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart - Jelly",
};

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen">
      <div className="bg-surface-container-high border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-desktop py-12">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2">
            Cart
          </h1>
          <p className="text-on-surface-variant">
            Review your socks, coupon, subtotal, and total.
          </p>
        </div>
      </div>
      <CartClient locale={locale} />
    </div>
  );
}
