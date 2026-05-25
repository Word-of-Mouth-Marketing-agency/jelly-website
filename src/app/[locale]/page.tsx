import HeroSection from "@/components/home/HeroSection";
import MarqueeBanner from "@/components/home/MarqueeBanner";
import CategoryRow from "@/components/home/CategoryRow";
import NewArrivals from "@/components/home/NewArrivals";
import MensCollection from "@/components/home/MensCollection";
import BestSellers from "@/components/home/BestSellers";
import CrossingMarquees from "@/components/home/CrossingMarquees";
import StyledInJelly from "@/components/home/StyledInJelly";
import Newsletter from "@/components/home/Newsletter";
import { auth } from "@/auth";
import {
  getFeaturedProducts,
  getNewestProducts,
  getProductsByCategory,
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

  const [newArrivals, mensProducts, bestSellers, wishlistIds] =
    await Promise.all([
      getNewestProducts(4),
      getProductsByCategory("men").then((p) => p.slice(0, 4)),
      getFeaturedProducts(2),
      userId
        ? getWishlistProductIds(userId)
        : Promise.resolve(new Set<string>()),
    ]);

  return (
    <>
      <HeroSection locale={locale} />
      <MarqueeBanner />
      <CategoryRow locale={locale} />
      <NewArrivals
        products={newArrivals}
        locale={locale}
        wishlistIds={wishlistIds}
        hasSession={!!session}
      />
      <MensCollection
        products={mensProducts}
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
      <StyledInJelly />
      <Newsletter />
    </>
  );
}
