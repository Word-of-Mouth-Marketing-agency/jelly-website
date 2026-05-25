import Image from "next/image";
import Link from "next/link";
import type { ProductSummary } from "@/lib/products";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { Shirt } from "lucide-react";
import StorefrontContainer from "@/components/layout/StorefrontContainer";

interface Props {
  products: ProductSummary[];
  locale: string;
  wishlistIds: Set<string>;
  hasSession: boolean;
}

export default function BestSellers({
  products,
  locale,
}: Props) {
  return (
    <StorefrontContainer className="mb-section-gap">
      <h2 className="font-headline-lg text-headline-lg mb-8">
        {locale === "ar" ? "الأكثر مبيعاً" : "Best Sellers"}
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        {products.map((product) => {
          const name = locale === "ar" ? product.nameAr : product.nameEn;
          const price =
            product.minPrice === product.maxPrice
              ? product.minPrice
              : `${product.minPrice}+`;
          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl sticker-border group cursor-pointer relative overflow-hidden flex flex-col md:flex-row items-stretch md:w-1/2"
            >
              <Link
                href={`/${locale}/product/${product.slug}`}
                className="w-full md:w-[40%] relative min-h-[200px] overflow-hidden block"
              >
                {product.primaryImage ? (
                  <Image
                    src={product.primaryImage}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={product.altEn ?? name}
                    sizes="(max-width: 768px) 100vw, 20vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <Shirt
                      size={56}
                      strokeWidth={1.75}
                      className="text-outline-variant"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </Link>
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-center items-start z-10">
                <Link href={`/${locale}/product/${product.slug}`}>
                  <h3 className="font-headline-md text-headline-md mb-2 font-bold hover:text-primary transition-colors">
                    {name}
                  </h3>
                </Link>
                <p className="font-headline-md text-headline-md text-on-surface-variant mb-6 font-bold">
                  {price}
                </p>
                <AddToCartButton
                  variantId={product.defaultVariantId}
                  locale={locale}
                  disabled={!product.inStock}
                  className="px-10 py-3"
                />
              </div>
            </div>
          );
        })}
      </div>
    </StorefrontContainer>
  );
}
