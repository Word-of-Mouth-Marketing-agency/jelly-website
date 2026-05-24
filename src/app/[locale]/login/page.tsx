"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { locale } = useParams() as { locale: string };
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? `/${locale}/account`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push(callbackUrl);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${locale}`}>
            <span className="text-4xl font-extrabold tracking-tight inline-block">
              <span className="bg-[#fbe902] px-2 text-[#1e1c10]">JELLY</span>
            </span>
          </Link>
          <p className="mt-3 text-[#4a4732] font-medium">Welcome back</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e8e2cf]">
          <h1 className="text-xl font-bold text-[#1e1c10] mb-6">Sign in to your account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#4a4732] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full border border-[#ccc7ab] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#686000] focus:ring-2 focus:ring-[#fbe902]/40 transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#4a4732] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full border border-[#ccc7ab] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#686000] focus:ring-2 focus:ring-[#fbe902]/40 transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-[#ba1a1a] bg-[#ffdad6] rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e1c10] text-white font-bold py-3 rounded-lg hover:bg-[#686000] transition disabled:opacity-60 cursor-pointer mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#4a4732]">
            Don&apos;t have an account?{" "}
            <Link
              href={`/${locale}/register`}
              className="font-semibold text-[#686000] hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
