import type { Metadata } from "next";

const SITE_URL = "https://jelly-eg.com";
const SITE_NAME = "Jelly";
const DEFAULT_DESCRIPTION =
  "Jelly — Egyptian socks brand. Premium, playful, colorful socks for men, women, and kids. Socks that make you smile.";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

export function createMetadata(options: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  locale?: string;
}): Metadata {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    path = "",
    image = DEFAULT_IMAGE,
    noIndex = false,
    locale = "en",
  } = options;

  const fullTitle = title.includes("Jelly") ? title : `${title} - Jelly`;
  const url = `${SITE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en${path}`,
        ar: `${SITE_URL}/ar${path}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    keywords: [
      "socks",
      "Egyptian socks",
      "colorful socks",
      "men socks",
      "women socks",
      "kids socks",
      "premium socks",
      "Jelly",
      "jelly-eg",
    ],
  };
}
