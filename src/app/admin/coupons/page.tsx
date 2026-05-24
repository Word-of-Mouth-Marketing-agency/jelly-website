"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Trash2, ToggleLeft, ToggleRight, Pencil, X, Check, Tag } from "lucide-react";
import { money } from "@/lib/money";

type Coupon = {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrder: number | null;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [value, setValue] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadCoupons();
  }, []);

  async function loadCoupons() {
    setLoading(true);
    const res = await fetch("/api/admin/coupons");
    if (res.ok) {
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  }

  function resetForm() {
    setCode("");
    setType("PERCENTAGE");
    setValue("");
    setMinOrder("");
    setMaxUses("");
    setExpiresAt("");
    setIsActive(true);
    setFormError("");
    setEditingId(null);
  }

  function startEdit(coupon: Coupon) {
    setEditingId(coupon.id);
    setCode(coupon.code);
    setType(coupon.type);
    setValue(String(coupon.value));
    setMinOrder(coupon.minOrder ? String(coupon.minOrder) : "");
    setMaxUses(coupon.maxUses ? String(coupon.maxUses) : "");
    setExpiresAt(coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "");
    setIsActive(coupon.isActive);
    setShowForm(true);
    setFormError("");
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    const payload = {
      code: code.trim(),
      type,
      value: Number(value),
      minOrder: minOrder ? Number(minOrder) : null,
      maxUses: maxUses ? Number(maxUses) : null,
      expiresAt: expiresAt ? expiresAt : null,
      isActive,
    };

    try {
      const url = editingId ? `/api/admin/coupons/${editingId}` : "/api/admin/coupons";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        resetForm();
        setShowForm(false);
        await loadCoupons();
      } else {
        const data = await res.json().catch(() => ({}));
        setFormError(data.error || "Failed to save coupon");
      }
    } catch {
      setFormError("Failed to save coupon");
    } finally {
      setFormLoading(false);
    }
  }

  async function toggleActive(coupon: Coupon) {
    const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !coupon.isActive }),
    });
    if (res.ok) {
      setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? { ...c, isActive: !c.isActive } : c)));
    }
  }

  async function deleteCoupon(coupon: Coupon) {
    if (!confirm(`Delete coupon "${coupon.code}"?`)) return;
    const res = await fetch(`/api/admin/coupons/${coupon.id}`, { method: "DELETE" });
    if (res.ok) {
      setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
    }
  }

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-1">Coupons</h1>
          <p className="text-on-surface-variant text-sm">{coupons.length} coupons</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm((s) => !s); }}
          className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-5 py-2.5 rounded-full font-label-lg text-label-lg sticker-border hover:scale-[1.01] transition"
        >
          {showForm ? <X size={18} strokeWidth={2.25} aria-hidden="true" /> : <Plus size={18} strokeWidth={2.25} aria-hidden="true" />}
          {showForm ? "Cancel" : "Create coupon"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl sticker-border p-6 mb-6">
          <h2 className="font-bold text-on-surface mb-4">{editingId ? "Edit Coupon" : "Create Coupon"}</h2>
          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{formError}</div>
          )}
          <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">Code</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm"
                placeholder="SUMMER2024"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "PERCENTAGE" | "FIXED")}
                className="w-full px-3 py-2 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm bg-white"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">Value</label>
              <input
                type="number"
                min={0.01}
                step={type === "PERCENTAGE" ? 1 : 0.01}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm"
                placeholder={type === "PERCENTAGE" ? "20" : "10.00"}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">Min Order</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">Max Uses</label>
              <input
                type="number"
                min={1}
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm"
                placeholder="Unlimited"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">Expires At</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-outline-variant"
                />
                Active
              </label>
              <button
                type="submit"
                disabled={formLoading}
                className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-5 py-2 rounded-full font-label-lg text-label-lg sticker-border hover:scale-[1.01] transition disabled:opacity-50 ml-auto"
              >
                <Check size={16} aria-hidden="true" />
                {formLoading ? "Saving..." : editingId ? "Update Coupon" : "Create Coupon"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl sticker-border p-4 mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coupons..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl sticker-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant text-sm">Loading coupons...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Tag size={48} strokeWidth={1.5} className="mx-auto mb-4 text-outline-variant" />
            <p className="text-on-surface-variant text-sm">No coupons found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-high/50">
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Code</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Value</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Min Order</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Uses</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Expires</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-on-surface-variant">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-outline-variant/50 hover:bg-surface-container-high/30 transition">
                    <td className="px-4 py-3 font-bold">{c.code}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{c.type === "PERCENTAGE" ? "%" : "Fixed"}</td>
                    <td className="px-4 py-3 font-medium">
                      {c.type === "PERCENTAGE" ? `${c.value}%` : money(c.value)}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{c.minOrder ? money(c.minOrder) : "—"}</td>
                    <td className="px-4 py-3 text-on-surface-variant">
                      {c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">
                      {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        c.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleActive(c)}
                          className="p-1.5 rounded hover:bg-surface-container-high transition"
                          title={c.isActive ? "Deactivate" : "Activate"}
                        >
                          {c.isActive ? <ToggleRight size={18} className="text-green-700" /> : <ToggleLeft size={18} className="text-gray-400" />}
                        </button>
                        <button
                          onClick={() => startEdit(c)}
                          className="p-1.5 rounded hover:bg-surface-container-high transition"
                          title="Edit"
                        >
                          <Pencil size={16} className="text-primary" />
                        </button>
                        <button
                          onClick={() => deleteCoupon(c)}
                          className="p-1.5 rounded hover:bg-surface-container-high transition"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-error" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
