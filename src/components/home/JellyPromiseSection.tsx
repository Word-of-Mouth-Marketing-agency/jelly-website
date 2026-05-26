import Link from "next/link";
import StorefrontContainer from "@/components/layout/StorefrontContainer";
import Reveal from "@/components/animations/Reveal";

type Props = {
  locale: string;
};

const copy = {
  en: {
    headline: "JELLY SOCKS, EVERYDAY JOY",
    subheadline: "Comfort that moves with you",
    body: "From school mornings to office days and weekend plans, Jelly socks bring soft comfort, playful colors, and easy everyday style.",
    cta: "Shop the Collection",
  },
  ar: {
    headline: "شرابات جيلي، بهجة كل يوم",
    subheadline: "راحة تتحرك معاك",
    body: "من صباح المدرسة لأيام الشغل وخطط الويك إند، شرابات جيلي بتجمع الراحة الناعمة، الألوان المبهجة، والستايل اليومي السهل.",
    cta: "تسوق المجموعة",
  },
};

export default function JellyPromiseSection({ locale }: Props) {
  const content = locale === "ar" ? copy.ar : copy.en;

  return (
    <section className="mb-section-gap border-y border-secondary bg-[#E8BC44] py-7 md:py-8">
      <StorefrontContainer as="div">
        <Reveal className="grid items-center gap-7 lg:min-h-[360px] lg:grid-cols-[minmax(0,1.85fr)_minmax(280px,1fr)]">
          <div className="relative min-h-[280px] overflow-hidden rounded-[2rem] sm:min-h-[340px] lg:min-h-[400px]">
            <img
              src="/home/jelly-promise-wave.gif"
              alt=""
              className="absolute inset-0 w-full h-full object-contain"
            />
            <div className="relative z-10 flex min-h-[280px] flex-col items-center justify-center px-6 text-center sm:min-h-[340px] lg:min-h-[400px]">
              <h2 className="max-w-[14ch] font-display-lg text-[clamp(2rem,4.2vw,4.1rem)] font-extrabold leading-[1.02] text-on-surface">
              {content.headline}
              </h2>
              <p className="mt-3 font-headline-md text-headline-md text-on-surface-variant">
                {content.subheadline}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start justify-center pb-1 lg:min-h-[300px]">
            <div className="mb-7 h-16 w-24 rounded-[999px_999px_999px_24px] bg-[#FFF7D8] sticker-border" />
            <p className="max-w-md text-body-lg font-medium text-on-surface">
              {content.body}
            </p>
            <Link
              href={`/${locale}/search`}
              className="mt-8 inline-flex w-fit items-center rounded-full bg-on-surface px-7 py-3 font-label-lg text-label-lg text-white sticker-border transition-all hover:scale-105 active:scale-95"
            >
              {content.cta}
              <span className="ms-2" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </StorefrontContainer>
    </section>
  );
}
