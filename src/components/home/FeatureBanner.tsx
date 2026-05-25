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
      />
    </StorefrontContainer>
  );
}
