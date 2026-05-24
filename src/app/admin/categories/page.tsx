"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Archive, ImageOff, Package } from "lucide-react";

type AdminCategory = {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  image: string | null;
  isActive: boolean;
  productCount: number;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [form, setForm] = useState({ nameEn: "", nameAr: "", slug: "", image: "", isActive: true });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      if (!cancelled && res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  function startEdit(category: AdminCategory) {
    setEditing(category);
    setForm({
      nameEn: category.nameEn,
      nameAr: category.nameAr,
      slug: category.slug,
      image: category.image ?? "",
      isActive: category.isActive,
    });
    setMessage("");
  }

  function startCreate() {
    setEditing(null);
    setForm({ nameEn: "", nameAr: "", slug: "", image: "", isActive: true });
    setMessage("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setSaving(true);

    if (!form.nameEn || !form.nameAr || !form.slug) {
      setMessage("Please fill in all required fields.");
      setSaving(false);
      return;
    }

    const url = editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories";
    const method = editing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const refresh = await fetch("/api/admin/categories");
      if (refresh.ok) {
        const data = await refresh.json();
        setCategories(Array.isArray(data) ? data : []);
      }
      setEditing(null);
      setForm({ nameEn: "", nameAr: "", slug: "", image: "", isActive: true });
    } else {
      const data = await res.json().catch(() => ({ error: "Failed to save category." }));
      setMessage(data.error || "Failed to save category.");
    }
    setSaving(false);
  }

  async function archive(id: string) {
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      const refresh = await fetch("/api/admin/categories");
      if (refresh.ok) {
        const data = await refresh.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-1">Categories</h1>
          <p className="text-on-surface-variant text-sm">{categories.length} categories</p>
        </div>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-5 py-2.5 rounded-full font-label-lg text-label-lg sticker-border hover:scale-[1.01] transition"
        >
          <Plus size={18} strokeWidth={2.25} aria-hidden="true" />
          Create category
        </button>
      </div>

      {(editing || !editing && form.nameEn) && (
        <form onSubmit={submit} className="bg-white rounded-2xl sticker-border p-6 mb-6 space-y-4">
          <h2 className="font-headline-md text-headline-md">
            {editing ? "Edit Category" : "New Category"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label>
              <span className="block text-sm font-semibold text-on-surface-variant mb-2">Name (EN) *</span>
              <input
                value={form.nameEn}
                onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none text-sm"
                required
              />
            </label>
            <label>
              <span className="block text-sm font-semibold text-on-surface-variant mb-2">Name (AR) *</span>
              <input
                value={form.nameAr}
                onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))}
                className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none text-sm"
                required
              />
            </label>
            <label>
              <span className="block text-sm font-semibold text-on-surface-variant mb-2">Slug *</span>
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none text-sm"
                placeholder="category-slug"
                required
              />
            </label>
            <label>
              <span className="block text-sm font-semibold text-on-surface-variant mb-2">Image URL</span>
              <input
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none text-sm"
                placeholder="https://..."
              />
            </label>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Active</span>
          </label>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full font-label-lg text-label-lg sticker-border disabled:opacity-60"
            >
              {saving ? "Saving..." : editing ? "Update category" : "Create category"}
            </button>
            <button
              type="button"
              onClick={() => { setEditing(null); setForm({ nameEn: "", nameAr: "", slug: "", image: "", isActive: true }); }}
              className="px-4 py-2.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition"
            >
              Cancel
            </button>
          </div>
          {message && <p className="text-sm text-error bg-error-container rounded-lg px-4 py-2.5">{message}</p>}
        </form>
      )}

      <div className="bg-white rounded-2xl sticker-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant text-sm">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <ImageOff size={48} strokeWidth={1.5} className="mx-auto mb-4 text-outline-variant" />
            <p className="text-on-surface-variant text-sm">No categories found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-high/50">
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Slug</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Products</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-on-surface-variant">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-outline-variant/50 hover:bg-surface-container-high/30 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container overflow-hidden relative flex-shrink-0">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.nameEn} className="w-full h-full object-cover" />
                          ) : (
                            <ImageOff size={18} className="absolute inset-0 m-auto text-outline-variant" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold">{cat.nameEn}</p>
                          <p className="text-xs text-on-surface-variant">{cat.nameAr}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{cat.slug}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Package size={14} aria-hidden="true" />
                        {cat.productCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        cat.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(cat)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                          <Pencil size={14} aria-hidden="true" />
                          Edit
                        </button>
                        <button
                          onClick={() => archive(cat.id)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-error hover:text-error/80 transition"
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
      </div>
    </div>
  );
}
