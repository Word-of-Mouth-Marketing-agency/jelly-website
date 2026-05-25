import Link from "next/link";
import type { ProductSummary } from "@/lib/products";
import HomeProductCard from "./HomeProductCard";

interface Props {
  products: ProductSummary[];
  locale: string;
  wishlistIds: Set<string>;
  hasSession: boolean;
}

export default function MensCollection({
  products,
  locale,
  wishlistIds,
  hasSession,
}: Props) {
  return (
    <section className="max-w-container-max mx-auto px-margin-desktop mb-section-gap">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-gutter">
        {/* Heading column */}
        <div className="md:pt-12">
          <h2 className="font-headline-lg text-headline-lg mb-6">
            {locale === "ar" ? "مجموعة الرجال" : "Men's Collection"}
          </h2>
          <Link
            href={`/${locale}/category/men`}
            className="inline-block bg-primary-container text-black px-6 py-3 rounded-full font-label-lg text-label-lg sticker-border hover:scale-105 transition-all"
          >
            {locale === "ar" ? "تسوق رجالي" : "Shop Men's"}
          </Link>
        </div>

        {/* 4 product cards spanning the remaining 4 columns */}
        <div className="md:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-gutter">
          {products.map((product) => (
            <HomeProductCard
              key={product.id}
              product={product}
              locale={locale}
              isWishlisted={wishlistIds.has(product.id)}
              hasSession={hasSession}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
