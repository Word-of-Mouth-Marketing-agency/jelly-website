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
          <div className="relative min-h-[240px] overflow-hidden rounded-[2rem] sm:min-h-[300px] lg:min-h-[330px]">
            <div className="absolute inset-x-0 top-1/2 h-[78%] -translate-y-1/2 rounded-[45%_55%_48%_52%/58%_44%_56%_42%] bg-[#FFF7D8]" />
            <div className="absolute -start-10 top-8 h-32 w-44 rounded-full bg-[#FFF7D8] sm:h-44 sm:w-64" />
            <div className="absolute end-10 top-4 h-28 w-40 rounded-full bg-[#FFF7D8] sm:h-40 sm:w-60" />
            <div className="absolute -bottom-8 end-[18%] h-32 w-56 rounded-full bg-[#FFF7D8] sm:h-44 sm:w-72" />
            <div className="absolute inset-5 rounded-[2rem] bg-[radial-gradient(circle_at_18%_24%,rgba(251,233,2,0.5)_0_12%,transparent_13%),radial-gradient(circle_at_78%_70%,rgba(255,255,255,0.75)_0_10%,transparent_11%)]" />
            <div className="relative z-10 flex min-h-[240px] flex-col items-center justify-center px-6 text-center sm:min-h-[300px] lg:min-h-[330px]">
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
