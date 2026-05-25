import Image from "next/image";
import Link from "next/link";
import type { ProductSummary } from "@/lib/products";
import WishlistToggle from "./WishlistToggle";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { Shirt, Star } from "lucide-react";

interface Props {
  product: ProductSummary;
  locale: string;
  isWishlisted?: boolean;
  hasSession?: boolean;
}

export default function CatalogProductCard({
  product,
  locale,
  isWishlisted = false,
  hasSession = false,
}: Props) {
  const isRtl = locale === "ar";
  const name = isRtl ? product.nameAr : product.nameEn;
  const price =
    product.minPrice === product.maxPrice
      ? product.minPrice
      : `${product.minPrice}+`;

  return (
    <div className="group relative bg-white rounded-2xl p-4 sticker-border hover:shadow-md transition-all duration-200">
      <WishlistToggle
        productId={product.id}
        initialActive={isWishlisted}
        hasSession={hasSession}
        locale={locale}
        className="absolute right-6 top-6 z-20 h-10 w-10"
      />

      <Link href={`/${locale}/product/${product.slug}`} className="block">
        <div className="relative aspect-square mb-4 bg-surface-container rounded-xl overflow-hidden">
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
              <span className="text-xs font-bold text-on-surface-variant bg-white px-3 py-1 rounded-full border border-outline-variant">
                Out of stock
              </span>
            </div>
          )}
          {product.primaryImage ? (
            <Image
              src={product.primaryImage}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              alt={product.altEn ?? name}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Shirt size={56} strokeWidth={1.75} className="text-outline-variant" aria-hidden="true" />
            </div>
          )}
        </div>
      </Link>

      {product.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag.nameEn}
              className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full"
            >
              {isRtl ? tag.nameAr : tag.nameEn}
            </span>
          ))}
        </div>
      )}

      <Link href={`/${locale}/product/${product.slug}`}>
        <h3 className="font-label-lg text-label-lg text-on-surface mb-2 truncate hover:text-primary transition-colors">
          {name}
        </h3>
      </Link>

      <div className="flex items-center justify-between">
        <span className="inline-block px-3 py-1 bg-brand-cyan rounded-full font-bold text-label-sm">
          {price}
        </span>
        {product.isFeatured && (
          <Star
            size={18}
            strokeWidth={2.25}
            className="text-primary"
            aria-hidden="true"
          />
        )}
      </div>
      <AddToCartButton
        variantId={product.defaultVariantId}
        locale={locale}
        disabled={!product.inStock}
        className="mt-4 w-full py-2"
      />
    </div>
  );
}
