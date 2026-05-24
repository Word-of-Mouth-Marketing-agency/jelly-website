import Image from "next/image";

const CATEGORIES = [
  {
    label: "Men",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFwEOYS-Dj5sZwgZ7Vxgk1GZwFBE6igBiYiL6mY52rGAMqvBBITQJRlZWKRMZxhBhajbh_M8vctZ-semaoPveefl-eeCz2oMGYNPqSnqJS92yNa-F3OZvhYEXzzJuzWVScBi_XVqNV6cOe-VxyQw8dTkRJ0sW9v_b790L7HWCne2inWuhfXfNe7m4OQCvy2KtSZzPDWy0WXlB21K2ArBcmG8Yfvq4fNM0WPAIna_apG2DYl6b9JPtjUF-awM8qhZ1Mw_p9eg61oZg",
  },
  {
    label: "Women",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAH8wIiREfJpU9x7oLN8pHfMfI6mzwf_pQmkd7jKooVP5BfSI-F6rW8km1BGcRxsBtUL6MZl-rZAd2vOq7j-UiKIwQQeyHPWs4YyT2Jw3_VQIGWIhffhyXvZGweWsPvYw4fEYHhCUbEEIv5nVABW37XHSQrsuETPH1_hqNUTg-pr_O3Nf48DGY6TDGp2VfEP_XgbpM0W6lErK7Vtdwq-7JB2ko3eW2B232IEOqVQOolz9-2Hy28fZ5ZCsUifwuEKRChuMfuieStDqY",
  },
  {
    label: "Kids",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVfKxGfgPtnh1z0fvReqyUuJc9F1GPO3hRwRIHHdtrKpt9pTSCgm8Zer5_bxkd5sS8F7mcFZSt7hAFeLx73JzCGTDkJ2554J6wXcw6FDys7mhBLGylpOOT-hIzkuq57MNTv1h6qD02WLHJrYEfsNGrVc-kNhUX3QGfScvVMImzdqM_aBX5A7hKvL64NpnPM5pg3HXYMMNmY_Wv-QLrjEuOsh9AXUdNoJYlxBIUgPDgjx_sHXPMRpRemepPprMVa4rH_HlG4k4eWnI",
  },
  {
    label: "Unisex",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWzg6kz1LDMv9aoHMD0Qt_j7D6SKwKeKkPSH6EpGTY2bbGtXAx9LKOLy5OmmhHC1ypFh8gFEjU80d-JddYjTADhPcVAlPfu1SjLTJUxPWtgTYo375xgch8Oz8bizMbfXNpk46rtFyNX_EyGyunyRIYkLM3n-Iy2q2GChNmSUN5cxjbLK6nSNWZkWCkscaqeRxGa9FKseEWiEYb5MwVQG6P0MtHniEMOfCkCXnw3JhnRQ5NcFNhhnC8GAmS-RCUlEQTpzmmSp4PGe4",
  },
];

export default function CategoryRow() {
  return (
    <section className="max-w-container-max mx-auto px-margin-desktop mb-20 pt-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
        {CATEGORIES.map(({ label, src }) => (
          <div key={label} className="group cursor-pointer">
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
          </div>
        ))}
      </div>
    </section>
  );
}
