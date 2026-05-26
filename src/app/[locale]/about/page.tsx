import type { Metadata } from "next";
import Link from "next/link";
import StorefrontContainer from "@/components/layout/StorefrontContainer";
import { createMetadata } from "@/lib/metadata";
import { Smile, Sparkles, Sun } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata({
    title: "About",
    description:
      locale === "ar"
        ? "جيلي - براند شرابات مصري معمول للراحة، الألوان، والثقة اليومية."
        : "Jelly is an Egyptian socks brand built around comfort, color, and everyday confidence.",
    path: "/about",
    locale,
  });
}

const values = [
  {
    icon: Smile,
    titleEn: "Comfort First",
    titleAr: "الراحة أولًا",
    descEn: "Soft pairs made for daily movement.",
    descAr: "شرابات ناعمة مناسبة للحركة اليومية.",
  },
  {
    icon: Sparkles,
    titleEn: "Playful Everyday Style",
    titleAr: "ستايل يومي مبهج",
    descEn: "Colorful socks that still feel easy to wear.",
    descAr: "ألوان لطيفة وسهلة اللبس.",
  },
  {
    icon: Sun,
    titleEn: "Made for Egypt's Rhythm",
    titleAr: "مناسبة لإيقاع مصر",
    descEn: "Designed for busy days, warm weather, and real routines.",
    descAr: "مصممة للأيام المزدحمة والجو الدافئ والروتين الحقيقي.",
  },
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRtl = locale === "ar";

  return (
    <>
      <section className="bg-surface-container-high border-b border-outline-variant">
        <StorefrontContainer className="py-16 md:py-24" as="div">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-4">
            {isRtl ? "عن جيلي" : "About Jelly"}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            {isRtl
              ? "شرابات بتخلي كل خطوة أبهج."
              : "Socks made to brighten everyday steps."}
          </p>
        </StorefrontContainer>
      </section>

      <StorefrontContainer className="py-16 md:py-20" as="div">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">
            {isRtl ? "قصتنا" : "Our Story"}
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            {isRtl
              ? "جيلي براند شرابات مصري معمول للراحة، الألوان، والثقة اليومية. من صباح المدرسة لأيام الشغل والتمرين والخروجات، شراباتنا معمولة عشان تكون مريحة وشكلها لطيف من غير تعقيد."
              : "Jelly is an Egyptian socks brand built around comfort, color, and everyday confidence. From school mornings to office days, workouts, and weekend plans, our socks are made to feel good and look fun without overcomplicating your day."}
          </p>
        </div>
      </StorefrontContainer>

      <section className="bg-surface-container-high border-y border-outline-variant">
        <StorefrontContainer className="py-16 md:py-20" as="div">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {values.map((v) => (
              <div
                key={v.titleEn}
                className="bg-white rounded-2xl sticker-border p-6 md:p-8 flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                  <v.icon size={24} strokeWidth={2.25} className="text-on-primary-container" aria-hidden="true" />
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  {isRtl ? v.titleAr : v.titleEn}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {isRtl ? v.descAr : v.descEn}
                </p>
              </div>
            ))}
          </div>
        </StorefrontContainer>
      </section>

      <StorefrontContainer className="py-16 md:py-20" as="div">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">
            {isRtl ? "ليه جيلي؟" : "Why Jelly?"}
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-8">
            {isRtl
              ? "لأنك تستحق شرابات تجمع بين الراحة والجمال. كل زوج مصمم بعناية عشان يناسب يومك المصري — من الصباح للمساء، ومن الشغل للخروجة."
              : "Because you deserve socks that combine comfort and style. Every pair is thoughtfully designed to fit your Egyptian day — from morning to night, from work to weekend."}
          </p>
          <Link
            href={`/${locale}/search`}
            className="inline-block bg-primary-container text-black px-10 py-4 rounded-full font-label-lg text-label-lg sticker-border hover:scale-105 transition-all active:scale-95"
          >
            {isRtl ? "تسوق المجموعة" : "Shop the Collection"}
          </Link>
        </div>
      </StorefrontContainer>
    </>
  );
}
