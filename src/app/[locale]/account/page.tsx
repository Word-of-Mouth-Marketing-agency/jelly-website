import { auth } from "@/auth";
import { getAccountOverview, orderNumber } from "@/lib/account";
import { money } from "@/lib/money";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/account`);
  }

  const { user, recentOrders, stats } = await getAccountOverview(
    session.user.id
  );
  const name =
    [user?.profile?.firstName, user?.profile?.lastName]
      .filter(Boolean)
      .join(" ") ||
    user?.email ||
    "there";

  return (
    <div className="min-h-screen">
      <div className="bg-surface-container-high border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-desktop py-12">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2">
            Welcome, {name}
          </h1>
          <p className="text-on-surface-variant">
            Manage your Jelly profile, wishlist, and sock orders.
          </p>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-desktop py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {[
            ["Orders", stats.orderCount.toString()],
            ["Wishlist", stats.wishlistCount.toString()],
            ["Total spent", money(stats.totalSpent)],
          ].map(([label, value]) => (
            <div key={label} className="bg-white rounded-2xl sticker-border p-6">
              <p className="text-sm font-bold uppercase text-on-surface-variant mb-2">
                {label}
              </p>
              <p className="font-headline-lg text-headline-lg">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <Link
            href={`/${locale}/account/profile`}
            className="bg-primary-container text-on-primary-container rounded-2xl sticker-border p-6 font-bold hover:scale-[1.01] transition"
          >
            Edit profile
          </Link>
          <Link
            href={`/${locale}/account/orders`}
            className="bg-white rounded-2xl sticker-border p-6 font-bold hover:scale-[1.01] transition"
          >
            View orders
          </Link>
          <Link
            href={`/${locale}/wishlist`}
            className="bg-white rounded-2xl sticker-border p-6 font-bold hover:scale-[1.01] transition"
          >
            Wishlist
          </Link>
        </div>

        <section className="bg-white rounded-2xl sticker-border p-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="font-headline-md text-headline-md">Recent orders</h2>
            <Link
              href={`/${locale}/account/orders`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              See all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-on-surface-variant">
              No orders yet. Your first Jelly order will appear here.
            </p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/${locale}/account/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-outline-variant p-4 hover:border-primary"
                >
                  <span className="font-bold">{orderNumber(order.id)}</span>
                  <span className="text-sm text-on-surface-variant">
                    {order.items.length} items
                  </span>
                  <span className="font-bold">{money(Number(order.total))}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
