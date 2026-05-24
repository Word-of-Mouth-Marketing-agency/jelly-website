import HeroSection from "@/components/home/HeroSection";
import MarqueeBanner from "@/components/home/MarqueeBanner";
import CategoryRow from "@/components/home/CategoryRow";
import NewArrivals from "@/components/home/NewArrivals";
import MensCollection from "@/components/home/MensCollection";
import BestSellers from "@/components/home/BestSellers";
import CrossingMarquees from "@/components/home/CrossingMarquees";
import StyledInJelly from "@/components/home/StyledInJelly";
import Newsletter from "@/components/home/Newsletter";
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

  return (
    <>
      <HeroSection />
      <MarqueeBanner />
      <CategoryRow locale={locale} />
      <NewArrivals />
      <MensCollection />
      <BestSellers />
      <CrossingMarquees />
      <StyledInJelly />
      <Newsletter />
    </>
  );
}
