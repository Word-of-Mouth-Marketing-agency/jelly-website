import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 items-center">
      {/* Text */}
      <div className="space-y-8 px-margin-desktop py-16 md:py-0">
        <h1 className="font-display-lg text-display-lg text-on-surface max-w-md">
          Socks that make you smile
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
          Supportive layers with our comfortable materials. Socks you need and
          make you smile. Experience the joy of walking on clouds.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-label-lg text-label-lg sticker-border hover:scale-105 transition-all active:scale-95">
            Shop Now
          </button>
          <button className="bg-white text-on-surface-variant px-8 py-4 rounded-full font-label-lg text-label-lg sticker-border hover:scale-105 transition-all active:scale-95">
            Explore Collection
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="relative overflow-hidden min-h-[400px] md:min-h-[600px]">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGO72FJS633FWIh4tMHr48y9dv50QqIgoLT6Qd5En6M0w2M0_jdcVktekLnsZITAul-AM2Yn09ZWn4GU0mMSFXZ3tc7mykUklM5PNO3HK5Gq2hDUWiXQjYa58hjNqsbzXyVeTyXxtKjFH8M7jHcybGS3eZcAZpdkdnn6mNRU32KwutSvarDc05rJW08WakUPzRriyaFX4j69F41lAAC__BVhSJFRFkPFM-5KOIzNM-9gsbB26MeXiUZnIAsAkEyNAyHTxAYQ_9NWk"
          fill
          className="object-cover"
          alt="A dynamic lifestyle shot of a person sitting on a yellow chair, wearing bright, multi-colored striped socks and casual shoes."
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </section>
  );
}
