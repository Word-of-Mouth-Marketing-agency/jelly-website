import type { NextAuthConfig } from "next-auth";

// Edge-safe auth config — no Prisma, no bcrypt, no Node.js-only modules.
// Imported by middleware.ts to read JWT tokens without a full server runtime.
export const authConfig = {
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/en/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? "";
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
