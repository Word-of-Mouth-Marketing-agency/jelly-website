import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getProductBySlug,
  getRelatedProducts,
  getWishlistProductIds,
} from "@/lib/products";
import ImageGallery from "@/components/catalog/ImageGallery";
import VariantSelector from "@/components/catalog/VariantSelector";
import CatalogProductCard from "@/components/catalog/CatalogProductCard";
import WishlistToggle from "@/components/catalog/WishlistToggle";
import { auth } from "@/auth";
import { ArrowLeft, ChevronRight, Star } from "lucide-react";
import StorefrontContainer from "@/components/layout/StorefrontContainer";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const isRtl = locale === "ar";
  const name = isRtl ? product.nameAr : product.nameEn;
  const description = isRtl ? product.descriptionAr : product.descriptionEn;
  const image = product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url;

  return createMetadata({
    title: name,
    description: description ?? `${name} by Jelly. Premium Egyptian socks.`,
    path: `/product/${slug}`,
    image: image ? `${image}` : undefined,
    locale,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const session = await auth();
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [related, wishlistIds] = await Promise.all([
    getRelatedProducts(product.id, product.category.id, 4),
    getWishlistProductIds(session?.user?.id),
  ]);

  const isRtl = locale === "ar";
  const name = isRtl ? product.nameAr : product.nameEn;
  const description = isRtl ? product.descriptionAr : product.descriptionEn;
  const categoryName = isRtl
    ? product.category.nameAr
    : product.category.nameEn;

  const priceDisplay =
    product.minPrice === product.maxPrice
      ? product.minPrice
      : `${product.minPrice} - ${product.maxPrice}`;

  return (
    <div className="min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      <StorefrontContainer className="pt-8 pb-4" as="div">
        <nav
          className="text-sm text-on-surface-variant flex items-center gap-1.5 flex-wrap"
          aria-label="breadcrumb"
        >
          <Link
            href={`/${locale}`}
            className="hover:text-primary transition-colors"
          >
            Home
          </Link>
          <ChevronRight size={16} strokeWidth={2.25} aria-hidden="true" />
          <Link
            href={`/${locale}/category/${product.category.slug}`}
            className="hover:text-primary transition-colors"
          >
            {categoryName}
          </Link>
          <ChevronRight size={16} strokeWidth={2.25} aria-hidden="true" />
          <span className="text-on-surface font-medium truncate max-w-[220px]">
            {name}
          </span>
        </nav>
      </StorefrontContainer>

      <StorefrontContainer className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <ImageGallery
            images={product.images}
            productName={name}
            locale={locale}
          />

          <div className="flex flex-col">
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map((tag) => (
                  <span
                    key={tag.nameEn}
                    className="text-xs font-bold uppercase tracking-wider text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full"
                  >
                    {isRtl ? tag.nameAr : tag.nameEn}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-3">
              {name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="inline-block px-5 py-2.5 bg-brand-cyan rounded-full font-bold text-headline-md">
                {priceDisplay}
              </span>
              <WishlistToggle
                productId={product.id}
                initialActive={wishlistIds.has(product.id)}
                hasSession={Boolean(session)}
                locale={locale}
                className="h-11 w-11"
              />
              {product.isFeatured && (
                <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                  <Star size={18} strokeWidth={2.25} aria-hidden="true" />
                  Featured
                </span>
              )}
            </div>

            <VariantSelector variants={product.variants} locale={locale} />

            {description && (
              <div className="mt-8 pt-8 border-t border-outline-variant">
                <h2 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider mb-3">
                  Description
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {description}
                </p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-outline-variant">
              <Link
                href={`/${locale}/category/${product.category.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <ArrowLeft size={18} strokeWidth={2.25} aria-hidden="true" />
                More {categoryName} socks
              </Link>
            </div>
          </div>
        </div>
      </StorefrontContainer>

      {related.length > 0 && (
        <div className="bg-surface-container-low mt-16 py-16">
          <StorefrontContainer as="div">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8">
              You might also like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
              {related.map((relatedProduct) => (
                <CatalogProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  locale={locale}
                  isWishlisted={wishlistIds.has(relatedProduct.id)}
                  hasSession={Boolean(session)}
                />
              ))}
            </div>
          </StorefrontContainer>
        </div>
      )}
    </div>
  );
}
