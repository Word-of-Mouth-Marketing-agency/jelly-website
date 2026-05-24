import { auth } from "@/auth";
import { getUserOrders, orderNumber } from "@/lib/account";
import { money } from "@/lib/money";
import { ReceiptText } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata({
    title: "My Orders",
    description: "View your Jelly order history and track your deliveries.",
    path: "/account/orders",
    locale,
  });
}

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/account/orders`);
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="min-h-screen">
      <div className="bg-surface-container-high border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-desktop py-12">
          <Link
            href={`/${locale}/account`}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Back to account
          </Link>
          <h1 className="font-display-lg text-display-lg text-on-surface mt-4 mb-2">
            Orders
          </h1>
          <p className="text-on-surface-variant">
            Your Jelly order history.
          </p>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-desktop py-12">
        {orders.length === 0 ? (
          <div className="text-center py-24">
            <ReceiptText size={72} strokeWidth={1.75} className="mx-auto mb-6 text-outline-variant" aria-hidden="true" />
            <h2 className="font-headline-md text-headline-md mb-3">
              No orders yet
            </h2>
            <Link
              href={`/${locale}/search`}
              className="inline-block bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-label-lg text-label-lg sticker-border"
            >
              Shop socks
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/${locale}/account/orders/${order.id}`}
                className="bg-white rounded-2xl sticker-border p-5 grid grid-cols-1 md:grid-cols-4 gap-3 hover:shadow-md transition"
              >
                <div>
                  <p className="text-sm text-on-surface-variant">Order</p>
                  <p className="font-bold">{orderNumber(order.id)}</p>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">Status</p>
                  <p className="font-bold">{order.status}</p>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">Items</p>
                  <p className="font-bold">{order.items.length}</p>
                </div>
                <div className="md:text-right">
                  <p className="text-sm text-on-surface-variant">Total</p>
                  <p className="font-bold">{money(Number(order.total))}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
