import CheckoutClient from "@/components/cart/CheckoutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - Jelly",
};

export default async function CheckoutPage({
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
            Checkout
          </h1>
          <p className="text-on-surface-variant">
            Cash on Delivery only. Guest checkout is welcome.
          </p>
        </div>
      </div>
      <CheckoutClient locale={locale} />
    </div>
  );
}
