"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, Eye, Users, ShoppingBag } from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  isActive: boolean;
  orderCount: number;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const take = 20;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("skip", String(skip));
      params.set("take", String(take));
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (!cancelled && res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setCount(data.count);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [search, skip]);

  async function toggleActive(user: AdminUser) {
    setTogglingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u)));
      }
    } catch {
      // ignore
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-1">Customers</h1>
          <p className="text-on-surface-variant text-sm">{count} customers</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl sticker-border p-4 mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSkip(0); }}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl sticker-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant text-sm">Loading customers...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={48} strokeWidth={1.5} className="mx-auto mb-4 text-outline-variant" />
            <p className="text-on-surface-variant text-sm">No customers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-high/50">
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Contact</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Location</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Orders</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Joined</th>
                  <th className="text-right px-4 py-3 font-semibold text-on-surface-variant">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-outline-variant/50 hover:bg-surface-container-high/30 transition">
                    <td className="px-4 py-3">
                      <p className="font-bold">
                        {u.firstName || u.lastName ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() : "—"}
                      </p>
                      <p className="text-xs text-on-surface-variant">{u.email}</p>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">
                      {u.phone ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">
                      {u.city ? `${u.city}${u.postalCode ? `, ${u.postalCode}` : ""}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <ShoppingBag size={14} aria-hidden="true" />
                        {u.orderCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        u.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/users/${u.id}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                          <Eye size={14} aria-hidden="true" />
                          View
                        </Link>
                        <button
                          onClick={() => toggleActive(u)}
                          disabled={togglingId === u.id}
                          className="text-xs px-2 py-1 rounded border border-outline-variant hover:bg-surface-container-high transition disabled:opacity-50"
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant">
          <p className="text-sm text-on-surface-variant">
            Showing {Math.min(skip + 1, count)} - {Math.min(skip + take, count)} of {count}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSkip((s) => Math.max(0, s - take))}
              disabled={skip === 0}
              className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-high disabled:opacity-40 transition"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button
              onClick={() => setSkip((s) => (s + take < count ? s + take : s))}
              disabled={skip + take >= count}
              className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-high disabled:opacity-40 transition"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
