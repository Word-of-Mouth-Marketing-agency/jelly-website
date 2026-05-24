import { auth } from "@/auth";
import CatalogProductCard from "@/components/catalog/CatalogProductCard";
import { getWishlistProducts } from "@/lib/products";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/wishlist`);
  }

  const products = await getWishlistProducts(session.user.id);

  return (
    <div className="min-h-screen">
      <div className="bg-surface-container-high border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-desktop py-12">
          <nav
            className="text-sm text-on-surface-variant mb-4 flex items-center gap-1.5"
            aria-label="breadcrumb"
          >
            <Link
              href={`/${locale}`}
              className="hover:text-primary transition-colors"
            >
              Home
            </Link>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
            <span className="text-on-surface font-medium">Wishlist</span>
          </nav>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2">
            My Wishlist
          </h1>
          <p className="text-on-surface-variant font-body-md text-body-md">
            {products.length} saved{" "}
            {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-desktop py-12">
        {products.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-8xl text-outline-variant block mb-6">
              favorite
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">
              Nothing saved yet
            </h2>
            <p className="text-on-surface-variant font-body-md text-body-md mb-8">
              Tap the heart on any product to keep it here for later.
            </p>
            <Link
              href={`/${locale}/search`}
              className="inline-block bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-label-lg text-label-lg sticker-border hover:scale-105 transition-all"
            >
              Browse socks
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
            {products.map((product) => (
              <CatalogProductCard
                key={product.id}
                product={product}
                locale={locale}
                isWishlisted
                hasSession
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
