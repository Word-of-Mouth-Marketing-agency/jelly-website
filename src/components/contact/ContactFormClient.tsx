"use client";

import { useState } from "react";
import { CheckCircle, Send } from "lucide-react";

export default function ContactFormClient({ locale }: { locale: string }) {
  const [submitted, setSubmitted] = useState(false);
  const isRtl = locale === "ar";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl sticker-border p-8 md:p-10 text-center">
        <CheckCircle size={48} strokeWidth={1.75} className="mx-auto mb-4 text-green-500" aria-hidden="true" />
        <h3 className="font-headline-md text-headline-md text-on-surface mb-3">
          {isRtl ? "شكرًا لرسالتك!" : "Thanks for your message!"}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {isRtl
            ? "هنوصل لك في أقرب وقت. أسرع طريقة للتواصل هي واتساب."
            : "We'll get back to you soon. For fastest help, message us on WhatsApp."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl sticker-border p-6 md:p-8 space-y-6">
      <div>
        <label htmlFor="name" className="block font-label-lg text-label-lg text-on-surface mb-2">
          {isRtl ? "الاسم" : "Name"}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-container font-body-md text-body-md"
        />
      </div>
      <div>
        <label htmlFor="email" className="block font-label-lg text-label-lg text-on-surface mb-2">
          {isRtl ? "البريد الإلكتروني" : "Email"}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-container font-body-md text-body-md"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block font-label-lg text-label-lg text-on-surface mb-2">
          {isRtl ? "رقم الهاتف" : "Phone"}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-container font-body-md text-body-md"
        />
      </div>
      <div>
        <label htmlFor="message" className="block font-label-lg text-label-lg text-on-surface mb-2">
          {isRtl ? "الرسالة" : "Message"}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-container font-body-md text-body-md resize-y"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-primary-container text-black px-8 py-3.5 rounded-full font-label-lg text-label-lg sticker-border hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <Send size={18} strokeWidth={2.25} aria-hidden="true" />
        {isRtl ? "إرسال الرسالة" : "Send Message"}
      </button>
    </form>
  );
}
