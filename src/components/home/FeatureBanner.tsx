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
      <div className="grid overflow-hidden rounded-2xl sticker-border bg-surface-container-high lg:aspect-[16/9] lg:max-h-[340px] lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.78fr)]">
        <div className="flex min-h-0 flex-col items-start justify-center px-5 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-6">
          <p className="mb-2 font-label-sm text-[11px] font-bold leading-4 tracking-[0.14em] text-primary">
            {isArabic ? copy.ar.eyebrow : copy.en.eyebrow}
          </p>
          <h2 className="max-w-[15ch] font-display-lg text-[clamp(1.85rem,3.4vw,3.35rem)] font-extrabold leading-[1.02] text-on-surface">
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
          <p className="mt-3 max-w-sm text-body-md text-on-surface-variant">
            {isArabic ? copy.ar.body : copy.en.body}
          </p>
          <Link
            href={`/${locale}/search?featured=true`}
            className="mt-5 inline-flex items-center rounded-full bg-primary-container px-6 py-3 font-label-lg text-label-lg text-on-surface sticker-border transition-all hover:scale-105 hover:bg-primary-fixed active:scale-95"
          >
            {isArabic ? copy.ar.cta : copy.en.cta}
            <span className="ms-2" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        <div className="relative min-h-[170px] overflow-hidden border-t-2 border-secondary bg-brand-blue lg:min-h-0 lg:border-s-2 lg:border-t-0">
          <div className="absolute inset-4 rounded-xl border-2 border-white/80" />
          <div className="absolute -right-8 top-5 h-24 w-24 rounded-full bg-primary-container lg:h-28 lg:w-28" />
          <div className="absolute -bottom-10 left-6 h-32 w-32 rounded-full bg-white/20 lg:h-36 lg:w-36" />
          <div className="absolute left-1/2 top-1/2 h-32 w-20 -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] rounded-b-[999px] rounded-t-[36px] bg-white sticker-border shadow-none lg:h-40 lg:w-24">
            <div className="absolute left-1/2 top-4 h-9 w-12 -translate-x-1/2 rounded-full bg-primary-container sticker-border lg:h-10 lg:w-14" />
            <div className="absolute bottom-6 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full bg-surface-container-high lg:h-12 lg:w-12" />
          </div>
        </div>
      </div>
    </StorefrontContainer>
  );
}
