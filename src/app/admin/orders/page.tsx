"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, Eye, Package } from "lucide-react";
import { money } from "@/lib/money";

type Order = {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  discount: number;
  customerEmail: string;
  customerName: string;
  phone: string | null;
  itemCount: number;
  couponCode: string | null;
  createdAt: string;
  updatedAt: string;
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  const take = 20;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      params.set("skip", String(skip));
      params.set("take", String(take));
      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (!cancelled && res.ok) {
        const data = await res.json();
        setOrders(data.orders);
        setCount(data.count);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [search, status, skip]);

  const hasFilters = search || status;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-1">Orders</h1>
          <p className="text-on-surface-variant text-sm">{count} orders</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl sticker-border p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSkip(0); }}
              placeholder="Search orders by ID, email, or address..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setSkip(0); }}
            className="rounded-lg border-2 border-outline-variant px-4 py-2.5 text-sm focus:border-primary focus:outline-none bg-white"
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          {hasFilters && (
            <button
              onClick={() => { setSearch(""); setStatus(""); setSkip(0); }}
              className="px-4 py-2.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl sticker-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant text-sm">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={48} strokeWidth={1.5} className="mx-auto mb-4 text-outline-variant" />
            <p className="text-on-surface-variant text-sm">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-high/50">
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Order ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Items</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Total</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-on-surface-variant">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-outline-variant/50 hover:bg-surface-container-high/30 transition">
                    <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{order.id.slice(0, 8)}...</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-xs text-on-surface-variant">{order.customerEmail}</p>
                      {order.phone && <p className="text-xs text-on-surface-variant">{order.phone}</p>}
                    </td>
                    <td className="px-4 py-3">{order.itemCount}</td>
                    <td className="px-4 py-3 font-medium">{money(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                          <Eye size={14} aria-hidden="true" />
                          View
                        </Link>
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
