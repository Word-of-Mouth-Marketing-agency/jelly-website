import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jelly | Socks that make you smile",
  description:
    "Jelly — Egyptian socks brand. Premium, playful, colorful socks for men, women, and kids.",
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // dir and lang will be set dynamically in Phase 1 once locale is resolved
  void params;
  return <>{children}</>;
}
