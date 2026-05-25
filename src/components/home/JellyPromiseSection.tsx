import Link from "next/link";
import StorefrontContainer from "@/components/layout/StorefrontContainer";

type Props = {
  locale: string;
};

const copy = {
  en: {
    eyebrow: "THE JELLY PROMISE",
    headline: "Socks that feel good, look fun, and move with you.",
    body: "Soft everyday pairs made for school runs, office days, workouts, and weekend plans.",
    cta: "Shop the Collection",
  },
  ar: {
    eyebrow: "وعد جيلي",
    headline: "شرابات مريحة، شكلها مبهج، وتتحرك معاك طول اليوم.",
    body: "اختيارات يومية ناعمة للمدرسة، الشغل، التمرين، والخروجات.",
    cta: "تسوق المجموعة",
  },
};

export default function JellyPromiseSection({ locale }: Props) {
  const content = locale === "ar" ? copy.ar : copy.en;

  return (
    <StorefrontContainer className="mb-section-gap">
      <div className="grid gap-gutter lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.75fr)]">
        <div className="relative min-h-[280px] overflow-hidden rounded-2xl bg-primary-container p-6 sticker-border sm:min-h-[340px] sm:p-8 lg:min-h-[360px]">
          <div className="absolute inset-5 rounded-xl border-2 border-secondary/40" />
          <div className="absolute -end-8 top-8 h-32 w-32 rounded-full bg-white/70 sm:h-44 sm:w-44" />
          <div className="absolute bottom-8 end-[16%] h-20 w-44 rotate-[-8deg] rounded-full bg-white sticker-border sm:h-28 sm:w-64" />
          <div className="absolute bottom-10 start-[12%] h-28 w-20 rotate-12 rounded-b-[999px] rounded-t-[36px] bg-brand-blue sticker-border sm:h-40 sm:w-28">
            <div className="absolute left-1/2 top-5 h-10 w-14 -translate-x-1/2 rounded-full bg-white sticker-border" />
          </div>
          <div className="relative z-10 flex h-full max-w-xl flex-col justify-between">
            <p className="font-label-sm text-label-sm tracking-[0.16em] text-primary">
              {content.eyebrow}
            </p>
            <h2 className="mt-16 max-w-[13ch] font-display-lg text-[clamp(2rem,4.4vw,4.25rem)] font-extrabold leading-[1.02] text-on-surface sm:mt-24">
              {content.headline}
            </h2>
          </div>
        </div>

        <div className="flex min-h-[240px] flex-col justify-between rounded-2xl bg-white p-6 sticker-border sm:p-8 lg:min-h-[360px]">
          <p className="max-w-sm text-body-lg text-on-surface-variant">
            {content.body}
          </p>
          <Link
            href={`/${locale}/search`}
            className="mt-8 inline-flex w-fit items-center rounded-full bg-primary-container px-7 py-3 font-label-lg text-label-lg text-on-surface sticker-border transition-all hover:scale-105 hover:bg-primary-fixed active:scale-95"
          >
            {content.cta}
            <span className="ms-2" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </StorefrontContainer>
  );
}
