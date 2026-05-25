"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Pencil, Archive, ChevronLeft, ChevronRight, ImageOff, Star } from "lucide-react";
import { money } from "@/lib/money";

type AdminProduct = {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  category: { id: string; nameEn: string; nameAr: string; slug: string };
  isActive: boolean;
  isFeatured: boolean;
  primaryImage: string | null;
  totalStock: number;
  minPrice: number;
  maxPrice: number;
  variants: Array<{ id: string; price: number; stock: number; sizeLabel: string; colorName: string }>;
  tags: Array<{ nameEn: string; nameAr: string }>;
  createdAt: string;
};

type Category = { id: string; nameEn: string; nameAr: string; slug: string };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [isFeatured, setIsFeatured] = useState<boolean | null>(null);
  const [skip, setSkip] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [archivePending, setArchivePending] = useState<string | null>(null);
  const take = 20;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (categoryId) params.set("categoryId", categoryId);
      if (isActive !== null) params.set("isActive", String(isActive));
      if (isFeatured !== null) params.set("isFeatured", String(isFeatured));
      params.set("skip", String(skip));
      params.set("take", String(take));

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      if (!cancelled && res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setCount(data.count);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [search, categoryId, isActive, isFeatured, skip]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setCategories(Array.isArray(data) ? data : []);
      });
    return () => { cancelled = true; };
  }, []);

  async function archive(id: string) {
    setArchivePending(id);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setCount((c) => c - 1);
    }
    setArchivePending(null);
  }

  const hasFilters = search || categoryId || isActive !== null || isFeatured !== null;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-1">Products</h1>
          <p className="text-on-surface-variant text-sm">{count} products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-5 py-2.5 rounded-full font-label-lg text-label-lg sticker-border hover:scale-[1.01] transition"
        >
          <Plus size={18} strokeWidth={2.25} aria-hidden="true" />
          Create product
        </Link>
      </div>

      <div className="bg-white rounded-2xl sticker-border p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSkip(0); }}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm"
            />
          </div>
          <select
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); setSkip(0); }}
            className="rounded-lg border-2 border-outline-variant px-4 py-2.5 text-sm focus:border-primary focus:outline-none bg-white"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nameEn}</option>
            ))}
          </select>
          <select
            value={isActive === null ? "" : String(isActive)}
            onChange={(e) => { setIsActive(e.target.value === "" ? null : e.target.value === "true"); setSkip(0); }}
            className="rounded-lg border-2 border-outline-variant px-4 py-2.5 text-sm focus:border-primary focus:outline-none bg-white"
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select
            value={isFeatured === null ? "" : String(isFeatured)}
            onChange={(e) => { setIsFeatured(e.target.value === "" ? null : e.target.value === "true"); setSkip(0); }}
            className="rounded-lg border-2 border-outline-variant px-4 py-2.5 text-sm focus:border-primary focus:outline-none bg-white"
          >
            <option value="">All features</option>
            <option value="true">Featured</option>
            <option value="false">Not featured</option>
          </select>
          {hasFilters && (
            <button
              onClick={() => { setSearch(""); setCategoryId(""); setIsActive(null); setIsFeatured(null); setSkip(0); }}
              className="px-4 py-2.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl sticker-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant text-sm">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <ImageOff size={48} strokeWidth={1.5} className="mx-auto mb-4 text-outline-variant" />
            <p className="text-on-surface-variant text-sm">No products found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-high/50">
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Stock</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-on-surface-variant">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-outline-variant/50 hover:bg-surface-container-high/30 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                          {product.primaryImage ? (
                            <>
                              <img
                                src={product.primaryImage}
                                alt={product.nameEn}
                                className="w-full h-full object-cover absolute inset-0 z-10"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                              <ImageOff size={18} className="text-outline-variant" />
                            </>
                          ) : (
                            <ImageOff size={18} className="text-outline-variant" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold truncate">{product.nameEn}</p>
                          <p className="text-xs text-on-surface-variant truncate">{product.slug}</p>
                          {product.isFeatured && (
                            <span className="inline-flex items-center gap-1 text-xs text-yellow-700 bg-yellow-50 px-1.5 py-0.5 rounded mt-0.5">
                              <Star size={10} fill="currentColor" /> Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{product.category.nameEn}</td>
                    <td className="px-4 py-3 font-medium">
                      {product.minPrice === product.maxPrice
                        ? money(product.minPrice)
                        : `${money(product.minPrice)} - ${money(product.maxPrice)}`}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${product.totalStock <= 5 ? "text-red-700" : product.totalStock === 0 ? "text-on-surface-variant" : ""}`}>
                        {product.totalStock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        product.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                          <Pencil size={14} aria-hidden="true" />
                          Edit
                        </Link>
                        <button
                          onClick={() => archive(product.id)}
                          disabled={archivePending === product.id}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-error hover:text-error/80 transition disabled:opacity-50"
                        >
                          <Archive size={14} aria-hidden="true" />
                          Archive
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
