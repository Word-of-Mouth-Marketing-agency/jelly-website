"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Phone, MapPin, ShoppingBag, Package } from "lucide-react";
import { money } from "@/lib/money";

type UserDetail = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
  isActive: boolean;
  createdAt: string;
  orders: Array<{
    id: string;
    status: string;
    total: number;
    itemCount: number;
    couponCode: string | null;
    createdAt: string;
  }>;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PROCESSING: "bg-indigo-50 text-indigo-700",
  SHIPPED: "bg-purple-50 text-purple-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-600",
};

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/users/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setUser(data);
      })
      .finally(() => setLoading(false));
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className="p-12 text-center text-on-surface-variant text-sm">Loading customer...</div>;
  if (!user) return <div className="p-12 text-center text-error text-sm">Customer not found.</div>;

  const totalSpent = user.orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/users" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to customers
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white rounded-2xl sticker-border p-6">
            <h1 className="font-display-lg text-display-lg text-on-surface mb-1">
              {user.firstName || user.lastName ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "Customer"}
            </h1>
            <p className="text-on-surface-variant text-sm mb-4">{user.email}</p>

            <div className="space-y-3 text-sm">
              {user.phone && (
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Phone size={16} aria-hidden="true" />
                  {user.phone}
                </div>
              )}
              {user.address && (
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <MapPin size={16} aria-hidden="true" />
                  {user.address}
                  {user.city && `, ${user.city}`}
                  {user.postalCode && ` ${user.postalCode}`}
                  {user.country && `, ${user.country}`}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-outline-variant">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                user.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl sticker-border p-6">
            <h2 className="font-bold text-on-surface mb-3">Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-surface-container-high/50">
                <p className="text-xs text-on-surface-variant">Total Orders</p>
                <p className="text-xl font-bold">{user.orders.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-high/50">
                <p className="text-xs text-on-surface-variant">Total Spent</p>
                <p className="text-xl font-bold">{money(totalSpent)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl sticker-border p-6">
            <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
              <ShoppingBag size={18} aria-hidden="true" />
              Order History
            </h2>
            {user.orders.length === 0 ? (
              <div className="p-8 text-center">
                <Package size={40} strokeWidth={1.5} className="mx-auto mb-3 text-outline-variant" />
                <p className="text-on-surface-variant text-sm">No orders yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant bg-surface-container-high/50">
                      <th className="text-left px-3 py-2 font-semibold text-on-surface-variant">Order</th>
                      <th className="text-left px-3 py-2 font-semibold text-on-surface-variant">Items</th>
                      <th className="text-left px-3 py-2 font-semibold text-on-surface-variant">Total</th>
                      <th className="text-left px-3 py-2 font-semibold text-on-surface-variant">Status</th>
                      <th className="text-left px-3 py-2 font-semibold text-on-surface-variant">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.orders.map((o) => (
                      <tr key={o.id} className="border-b border-outline-variant/50 hover:bg-surface-container-high/30 transition">
                        <td className="px-3 py-2 font-mono text-xs text-on-surface-variant">{o.id.slice(0, 12)}...</td>
                        <td className="px-3 py-2">{o.itemCount}</td>
                        <td className="px-3 py-2 font-medium">{money(o.total)}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[o.status] ?? "bg-gray-100 text-gray-600"}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-on-surface-variant text-xs">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
