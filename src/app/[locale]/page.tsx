import HeroSection from "@/components/home/HeroSection";
import MarqueeBanner from "@/components/home/MarqueeBanner";
import CategoryRow from "@/components/home/CategoryRow";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewArrivals from "@/components/home/NewArrivals";
import BestSellers from "@/components/home/BestSellers";
import CrossingMarquees from "@/components/home/CrossingMarquees";
import FeatureBanner from "@/components/home/FeatureBanner";
import StyledInJelly from "@/components/home/StyledInJelly";
import Newsletter from "@/components/home/Newsletter";
import { auth } from "@/auth";
import {
  getFeaturedProducts,
  getNewestProducts,
  getWishlistProductIds,
} from "@/lib/products";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata({
    title: "Jelly | Socks that make you smile",
    description:
      "Premium, playful, colorful Egyptian socks for men, women, and kids. Shop the latest collections at Jelly.",
    path: "",
    locale,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  const [featuredProducts, newestProducts, wishlistIds] =
    await Promise.all([
      getFeaturedProducts(6),
      getNewestProducts(6),
      userId
        ? getWishlistProductIds(userId)
        : Promise.resolve(new Set<string>()),
    ]);

  const featuredRow = featuredProducts.slice(0, 4);

  // Best Sellers: up to 2 from remaining featured, fill with newest if needed
  let bestSellers = featuredProducts.slice(4, 6);
  if (bestSellers.length < 2) {
    const usedIds = new Set(featuredProducts.map((p) => p.id));
    const fill = newestProducts
      .filter((p) => !usedIds.has(p.id))
      .slice(0, 2 - bestSellers.length);
    bestSellers = [...bestSellers, ...fill];
  }

  // New Arrivals: 4 products, avoid duplicating any pulled into Best Sellers
  const bestSellerIds = new Set(bestSellers.map((p) => p.id));
  const newArrivals = newestProducts.filter(
    (p) => !bestSellerIds.has(p.id)
  ).slice(0, 4);

  return (
    <>
      <HeroSection locale={locale} />
      <MarqueeBanner />
      <CategoryRow locale={locale} />
      <FeaturedProducts
        products={featuredRow}
        locale={locale}
        wishlistIds={wishlistIds}
        hasSession={!!session}
      />
      <NewArrivals
        products={newArrivals}
        locale={locale}
        wishlistIds={wishlistIds}
        hasSession={!!session}
      />
      <BestSellers
        products={bestSellers}
        locale={locale}
        wishlistIds={wishlistIds}
        hasSession={!!session}
      />
      <CrossingMarquees />
      <FeatureBanner locale={locale} />
      <StyledInJelly />
      <Newsletter />
    </>
  );
}
