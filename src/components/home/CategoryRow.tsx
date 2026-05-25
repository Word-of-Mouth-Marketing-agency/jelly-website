import Image from "next/image";
import Link from "next/link";
import { Palette } from "lucide-react";

const CATEGORIES = [
  {
    labelEn: "Men",
    labelAr: "رجالي",
    slug: "men",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFwEOYS-Dj5sZwgZ7Vxgk1GZwFBE6igBiYiL6mY52rGAMqvBBITQJRlZWKRMZxhBhajbh_M8vctZ-semaoPveefl-eeCz2oMGYNPqSnqJS92yNa-F3OZvhYEXzzJuzWVScBi_XVqNV6cOe-VxyQw8dTkRJ0sW9v_b790L7HWCne2inWuhfXfNe7m4OQCvy2KtSZzPDWy0WXlB21K2ArBcmG8Yfvq4fNM0WPAIna_apG2DYl6b9JPtjUF-awM8qhZ1Mw_p9eg61oZg",
  },
  {
    labelEn: "Women",
    labelAr: "حريمي",
    slug: "women",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAH8wIiREfJpU9x7oLN8pHfMfI6mzwf_pQmkd7jKooVP5BfSI-F6rW8km1BGcRxsBtUL6MZl-rZAd2vOq7j-UiKIwQQeyHPWs4YyT2Jw3_VQIGWIhffhyXvZGweWsPvYw4fEYHhCUbEEIv5nVABW37XHSQrsuETPH1_hqNUTg-pr_O3Nf48DGY6TDGp2VfEP_XgbpM0W6lErK7Vtdwq-7JB2ko3eW2B232IEOqVQOolz9-2Hy28fZ5ZCsUifwuEKRChuMfuieStDqY",
  },
  {
    labelEn: "Kids",
    labelAr: "أطفال",
    slug: "kids",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVfKxGfgPtnh1z0fvReqyUuJc9F1GPO3hRwRIHHdtrKpt9pTSCgm8Zer5_bxkd5sS8F7mcFZSt7hAFeLx73JzCGTDkJ2554J6wXcw6FDys7mhBLGylpOOT-hIzkuq57MNTv1h6qD02WLHJrYEfsNGrVc-kNhUX3QGfScvVMImzdqM_aBX5A7hKvL64NpnPM5pg3HXYMMNmY_Wv-QLrjEuOsh9AXUdNoJYlxBIUgPDgjx_sHXPMRpRemepPprMVa4rH_HlG4k4eWnI",
  },
];

export default function CategoryRow({ locale = "en" }: { locale?: string }) {
  const customLabel = locale === "ar" ? "طلبات مخصصة" : "Custom Orders";

  return (
    <section className="max-w-container-max mx-auto px-margin-desktop mb-20 pt-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
        {CATEGORIES.map(({ labelEn, labelAr, slug, src }) => {
          const label = locale === "ar" ? labelAr : labelEn;
          return (
            <Link
              key={slug}
              href={`/${locale}/category/${slug}`}
              className="group block"
            >
              <div className="relative rounded-2xl overflow-hidden sticker-border mb-4 aspect-video">
                <Image
                  src={src}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={label}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <h3 className="font-headline-md text-headline-md text-center">
                {label}
              </h3>
            </Link>
          );
        })}

        {/* Custom Orders card */}
        <Link
          href={`/${locale}/custom-orders`}
          className="group block"
        >
          <div className="relative rounded-2xl overflow-hidden sticker-border mb-4 aspect-video flex items-center justify-center bg-[#FBE902]">
            <Palette
              size={48}
              strokeWidth={1.5}
              className="text-black group-hover:scale-110 transition-transform duration-500"
              aria-hidden="true"
            />
          </div>
          <h3 className="font-headline-md text-headline-md text-center">
            {customLabel}
          </h3>
        </Link>
      </div>
    </section>
  );
}
