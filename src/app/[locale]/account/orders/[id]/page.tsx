import { auth } from "@/auth";
import {
  getUserOrderById,
  orderNumber,
  parseShippingAddress,
} from "@/lib/account";
import { money } from "@/lib/money";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/account/orders/${id}`);
  }

  const order = await getUserOrderById(session.user.id, id);
  if (!order) notFound();

  const customer = parseShippingAddress(order.shippingAddress);
  const number = orderNumber(order.id);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Hi Jelly, I would like to follow up on order ${number}.`
      )}`
    : null;

  return (
    <div className="min-h-screen">
      <div className="bg-surface-container-high border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-desktop py-12">
          <Link
            href={`/${locale}/account/orders`}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Back to orders
          </Link>
          <h1 className="font-display-lg text-display-lg text-on-surface mt-4 mb-2">
            {number}
          </h1>
          <p className="text-on-surface-variant">Status: {order.status}</p>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-desktop py-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-gutter">
        <section className="space-y-4">
          {order.items.map((item) => {
            const image = item.product.images[0]?.url;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl sticker-border p-4 grid grid-cols-[96px_1fr] gap-4"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-container">
                  {image && (
                    <Image
                      src={image}
                      alt={item.product.nameEn}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-between gap-3">
                  <div>
                    <p className="font-bold">{item.product.nameEn}</p>
                    <p className="text-sm text-on-surface-variant">
                      {item.variant.size.label} / {item.variant.color.nameEn}
                    </p>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Qty {item.quantity}</span>
                    <span className="font-bold">
                      {money(Number(item.unitPrice) * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <aside className="space-y-4">
          <div className="bg-white rounded-2xl sticker-border p-6">
            <h2 className="font-headline-md text-headline-md mb-4">
              Customer
            </h2>
            <div className="space-y-2 text-sm text-on-surface-variant">
              <p className="font-bold text-on-surface">{customer.name}</p>
              <p>{customer.email}</p>
              <p>{customer.phone}</p>
              <p>{customer.address}</p>
              <p>{customer.city}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl sticker-border p-6">
            <h2 className="font-headline-md text-headline-md mb-4">Totals</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{money(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-{money(Number(order.discount))}</span>
              </div>
              <div className="flex justify-between border-t border-outline-variant pt-3 text-lg font-black">
                <span>Total</span>
                <span>{money(Number(order.total))}</span>
              </div>
            </div>
          </div>

          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="block text-center bg-primary-container text-on-primary-container px-6 py-3 rounded-full font-label-lg text-label-lg sticker-border"
            >
              Follow up on WhatsApp
            </a>
          )}
        </aside>
      </div>
    </div>
  );
}
