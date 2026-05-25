import { auth } from "@/auth";
import CatalogProductCard from "@/components/catalog/CatalogProductCard";
import { getWishlistProducts } from "@/lib/products";
import { ChevronRight, Heart } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import StorefrontContainer from "@/components/layout/StorefrontContainer";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata({
    title: "Wishlist",
    description: "Your saved Jelly socks. Save your favorites and shop later.",
    path: "/wishlist",
    locale,
  });
}

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
        <StorefrontContainer className="py-12" as="div">
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
            <ChevronRight size={16} strokeWidth={2.25} aria-hidden="true" />
            <span className="text-on-surface font-medium">Wishlist</span>
          </nav>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2">
            My Wishlist
          </h1>
          <p className="text-on-surface-variant font-body-md text-body-md">
            {products.length} saved{" "}
            {products.length === 1 ? "product" : "products"}
          </p>
        </StorefrontContainer>
      </div>

      <StorefrontContainer className="py-12">
        {products.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={72} strokeWidth={1.75} className="mx-auto mb-6 text-outline-variant" aria-hidden="true" />
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
      </StorefrontContainer>
    </div>
  );
}
