import StorefrontContainer from "@/components/layout/StorefrontContainer";

type Props = {
  locale: string;
};

export default function FeatureBanner({ locale }: Props) {
  return (
    <StorefrontContainer className="mt-10 mb-section-gap md:mt-14">
      <div
        className="relative aspect-[16/7] overflow-hidden rounded-2xl bg-brand-blue sticker-border sm:aspect-[16/6] lg:aspect-[16/5]"
        dir={locale === "ar" ? "rtl" : "ltr"}
        aria-hidden="true"
      >
        <div className="absolute inset-4 rounded-xl border-2 border-white/80 md:inset-5" />
        <div className="absolute -top-10 end-8 h-28 w-28 rounded-full bg-primary-container md:h-40 md:w-40" />
        <div className="absolute -bottom-12 start-10 h-36 w-36 rounded-full bg-white/20 md:h-52 md:w-52" />
        <div className="absolute bottom-8 end-[18%] h-20 w-40 -rotate-6 rounded-full bg-surface-container-high sticker-border md:bottom-10 md:h-28 md:w-56" />
        <div className="absolute start-[16%] top-1/2 h-24 w-16 -translate-y-1/2 rotate-12 rounded-b-[999px] rounded-t-[32px] bg-white sticker-border md:h-36 md:w-24 md:rounded-t-[44px]">
          <div className="absolute left-1/2 top-4 h-7 w-10 -translate-x-1/2 rounded-full bg-primary-container sticker-border md:h-10 md:w-14" />
        </div>
      </div>
    </StorefrontContainer>
  );
}
