import { auth } from "@/auth";
import { getOrderForSuccess } from "@/lib/cart";
import { money } from "@/lib/money";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Success - Jelly",
};

export default async function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { locale } = await params;
  const { order: orderId } = await searchParams;
  const session = await auth();
  const order = orderId ? await getOrderForSuccess(orderId) : null;
  const orderNumber = order ? `JELLY-${order.id.slice(-6).toUpperCase()}` : "";
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappText = encodeURIComponent(
    `Hi Jelly, I placed order ${orderNumber} and would like to follow up.`
  );
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappText}`
    : null;

  return (
    <div className="min-h-screen bg-surface-container-high">
      <div className="max-w-2xl mx-auto px-margin-mobile py-20 text-center">
        <div className="bg-white rounded-2xl sticker-border p-8">
          <span className="material-symbols-outlined text-7xl text-tertiary mb-4 block">
            check_circle
          </span>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-3">
            Order placed
          </h1>
          {order ? (
            <>
              <p className="text-on-surface-variant mb-2">
                Order number
              </p>
              <p className="font-headline-md text-headline-md mb-4">
                {orderNumber}
              </p>
              <p className="text-on-surface-variant mb-8">
                Total: <span className="font-bold">{money(Number(order.total))}</span>
              </p>
            </>
          ) : (
            <p className="text-on-surface-variant mb-8">
              We could not find the order details, but your checkout flow has
              completed.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="bg-primary-container text-on-primary-container px-6 py-3 rounded-full font-label-lg text-label-lg sticker-border"
              >
                Follow up on WhatsApp
              </a>
            )}
            <Link
              href={`/${locale}/search`}
              className="px-6 py-3 rounded-full font-label-lg text-label-lg border-2 border-outline-variant bg-white"
            >
              Continue shopping
            </Link>
            {session && (
              <Link
                href={`/${locale}/account/orders`}
                className="px-6 py-3 rounded-full font-label-lg text-label-lg border-2 border-outline-variant bg-white"
              >
                View orders
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
