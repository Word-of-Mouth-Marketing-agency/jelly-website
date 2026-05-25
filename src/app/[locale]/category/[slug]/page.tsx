import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import StorefrontContainer from "@/components/layout/StorefrontContainer";
import { createMetadata } from "@/lib/metadata";
import {
  getCategories,
  getCategoryBySlug,
  getProductsByCategory,
  getWishlistProductIds,
} from "@/lib/products";
import CatalogProductCard from "@/components/catalog/CatalogProductCard";
import { auth } from "@/auth";
import { ChevronRight, PackageOpen } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  const name = locale === "ar" ? category.nameAr : category.nameEn;

  return createMetadata({
    title: `${name} Socks`,
    description: `Browse Jelly's ${name} socks collection. Premium Egyptian socks for every occasion.`,
    path: `/category/${slug}`,
    locale,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const session = await auth();
  const [category, products, categories, wishlistIds] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategory(slug),
    getCategories(),
    getWishlistProductIds(session?.user?.id),
  ]);

  if (!category) notFound();

  const isRtl = locale === "ar";
  const categoryName = isRtl ? category.nameAr : category.nameEn;
  const count = category.productCount;

  return (
    <div className="min-h-screen">
      <div className="bg-surface-container-high border-b border-outline-variant">
        <StorefrontContainer className="py-12" as="div">
          <nav
            className="text-sm text-on-surface-variant mb-4 flex items-center gap-1.5 flex-wrap"
            aria-label="breadcrumb"
          >
            <Link
              href={`/${locale}`}
              className="hover:text-primary transition-colors"
            >
              Home
            </Link>
            <ChevronRight size={16} strokeWidth={2.25} aria-hidden="true" />
            <span className="text-on-surface font-medium">{categoryName}</span>
          </nav>

          <h1 className="font-display-lg text-display-lg text-on-surface mb-2">
            {categoryName}
          </h1>
          <p className="text-on-surface-variant font-body-md text-body-md">
            {count} {count === 1 ? "product" : "products"}
          </p>
        </StorefrontContainer>
      </div>

      <StorefrontContainer className="py-12">
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((item) => {
            const active = item.slug === category.slug;
            const label = isRtl ? item.nameAr : item.nameEn;

            return (
              <Link
                key={item.id}
                href={`/${locale}/category/${item.slug}`}
                className={`rounded-full border-2 px-5 py-2 font-label-lg text-label-lg transition-all ${
                  active
                    ? "border-primary bg-primary-container text-on-primary-container"
                    : "border-outline-variant bg-white text-on-surface-variant hover:border-primary"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24">
            <PackageOpen
              size={72}
              strokeWidth={1.75}
              className="mx-auto mb-6 text-outline-variant"
              aria-hidden="true"
            />
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">
              No products yet
            </h2>
            <p className="text-on-surface-variant font-body-md text-body-md mb-8">
              Check back soon. New styles are on the way.
            </p>
            <Link
              href={`/${locale}`}
              className="inline-block bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-label-lg text-label-lg sticker-border hover:scale-105 transition-all"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
            {products.map((product) => (
              <CatalogProductCard
                key={product.id}
                product={product}
                locale={locale}
                isWishlisted={wishlistIds.has(product.id)}
                hasSession={Boolean(session)}
              />
            ))}
          </div>
        )}
      </StorefrontContainer>
    </div>
  );
}
