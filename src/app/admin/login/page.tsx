"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
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
      setError("Invalid credentials.");
      setLoading(false);
      return;
    }

    // Verify the signed-in user is ADMIN before granting access
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json() as { user?: { role?: string } };
    if (session?.user?.role !== "ADMIN") {
      setError("Access denied. Admin accounts only.");
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-[#1e1c10] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl font-extrabold tracking-tight inline-block">
            <span className="bg-[#fbe902] px-2 text-[#1e1c10]">JELLY</span>
          </span>
          <p className="mt-3 text-[#ccc7ab] text-sm font-medium tracking-widest uppercase">
            Admin Portal
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-xl font-bold text-[#1e1c10] mb-6">Administrator Sign In</h1>

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
                placeholder="admin@jellysocks.com"
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
              className="w-full bg-[#fbe902] text-[#1e1c10] font-bold py-3 rounded-lg hover:bg-[#d9c900] transition disabled:opacity-60 cursor-pointer mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
