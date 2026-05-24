"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import CartMergeOnLogin from "@/components/cart/CartMergeOnLogin";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthSessionProvider>
      <CartMergeOnLogin />
      {children}
    </NextAuthSessionProvider>
  );
}
