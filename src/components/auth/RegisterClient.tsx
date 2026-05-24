"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterClient() {
  const { locale } = useParams() as { locale: string };
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError((data as { error?: string }).error ?? "Registration failed. Please try again.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      router.push(`/${locale}/login`);
    } else {
      router.push(`/${locale}/account`);
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
          <p className="mt-3 text-[#4a4732] font-medium">Join the Jelly family</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e8e2cf]">
          <h1 className="text-xl font-bold text-[#1e1c10] mb-6">Create your account</h1>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="register-firstName" className="block text-sm font-semibold text-[#4a4732] mb-1.5">
                  First name
                </label>
                <input
                  id="register-firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  className="w-full border border-[#ccc7ab] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#686000] focus:ring-2 focus:ring-[#fbe902]/40 transition"
                  placeholder="Ahmed"
                />
              </div>
              <div>
                <label htmlFor="register-lastName" className="block text-sm font-semibold text-[#4a4732] mb-1.5">
                  Last name
                </label>
                <input
                  id="register-lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                  className="w-full border border-[#ccc7ab] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#686000] focus:ring-2 focus:ring-[#fbe902]/40 transition"
                  placeholder="Hassan"
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-semibold text-[#4a4732] mb-1.5">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                aria-describedby={error ? "register-error" : undefined}
                className="w-full border border-[#ccc7ab] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#686000] focus:ring-2 focus:ring-[#fbe902]/40 transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-semibold text-[#4a4732] mb-1.5">
                Password
              </label>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                aria-describedby={error ? "register-error" : undefined}
                className="w-full border border-[#ccc7ab] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#686000] focus:ring-2 focus:ring-[#fbe902]/40 transition"
                placeholder="Min. 8 characters"
              />
            </div>

            <div>
              <label htmlFor="register-confirm" className="block text-sm font-semibold text-[#4a4732] mb-1.5">
                Confirm password
              </label>
              <input
                id="register-confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                aria-describedby={error ? "register-error" : undefined}
                className="w-full border border-[#ccc7ab] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#686000] focus:ring-2 focus:ring-[#fbe902]/40 transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p id="register-error" role="alert" className="text-sm text-[#ba1a1a] bg-[#ffdad6] rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e1c10] text-white font-bold py-3 rounded-lg hover:bg-[#686000] transition disabled:opacity-60 cursor-pointer mt-2"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#4a4732]">
            Already have an account?{" "}
            <Link
              href={`/${locale}/login`}
              className="font-semibold text-[#686000] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
