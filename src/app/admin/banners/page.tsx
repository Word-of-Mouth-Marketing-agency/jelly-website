"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight, Pencil, X, Check, ArrowUp, ArrowDown, Image, ImageOff } from "lucide-react";

type Banner = {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string | null;
  subtitleAr: string | null;
  imageUrl: string;
  linkUrl: string | null;
  isActive: boolean;
  position: number;
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [subtitleEn, setSubtitleEn] = useState("");
  const [subtitleAr, setSubtitleAr] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [position, setPosition] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadBanners();
  }, []);

  async function loadBanners() {
    setLoading(true);
    const res = await fetch("/api/admin/banners");
    if (res.ok) {
      const data = await res.json();
      setBanners(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  }

  function resetForm() {
    setTitleEn("");
    setTitleAr("");
    setSubtitleEn("");
    setSubtitleAr("");
    setImageUrl("");
    setLinkUrl("");
    setPosition("0");
    setIsActive(true);
    setFormError("");
    setEditingId(null);
  }

  function startEdit(banner: Banner) {
    setEditingId(banner.id);
    setTitleEn(banner.titleEn);
    setTitleAr(banner.titleAr);
    setSubtitleEn(banner.subtitleEn ?? "");
    setSubtitleAr(banner.subtitleAr ?? "");
    setImageUrl(banner.imageUrl);
    setLinkUrl(banner.linkUrl ?? "");
    setPosition(String(banner.position));
    setIsActive(banner.isActive);
    setShowForm(true);
    setFormError("");
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    const payload = {
      titleEn: titleEn.trim(),
      titleAr: titleAr.trim(),
      subtitleEn: subtitleEn.trim() || undefined,
      subtitleAr: subtitleAr.trim() || undefined,
      imageUrl: imageUrl.trim(),
      linkUrl: linkUrl.trim() || undefined,
      position: Number(position),
      isActive,
    };

    try {
      const url = editingId ? `/api/admin/banners/${editingId}` : "/api/admin/banners";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        resetForm();
        setShowForm(false);
        await loadBanners();
      } else {
        const data = await res.json().catch(() => ({}));
        setFormError(data.error || "Failed to save banner");
      }
    } catch {
      setFormError("Failed to save banner");
    } finally {
      setFormLoading(false);
    }
  }

  async function toggleActive(banner: Banner) {
    const res = await fetch(`/api/admin/banners/${banner.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !banner.isActive }),
    });
    if (res.ok) {
      setBanners((prev) => prev.map((b) => (b.id === banner.id ? { ...b, isActive: !b.isActive } : b)));
    }
  }

  async function deleteBanner(banner: Banner) {
    if (!confirm(`Delete banner "${banner.titleEn}"?`)) return;
    const res = await fetch(`/api/admin/banners/${banner.id}`, { method: "DELETE" });
    if (res.ok) {
      setBanners((prev) => prev.filter((b) => b.id !== banner.id));
    }
  }

  async function movePosition(banner: Banner, direction: "up" | "down") {
    const currentIndex = banners.findIndex((b) => b.id === banner.id);
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === banners.length - 1) return;

    const newPosition = direction === "up" ? banner.position - 1 : banner.position + 1;
    const res = await fetch(`/api/admin/banners/${banner.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ position: newPosition }),
    });
    if (res.ok) {
      await loadBanners();
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-1">Banners</h1>
          <p className="text-on-surface-variant text-sm">{banners.length} banners</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm((s) => !s); }}
          className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-5 py-2.5 rounded-full font-label-lg text-label-lg sticker-border hover:scale-[1.01] transition"
        >
          {showForm ? <X size={18} strokeWidth={2.25} aria-hidden="true" /> : <Plus size={18} strokeWidth={2.25} aria-hidden="true" />}
          {showForm ? "Cancel" : "Create banner"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl sticker-border p-6 mb-6">
          <h2 className="font-bold text-on-surface mb-4">{editingId ? "Edit Banner" : "Create Banner"}</h2>
          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{formError}</div>
          )}
          <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">Title (EN)</label>
              <input
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">Title (AR)</label>
              <input
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">Subtitle (EN)</label>
              <input
                value={subtitleEn}
                onChange={(e) => setSubtitleEn(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">Subtitle (AR)</label>
              <input
                value={subtitleAr}
                onChange={(e) => setSubtitleAr(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm"
                dir="rtl"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">Image URL</label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">Link URL</label>
              <input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm"
                placeholder="/en/category/men or https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">Position</label>
              <input
                type="number"
                min={0}
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 border-outline-variant focus:border-primary focus:outline-none text-sm"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-4">
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
                {formLoading ? "Saving..." : editingId ? "Update Banner" : "Create Banner"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl sticker-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant text-sm">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center">
            <Image size={48} strokeWidth={1.5} className="mx-auto mb-4 text-outline-variant" />
            <p className="text-on-surface-variant text-sm">No banners found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-high/50">
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Image</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Link</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Position</th>
                  <th className="text-left px-4 py-3 font-semibold text-on-surface-variant">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-on-surface-variant">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((b) => (
                  <tr key={b.id} className="border-b border-outline-variant/50 hover:bg-surface-container-high/30 transition">
                    <td className="px-4 py-3">
                      <div className="w-16 h-10 rounded-lg bg-surface-container overflow-hidden relative">
                        {b.imageUrl ? (
                          <img src={b.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageOff size={18} className="absolute inset-0 m-auto text-outline-variant" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{b.titleEn}</p>
                      <p className="text-xs text-on-surface-variant" dir="rtl">{b.titleAr}</p>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant truncate max-w-[200px]">
                      {b.linkUrl || "—"}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{b.position}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        b.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {b.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => movePosition(b, "up")}
                          className="p-1.5 rounded hover:bg-surface-container-high transition"
                          title="Move up"
                        >
                          <ArrowUp size={16} className="text-on-surface-variant" />
                        </button>
                        <button
                          onClick={() => movePosition(b, "down")}
                          className="p-1.5 rounded hover:bg-surface-container-high transition"
                          title="Move down"
                        >
                          <ArrowDown size={16} className="text-on-surface-variant" />
                        </button>
                        <button
                          onClick={() => toggleActive(b)}
                          className="p-1.5 rounded hover:bg-surface-container-high transition"
                          title={b.isActive ? "Deactivate" : "Activate"}
                        >
                          {b.isActive ? <ToggleRight size={18} className="text-green-700" /> : <ToggleLeft size={18} className="text-gray-400" />}
                        </button>
                        <button
                          onClick={() => startEdit(b)}
                          className="p-1.5 rounded hover:bg-surface-container-high transition"
                          title="Edit"
                        >
                          <Pencil size={16} className="text-primary" />
                        </button>
                        <button
                          onClick={() => deleteBanner(b)}
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
