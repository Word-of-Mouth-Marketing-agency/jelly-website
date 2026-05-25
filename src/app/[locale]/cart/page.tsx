import CartClient from "@/components/cart/CartClient";
import type { Metadata } from "next";
import StorefrontContainer from "@/components/layout/StorefrontContainer";
import { createMetadata } from "@/lib/metadata";
import Reveal from "@/components/animations/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata({
    title: "Cart",
    description: "Review your Jelly socks selection, apply coupons, and proceed to checkout.",
    path: "/cart",
    locale,
  });
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen">
      <div className="bg-surface-container-high border-b border-outline-variant">
        <StorefrontContainer className="py-12" as="div">
          <Reveal>
            <h1 className="font-display-lg text-display-lg text-on-surface mb-2">
              Cart
            </h1>
            <p className="text-on-surface-variant">
              Review your socks, coupon, subtotal, and total.
            </p>
          </Reveal>
        </StorefrontContainer>
      </div>
      <CartClient locale={locale} />
    </div>
  );
}
