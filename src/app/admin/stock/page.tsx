"use client";

import { useEffect, useState } from "react";
import { Search, Save, Package, ImageOff, ChevronLeft, ChevronRight, AlertTriangle, XCircle } from "lucide-react";
import { money } from "@/lib/money";

type StockVariant = {
  id: string;
  sku: string;
  price: number;
  stock: number;
  sizeLabel: string;
  colorName: string;
  colorHex: string;
  productId: string;
  productName: string;
  productSlug: string;
  primaryImage: string | null;
};

export default function AdminStockPage() {
  const [variants, setVariants] = useState<StockVariant[]>([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const take = 50;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (stockFilter !== "all") params.set("stockFilter", stockFilter);
      params.set("skip", String(skip));
      params.set("take", String(take));
      const res = await fetch(`/api/admin/stock?${params.toString()}`);
      if (!cancelled && res.ok) {
        const data = await res.json();
        setVariants(data.variants);
        setCount(data.count);
        setEdits({});
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [search, stockFilter, skip]);

  const hasChanges = Object.keys(edits).length > 0;

  async function saveChanges() {
    if (!hasChanges) return;
    setSaving(true);
    const updates = Object.entries(edits).map(([id, stock]) => ({ id, stock }));
    try {
      const res = await fetch("/api/admin/stock", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      if (res.ok) {
        setVariants((prev) =>
          prev.map((v) => (edits[v.id] !== undefined ? { ...v, stock: edits[v.id] } : v))
        );
        setEdits({});
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  function updateStock(variantId: string, value: number) {
    const v = variants.find((x) => x.id === variantId);
    if (!v) return;
    if (value === v.stock) {
      setEdits((prev) => {
        const next = { ...prev };
        delete next[variantId];
        return next;
      });
    } else {
      setEdits((prev) => ({ ...prev, [variantId]: Math.max(0, value) }));
    }
  }

  const hasFilters = search || stockFilter !== "all";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-1">Stock</h1>
          <p className="text-on-surface-variant text-sm">{count} variants</p>
        </div>
        <button
          onClick={saveChanges}
          disabled={!hasChanges || saving}
          className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-5 py-2.5 rounded-full font-label-lg text-label-lg sticker-border hover:scale-[1.01] transition disabled:opacity-50"
        >
          <Save size={18} strokeWidth={2.25} aria-hidden="true" />
          {saving ? "Saving..." : `Save Changes (${Object.keys(edits).length})`}
        </button>
      </div>

      <div className="bg-white rounded-2xl sticker-border p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSkip(0); }}
              placeholder="Search by product name or SKU..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm"
            />
          </div>
          <select
            value={stockFilter}
            onChange={(e) => { setStockFilter(e.target.value as "all" | "low" | "out"); setSkip(0); }}
            className="rounded-lg border-2 border-outline-variant px-4 py-2.5 text-sm focus:border-primary focus:outline-none bg-white"
          >
            <option value="all">All stock</option>
            <option value="low">Low stock (≤5)</option>
            <option value="out">Out of stock</option>
          </select>
          {hasFilters && (
            <button
              onClick={() => { setSearch(""); setStockFilter("all"); setSkip(0); }}
              className="px-4 py-2.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl sticker-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant text-sm">Loading stock...</div>
        ) : variants.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={48} strokeWidth={1.5} className="mx-auto mb-4 text-outline-variant" />
            <p className="text-on-surface-variant text-sm">No variants found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-high/50">
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Variant</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">SKU</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Stock</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((v) => {
                  const displayStock = edits[v.id] !== undefined ? edits[v.id] : v.stock;
                  const isLow = displayStock > 0 && displayStock <= 5;
                  const isOut = displayStock === 0;
                  return (
                    <tr key={v.id} className="border-b border-outline-variant/50 hover:bg-surface-container-high/30 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface-container overflow-hidden relative flex-shrink-0">
                            {v.primaryImage ? (
                              <img src={v.primaryImage} alt={v.productName} className="w-full h-full object-cover" />
                            ) : (
                              <ImageOff size={18} className="absolute inset-0 m-auto text-outline-variant" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold truncate">{v.productName}</p>
                            <p className="text-xs text-on-surface-variant truncate">{v.productSlug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded-full border border-outline-variant" style={{ backgroundColor: v.colorHex }} />
                          <span>{v.colorName}</span>
                          <span className="text-on-surface-variant">·</span>
                          <span>{v.sizeLabel}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{v.sku}</td>
                      <td className="px-4 py-3 font-medium">{money(v.price)}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          value={displayStock}
                          onChange={(e) => updateStock(v.id, Number(e.target.value))}
                          className={`w-20 px-2 py-1 rounded border-2 text-sm focus:border-primary focus:outline-none ${
                            edits[v.id] !== undefined ? "border-primary bg-yellow-50" : "border-outline-variant"
                          }`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700">
                            <XCircle size={12} aria-hidden="true" />
                            Out of stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700">
                            <AlertTriangle size={12} aria-hidden="true" />
                            Low
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                            <AlertTriangle size={12} aria-hidden="true" />
                            OK
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
