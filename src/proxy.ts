import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["en", "ar"] as const;
const DEFAULT_LOCALE = "en";

// Edge-safe: NextAuth(authConfig) only reads JWT from cookies — no Prisma, no bcrypt.
const { auth } = NextAuth(authConfig);

type AuthRequest = NextRequest & { auth: { user?: { role?: string } } | null };

export const proxy = auth(function middleware(request: AuthRequest) {
  const { pathname } = request.nextUrl;
  const session = request.auth;
  const userRole = session?.user?.role;

  // Skip Next.js internals and static assets early
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // --- Admin route protection ---
  // /admin/login is public; everything else under /admin requires ADMIN role.
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!session || userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // --- Locale-scoped protected routes ---
  const locale = LOCALES.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (locale) {
    const sub = pathname.slice(`/${locale}`.length);
    const isProtected =
      sub === "/account" ||
      sub.startsWith("/account/") ||
      sub === "/wishlist";
    if (isProtected && !session) {
      return NextResponse.redirect(
        new URL(
          `/${locale}/login?callbackUrl=${encodeURIComponent(pathname)}`,
          request.url
        )
      );
    }
  }

  // --- Locale redirect for bare paths (no locale prefix) ---
  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (!hasLocale && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
