"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ProductSummary } from "@/lib/products";
import WishlistToggle from "@/components/catalog/WishlistToggle";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { Shirt } from "lucide-react";

interface Props {
  product: ProductSummary;
  locale: string;
  isWishlisted?: boolean;
  hasSession?: boolean;
  showWishlist?: boolean;
}

export default function HomeProductCard({
  product,
  locale,
  isWishlisted = false,
  hasSession = false,
  showWishlist = false,
}: Props) {
  const isRtl = locale === "ar";
  const name = isRtl ? product.nameAr : product.nameEn;
  const price =
    product.minPrice === product.maxPrice
      ? product.minPrice
      : `${product.minPrice}+`;
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-4 sticker-border group">
      <div className="relative aspect-square mb-4 bg-gray-50 rounded-xl overflow-hidden">
        {showWishlist && (
          <WishlistToggle
            productId={product.id}
            initialActive={isWishlisted}
            hasSession={hasSession}
            locale={locale}
            className="absolute top-2 right-2 z-10 h-9 w-9"
          />
        )}
        <Link
          href={`/${locale}/product/${product.slug}`}
          className="block w-full h-full relative"
        >
          {product.primaryImage && !imgError ? (
            <Image
              src={product.primaryImage}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              alt={product.altEn ?? name}
              sizes="(max-width: 768px) 50vw, 20vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Shirt
                size={56}
                strokeWidth={1.75}
                className="text-outline-variant"
                aria-hidden="true"
              />
            </div>
          )}
        </Link>
      </div>
      <Link href={`/${locale}/product/${product.slug}`}>
        <h4 className="font-body-lg text-body-lg mb-1 truncate hover:text-primary transition-colors">{name}</h4>
      </Link>
      <div className="inline-block px-3 py-1 bg-brand-cyan rounded-full font-bold text-label-sm mb-4">
        {price}
      </div>
      <AddToCartButton
        variantId={product.defaultVariantId}
        locale={locale}
        disabled={!product.inStock}
        className="w-full py-2"
      />
    </div>
  );
}
