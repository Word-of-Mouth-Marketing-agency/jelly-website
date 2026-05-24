"use client";

import { useEffect, useState } from "react";
import { Search, Phone, Mail, FileText, ChevronLeft, ChevronRight } from "lucide-react";

type CustomOrder = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  description: string;
  quantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const STATUS_OPTIONS = ["pending", "in-review", "quoted", "closed"];
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  "in-review": "bg-blue-50 text-blue-700",
  quoted: "bg-purple-50 text-purple-700",
  closed: "bg-gray-100 text-gray-600",
};

export default function AdminCustomOrdersPage() {
  const [requests, setRequests] = useState<CustomOrder[]>([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
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
      const res = await fetch(`/api/admin/custom-orders?${params.toString()}`);
      if (!cancelled && res.ok) {
        const data = await res.json();
        setRequests(data.requests);
        setCount(data.count);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [search, status, skip]);

  async function updateStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/custom-orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
      }
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  }

  const hasFilters = search || status;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-1">Custom Orders</h1>
          <p className="text-on-surface-variant text-sm">{count} requests</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl sticker-border p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSkip(0); }}
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setSkip(0); }}
            className="rounded-lg border-2 border-outline-variant px-4 py-2.5 text-sm focus:border-primary focus:outline-none bg-white"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
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
          <div className="p-12 text-center text-on-surface-variant text-sm">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={48} strokeWidth={1.5} className="mx-auto mb-4 text-outline-variant" />
            <p className="text-on-surface-variant text-sm">No custom order requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-high/50">
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Requester</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Description</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Qty</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-on-surface-variant">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b border-outline-variant/50 hover:bg-surface-container-high/30 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium">{r.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <a href={`mailto:${r.email}`} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                          <Mail size={12} aria-hidden="true" />
                          {r.email}
                        </a>
                        {r.phone && (
                          <a href={`https://wa.me/${r.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline inline-flex items-center gap-1">
                            <Phone size={12} aria-hidden="true" />
                            {r.phone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-on-surface-variant truncate">{r.description}</p>
                    </td>
                    <td className="px-4 py-3">{r.quantity}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={r.status}
                          onChange={(e) => updateStatus(r.id, e.target.value)}
                          disabled={updatingId === r.id}
                          className="text-xs rounded border border-outline-variant px-2 py-1 focus:border-primary focus:outline-none bg-white"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
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
