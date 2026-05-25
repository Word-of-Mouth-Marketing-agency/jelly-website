import Link from "next/link";
import StorefrontContainer from "@/components/layout/StorefrontContainer";

type Props = {
  locale: string;
};

const copy = {
  en: {
    eyebrow: "BUILT FOR EVERYDAY JOY",
    headlineStart: "Incredibly ",
    highlight: "comfy",
    headlineEnd: " socks for every kind of day.",
    body: "Soft feel, playful colors, and a fit made for daily movement.",
    cta: "Shop Best Sellers",
  },
  ar: {
    eyebrow: "صُممت للراحة اليومية",
    headline: "شرابات مريحة لكل يوم وكل مشوار.",
    body: "ملمس ناعم، ألوان مرحة، ومقاس مناسب للحركة اليومية.",
    cta: "تسوق المميز",
  },
};

export default function FeatureBanner({ locale }: Props) {
  const isArabic = locale === "ar";

  return (
    <StorefrontContainer className="mb-section-gap">
      <div className="grid overflow-hidden rounded-2xl sticker-border bg-surface-container-high lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
        <div className="flex flex-col items-start justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-16">
          <p className="mb-4 font-label-sm text-label-sm tracking-[0.16em] text-primary">
            {isArabic ? copy.ar.eyebrow : copy.en.eyebrow}
          </p>
          <h2 className="max-w-[12ch] font-display-lg text-[clamp(2.25rem,5vw,4.75rem)] font-extrabold leading-[0.98] text-on-surface">
            {isArabic ? (
              copy.ar.headline
            ) : (
              <>
                {copy.en.headlineStart}
                <span className="rounded-xl bg-primary-container px-2">
                  {copy.en.highlight}
                </span>
                {copy.en.headlineEnd}
              </>
            )}
          </h2>
          <p className="mt-5 max-w-md text-body-lg text-on-surface-variant">
            {isArabic ? copy.ar.body : copy.en.body}
          </p>
          <Link
            href={`/${locale}/search?featured=true`}
            className="mt-8 inline-flex items-center rounded-full bg-primary-container px-8 py-4 font-label-lg text-label-lg text-on-surface sticker-border transition-all hover:scale-105 hover:bg-primary-fixed active:scale-95"
          >
            {isArabic ? copy.ar.cta : copy.en.cta}
            <span className="ms-2" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        <div className="relative min-h-[280px] overflow-hidden border-t-2 border-secondary bg-brand-blue lg:min-h-[420px] lg:border-s-2 lg:border-t-0">
          <div className="absolute inset-6 rounded-2xl border-2 border-white/80" />
          <div className="absolute -right-10 top-8 h-36 w-36 rounded-full bg-primary-container" />
          <div className="absolute -bottom-12 left-8 h-44 w-44 rounded-full bg-white/20" />
          <div className="absolute left-1/2 top-1/2 h-48 w-28 -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] rounded-b-[999px] rounded-t-[48px] bg-white sticker-border shadow-none">
            <div className="absolute left-1/2 top-6 h-12 w-16 -translate-x-1/2 rounded-full bg-primary-container sticker-border" />
            <div className="absolute bottom-8 left-1/2 h-14 w-14 -translate-x-1/2 rounded-full bg-surface-container-high" />
          </div>
        </div>
      </div>
    </StorefrontContainer>
  );
}
