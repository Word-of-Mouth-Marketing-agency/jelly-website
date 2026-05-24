"use client";

import { Shirt } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type GalleryImage = {
  id: string;
  url: string;
  altEn: string | null;
  altAr?: string | null;
};

interface Props {
  images: GalleryImage[];
  productName: string;
  locale?: string;
}

export default function ImageGallery({
  images,
  productName,
  locale = "en",
}: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = images[activeIdx] ?? images[0];
  const activeAlt = locale === "ar" ? active?.altAr : active?.altEn;

  if (!active) {
    return (
      <div className="aspect-square bg-surface-container rounded-2xl sticker-border flex items-center justify-center">
        <Shirt size={72} strokeWidth={1.75} className="text-outline-variant" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square bg-surface-container rounded-2xl overflow-hidden sticker-border">
        <Image
          src={active.url}
          fill
          className="object-cover"
          alt={activeAlt ?? productName}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => {
            const thumbnailAlt =
              (locale === "ar" ? image.altAr : image.altEn) ??
              `${productName} ${index + 1}`;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIdx(index)}
                aria-label={`View image ${index + 1}`}
                className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  index === activeIdx
                    ? "border-primary scale-105 shadow-md"
                    : "border-outline-variant hover:border-primary/60"
                }`}
              >
                <Image
                  src={image.url}
                  fill
                  className="object-cover"
                  alt={thumbnailAlt}
                  sizes="80px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
