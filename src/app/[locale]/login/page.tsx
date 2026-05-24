import LoginClient from "@/components/auth/LoginClient";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata({
    title: "Sign In",
    description: "Sign in to your Jelly account to manage orders, wishlists, and profile.",
    path: "/login",
    locale,
  });
}

export default function LoginPage() {
  return <LoginClient />;
}
