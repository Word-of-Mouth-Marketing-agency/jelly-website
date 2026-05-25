import CheckoutClient from "@/components/cart/CheckoutClient";
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
    title: "Checkout",
    description: "Cash on Delivery checkout. Complete your Jelly socks order.",
    path: "/checkout",
    locale,
  });
}

export default async function CheckoutPage({
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
              Checkout
            </h1>
            <p className="text-on-surface-variant">
              Cash on Delivery only. Guest checkout is welcome.
            </p>
          </Reveal>
        </StorefrontContainer>
      </div>
      <CheckoutClient locale={locale} />
    </div>
  );
}
