import HeroSection from "@/components/home/HeroSection";
import MarqueeBanner from "@/components/home/MarqueeBanner";
import CategoryRow from "@/components/home/CategoryRow";
import NewArrivals from "@/components/home/NewArrivals";
import MensCollection from "@/components/home/MensCollection";
import BestSellers from "@/components/home/BestSellers";
import CrossingMarquees from "@/components/home/CrossingMarquees";
import StyledInJelly from "@/components/home/StyledInJelly";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeBanner />
      <CategoryRow />
      <NewArrivals />
      <MensCollection />
      <BestSellers />
      <CrossingMarquees />
      <StyledInJelly />
      <Newsletter />
    </>
  );
}
