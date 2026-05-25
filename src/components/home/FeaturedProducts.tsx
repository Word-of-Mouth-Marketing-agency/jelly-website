import Link from "next/link";
import type { ProductSummary } from "@/lib/products";
import HomeProductCard from "./HomeProductCard";
import StorefrontContainer from "@/components/layout/StorefrontContainer";

interface Props {
  products: ProductSummary[];
  locale: string;
  wishlistIds: Set<string>;
  hasSession: boolean;
}

export default function FeaturedProducts({
  products,
  locale,
  wishlistIds,
  hasSession,
}: Props) {
  return (
    <StorefrontContainer className="mb-section-gap">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-gutter">
        <div className="md:pt-12">
          <h2 className="font-headline-lg text-headline-lg mb-6">
            {locale === "ar" ? "المنتجات المميزة" : "Featured Products"}
          </h2>
          <Link
            href={`/${locale}/search`}
            className="inline-block bg-primary-container text-black px-6 py-3 rounded-full font-label-lg text-label-lg sticker-border hover:scale-105 transition-all"
          >
            {locale === "ar" ? "تسوق الآن" : "Shop Now"}
          </Link>
        </div>

        {products.map((product) => (
          <HomeProductCard
            key={product.id}
            product={product}
            locale={locale}
            showWishlist
            isWishlisted={wishlistIds.has(product.id)}
            hasSession={hasSession}
          />
        ))}
      </div>
    </StorefrontContainer>
  );
}
