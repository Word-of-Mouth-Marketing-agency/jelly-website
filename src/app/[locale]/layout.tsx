import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Jelly | Socks that make you smile",
  description:
    "Jelly — Egyptian socks brand. Premium, playful, colorful socks for men, women, and kids.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
