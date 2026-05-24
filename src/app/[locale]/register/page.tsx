import RegisterClient from "@/components/auth/RegisterClient";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata({
    title: "Create Account",
    description: "Join the Jelly family. Create an account to shop premium Egyptian socks.",
    path: "/register",
    locale,
  });
}

export default function RegisterPage() {
  return <RegisterClient />;
}
