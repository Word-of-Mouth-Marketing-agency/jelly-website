import type { Metadata } from "next";
import StorefrontContainer from "@/components/layout/StorefrontContainer";
import ContactFormClient from "@/components/contact/ContactFormClient";
import { createMetadata } from "@/lib/metadata";
import type { ReactNode } from "react";
import { MessageCircle, Mail } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata({
    title: "Contact",
    description:
      locale === "ar"
        ? "تواصل مع جيلي - استفسارات، طلبات خاصة، أو أفكار تعاون."
        : "Contact Jelly — questions, custom orders, or wholesale ideas.",
    path: "/contact",
    locale,
  });
}

function InstagramSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" width="24" height="24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.072 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function ContactInfoCard({
  icon,
  title,
  description,
  actionLabel,
  href,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  href: string;
}) {
  return (
    <div className="bg-white rounded-2xl sticker-border p-6 md:p-8 flex flex-col gap-4">
      <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shrink-0">
        {icon}
      </div>
      <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="mt-auto font-label-lg text-label-lg text-brand-blue hover:text-primary transition-colors"
      >
        {actionLabel}
      </a>
    </div>
  );
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRtl = locale === "ar";
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201234567890";

  const contactMethods = [
    {
      icon: <MessageCircle size={24} strokeWidth={2.25} className="text-on-primary-container" aria-hidden="true" />,
      title: isRtl ? "واتساب" : "WhatsApp",
      description: isRtl
        ? "أسرع طريقة للتواصل معانا."
        : "The fastest way to reach us.",
      actionLabel: isRtl ? "راسلنا" : "Message us",
      href: `https://wa.me/${whatsappNumber}`,
    },
    {
      icon: <Mail size={24} strokeWidth={2.25} className="text-on-primary-container" aria-hidden="true" />,
      title: isRtl ? "بريد إلكتروني" : "Email",
      description: isRtl
        ? "للطلبات الخاصة والاستفسارات المطولة."
        : "For custom orders and detailed inquiries.",
      actionLabel: isRtl ? "أرسل إيميل" : "Send email",
      href: "mailto:hello@jelly-eg.com",
    },
    {
      icon: <InstagramSvg className="w-6 h-6 text-on-primary-container" />,
      title: "Instagram",
      description: isRtl
        ? "آخر الإصدارات والإلهام اليومي."
        : "Latest drops and daily style inspiration.",
      actionLabel: isRtl ? "تابعنا" : "Follow us",
      href: "https://instagram.com/jelly.eg",
    },
  ];

  return (
    <>
      <section className="bg-surface-container-high border-b border-outline-variant">
        <StorefrontContainer className="py-16 md:py-24" as="div">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-4">
            {isRtl ? "تواصل مع جيلي" : "Contact Jelly"}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            {isRtl
              ? "عندك سؤال، طلب خاص، أو فكرة تعاون؟ إحنا موجودين."
              : "Questions, custom orders, or wholesale ideas? We're here."}
          </p>
        </StorefrontContainer>
      </section>

      <StorefrontContainer className="py-16 md:py-20" as="div">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-16">
          {contactMethods.map((method) => (
            <ContactInfoCard key={method.title} {...method} />
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8 text-center">
            {isRtl ? "أرسل لنا رسالة" : "Send Us a Message"}
          </h2>
          <ContactFormClient locale={locale} />
        </div>
      </StorefrontContainer>
    </>
  );
}
