import Image from "next/image";
import Link from "next/link";

export default function HeroSection({ locale }: { locale: string }) {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 min-h-[400px] md:min-h-[600px]">
      {/* Text */}
      <div className="flex flex-col justify-center px-margin-mobile md:px-margin-desktop py-16 md:py-0 md:pl-[max(64px,calc(50vw-640px))]">
        <h1 className="font-display-lg text-display-lg text-on-surface max-w-md m-0">
          {locale === "ar"
            ? "Ø¬ÙˆØ§Ø±Ø¨ ØªØ¬Ø¹Ù„Ùƒ ØªØ¨ØªØ³Ù…"
            : "Socks that make you smile"}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mt-3 mb-0">
          {locale === "ar"
            ? "Ø·Ø¨Ù‚Ø§Øª Ø¯Ø§Ø¹Ù…Ø© Ù…Ø¹ Ù…ÙˆØ§Ø¯Ù†Ø§ Ø§Ù„Ù…Ø±ÙŠØ­Ø©. Ø¬ÙˆØ§Ø±Ø¨ ØªØ­ØªØ§Ø¬Ù‡Ø§ ÙˆØªØ¬Ø¹Ù„Ùƒ ØªØ¨ØªØ³Ù…. Ø¬Ø±Ø¨ Ù…ØªØ¹Ø© Ø§Ù„Ù…Ø´ÙŠ Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø­Ø§Ø¨."
            : "Supportive layers with our comfortable materials. Socks you need and make you smile. Experience the joy of walking on clouds."}
        </p>
        <div className="flex flex-wrap gap-4 mt-8">
          <Link
            href={`/${locale}/category/women`}
            className="bg-primary-container text-black px-8 py-4 rounded-full font-label-lg text-label-lg sticker-border hover:scale-105 transition-all active:scale-95 inline-block text-center"
          >
            {locale === "ar" ? "ØªØ³ÙˆÙ‚ÙŠ Ø§Ù„Ø¢Ù†" : "Shop Now"}
          </Link>
          <Link
            href={`/${locale}/search`}
            className="bg-white text-black px-8 py-4 rounded-full font-label-lg text-label-lg sticker-border hover:scale-105 transition-all active:scale-95 inline-block text-center"
          >
            {locale === "ar" ? "Ø§Ø³ØªÙƒØ´ÙÙŠ Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø©" : "Explore Collection"}
          </Link>
        </div>
      </div>

      {/* Image */}
      <div className="relative overflow-hidden min-h-[400px] md:h-full">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGO72FJS633FWIh4tMHr48y9dv50QqIgoLT6Qd5En6M0w2M0_jdcVktekLnsZITAul-AM2Yn09ZWn4GU0mMSFXZ3tc7mykUklM5PNO3HK5Gq2hDUWiXQjYa58hjNqsbzXyVeTyXxtKjFH8M7jHcybGS3eZcAZpdkdnn6mNRU32KwutSvarDc05rJW08WakUPzRriyaFX4j69F41lAAC__BVhSJFRFkPFM-5KOIzNM-9gsbB26MeXiUZnIAsAkEyNAyHTxAYQ_9NWk"
          fill
          className="object-cover"
          alt="A dynamic lifestyle shot of a person sitting on a yellow chair, wearing bright, multi-colored striped socks and casual shoes."
          sizes="50vw"
          priority
        />
      </div>
    </section>
  );
}

