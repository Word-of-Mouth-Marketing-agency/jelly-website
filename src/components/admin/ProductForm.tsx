"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Star, ImageOff } from "lucide-react";

type Category = { id: string; nameEn: string; nameAr: string; slug: string };
type Tag = { id: string; nameEn: string; nameAr: string };
type Size = { id: string; label: string };
type Color = { id: string; nameEn: string; nameAr: string; hex: string };

type ProductImage = { id?: string; url: string; altEn?: string; altAr?: string; isPrimary?: boolean; position?: number };

type ProductVariant = { id?: string; sizeId: string; colorId: string; price: number; stock: number; sku: string };

const emptyProduct = {
  nameEn: "",
  nameAr: "",
  slug: "",
  descriptionEn: "",
  descriptionAr: "",
  categoryId: "",
  isActive: true,
  isFeatured: false,
  images: [{ url: "", altEn: "", altAr: "", isPrimary: true, position: 0 }] as ProductImage[],
  tags: [] as string[],
  variants: [{ sizeId: "", colorId: "", price: 0, stock: 0, sku: "" }] as ProductVariant[],
};

export default function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ ...emptyProduct });
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch("/api/admin/tags").then((r) => r.json()),
      fetch("/api/admin/sizes").then((r) => r.json()),
      fetch("/api/admin/colors").then((r) => r.json()),
    ]).then(([catRes, tagRes, sizeRes, colorRes]) => {
      setCategories(Array.isArray(catRes) ? catRes : []);
      setTags(Array.isArray(tagRes) ? tagRes : []);
      setSizes(Array.isArray(sizeRes) ? sizeRes : []);
      setColors(Array.isArray(colorRes) ? colorRes : []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/admin/products/${productId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
          return;
        }
        setForm({
          nameEn: data.nameEn ?? "",
          nameAr: data.nameAr ?? "",
          slug: data.slug ?? "",
          descriptionEn: data.descriptionEn ?? "",
          descriptionAr: data.descriptionAr ?? "",
          categoryId: data.categoryId ?? "",
          isActive: data.isActive ?? true,
          isFeatured: data.isFeatured ?? false,
          images: data.images?.length
            ? data.images.map((img: ProductImage, i: number) => ({
                id: img.id,
                url: img.url,
                altEn: img.altEn ?? "",
                altAr: img.altAr ?? "",
                isPrimary: img.isPrimary ?? i === 0,
                position: img.position ?? i,
              }))
            : [{ url: "", altEn: "", altAr: "", isPrimary: true, position: 0 }],
          tags: data.tags?.map((t: Tag) => t.id) ?? [],
          variants: data.variants?.length
            ? data.variants.map((v: ProductVariant) => ({
                id: v.id,
                sizeId: v.sizeId,
                colorId: v.colorId,
                price: v.price,
                stock: v.stock,
                sku: v.sku,
              }))
            : [{ sizeId: "", colorId: "", price: 0, stock: 0, sku: "" }],
        });
      });
  }, [productId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setSaving(true);

    const payload = {
      ...form,
      images: form.images.filter((img) => img.url.trim()),
      variants: form.variants.map((v) => ({ ...v, price: Number(v.price), stock: Number(v.stock) })),
    };

    if (!payload.nameEn || !payload.nameAr || !payload.slug || !payload.categoryId) {
      setMessage("Please fill in all required fields.");
      setSaving(false);
      return;
    }

    if (payload.images.length === 0) {
      setMessage("Please add at least one image URL.");
      setSaving(false);
      return;
    }

    if (payload.variants.length === 0 || payload.variants.some((v) => !v.sizeId || !v.colorId || !v.sku)) {
      setMessage("Please fill in all variant fields.");
      setSaving(false);
      return;
    }

    const url = productId ? `/api/admin/products/${productId}` : "/api/admin/products";
    const method = productId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({ error: "Failed to save product." }));
      setMessage(data.error || "Failed to save product.");
    }
    setSaving(false);
  }

  function addImage() {
    setForm((f) => ({
      ...f,
      images: [...f.images, { url: "", altEn: "", altAr: "", isPrimary: false, position: f.images.length }],
    }));
  }

  function removeImage(index: number) {
    setForm((f) => {
      const imgs = f.images.filter((_, i) => i !== index);
      if (imgs.length === 1) imgs[0].isPrimary = true;
      return { ...f, images: imgs };
    });
  }

  function addVariant() {
    setForm((f) => ({
      ...f,
      variants: [...f.variants, { sizeId: "", colorId: "", price: 0, stock: 0, sku: "" }],
    }));
  }

  function removeVariant(index: number) {
    setForm((f) => ({
      ...f,
      variants: f.variants.filter((_, i) => i !== index),
    }));
  }

  if (loading) {
    return <div className="p-12 text-center text-on-surface-variant text-sm">Loading...</div>;
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl sticker-border p-6 space-y-4">
          <h2 className="font-headline-md text-headline-md">Basic Info</h2>
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
          </div>

          <label>
            <span className="block text-sm font-semibold text-on-surface-variant mb-2">Slug *</span>
            <input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none text-sm"
              placeholder="product-slug"
              required
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label>
              <span className="block text-sm font-semibold text-on-surface-variant mb-2">Category *</span>
              <select
                value={form.categoryId}
                onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none text-sm bg-white"
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.nameEn}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="block text-sm font-semibold text-on-surface-variant mb-2">Tags</span>
              <select
                multiple
                value={form.tags}
                onChange={(e) => {
                  const opts = Array.from(e.target.selectedOptions).map((o) => o.value);
                  setForm((f) => ({ ...f, tags: opts }));
                }}
                className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none text-sm bg-white min-h-[80px]"
              >
                {tags.map((t) => (
                  <option key={t.id} value={t.id}>{t.nameEn}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium flex items-center gap-1">
                <Star size={14} aria-hidden="true" /> Featured
              </span>
            </label>
          </div>
        </section>

        <section className="bg-white rounded-2xl sticker-border p-6 space-y-4">
          <h2 className="font-headline-md text-headline-md">Descriptions</h2>
          <label>
            <span className="block text-sm font-semibold text-on-surface-variant mb-2">Description (EN)</span>
            <textarea
              value={form.descriptionEn}
              onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none text-sm"
            />
          </label>
          <label>
            <span className="block text-sm font-semibold text-on-surface-variant mb-2">Description (AR)</span>
            <textarea
              value={form.descriptionAr}
              onChange={(e) => setForm((f) => ({ ...f, descriptionAr: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none text-sm"
            />
          </label>
        </section>
      </div>

      <section className="bg-white rounded-2xl sticker-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md">Images</h2>
          <button
            type="button"
            onClick={addImage}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            <Plus size={14} aria-hidden="true" /> Add image
          </button>
        </div>
        <div className="space-y-3">
          {form.images.map((img, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto_auto] gap-3 items-end">
              <label className="flex-1">
                <span className="block text-xs font-semibold text-on-surface-variant mb-1">Image URL</span>
                <input
                  value={img.url}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((f) => ({
                      ...f,
                      images: f.images.map((im, idx) => (idx === i ? { ...im, url: val } : im)),
                    }));
                  }}
                  className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none text-sm"
                  placeholder="https://..."
                />
              </label>
              <label className="w-full md:w-32">
                <span className="block text-xs font-semibold text-on-surface-variant mb-1">Alt (EN)</span>
                <input
                  value={img.altEn}
                  onChange={(e) => setForm((f) => ({
                    ...f,
                    images: f.images.map((im, idx) => (idx === i ? { ...im, altEn: e.target.value } : im)),
                  }))}
                  className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none text-sm"
                />
              </label>
              <div className="flex items-center gap-2 pb-3">
                <label className="flex items-center gap-1 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="primaryImage"
                    checked={img.isPrimary}
                    onChange={() => setForm((f) => ({
                      ...f,
                      images: f.images.map((im, idx) => ({ ...im, isPrimary: idx === i })),
                    }))}
                    className="w-4 h-4"
                  />
                  Primary
                </label>
              </div>
              {form.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="p-2 text-error hover:bg-error-container rounded-lg transition pb-3"
                  title="Remove"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              )}
              {img.url && (
                <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden hidden md:block relative flex items-center justify-center">
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover absolute inset-0 z-10"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <ImageOff size={18} className="text-outline-variant" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl sticker-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md">Variants</h2>
          <button
            type="button"
            onClick={addVariant}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            <Plus size={14} aria-hidden="true" /> Add variant
          </button>
        </div>
        <div className="space-y-3">
          {form.variants.map((v, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 items-end">
              <label>
                <span className="block text-xs font-semibold text-on-surface-variant mb-1">Size</span>
                <select
                  value={v.sizeId}
                  onChange={(e) => setForm((f) => ({
                    ...f,
                    variants: f.variants.map((vr, idx) => (idx === i ? { ...vr, sizeId: e.target.value } : vr)),
                  }))}
                  className="w-full rounded-lg border-2 border-outline-variant px-3 py-2.5 focus:border-primary focus:outline-none text-sm bg-white"
                >
                  <option value="">Size</option>
                  {sizes.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="block text-xs font-semibold text-on-surface-variant mb-1">Color</span>
                <select
                  value={v.colorId}
                  onChange={(e) => setForm((f) => ({
                    ...f,
                    variants: f.variants.map((vr, idx) => (idx === i ? { ...vr, colorId: e.target.value } : vr)),
                  }))}
                  className="w-full rounded-lg border-2 border-outline-variant px-3 py-2.5 focus:border-primary focus:outline-none text-sm bg-white"
                >
                  <option value="">Color</option>
                  {colors.map((c) => (
                    <option key={c.id} value={c.id}>{c.nameEn}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="block text-xs font-semibold text-on-surface-variant mb-1">Price</span>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={v.price}
                  onChange={(e) => setForm((f) => ({
                    ...f,
                    variants: f.variants.map((vr, idx) => (idx === i ? { ...vr, price: Number(e.target.value) } : vr)),
                  }))}
                  className="w-full rounded-lg border-2 border-outline-variant px-3 py-2.5 focus:border-primary focus:outline-none text-sm"
                />
              </label>
              <label>
                <span className="block text-xs font-semibold text-on-surface-variant mb-1">Stock</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={v.stock}
                  onChange={(e) => setForm((f) => ({
                    ...f,
                    variants: f.variants.map((vr, idx) => (idx === i ? { ...vr, stock: Number(e.target.value) } : vr)),
                  }))}
                  className="w-full rounded-lg border-2 border-outline-variant px-3 py-2.5 focus:border-primary focus:outline-none text-sm"
                />
              </label>
              <label>
                <span className="block text-xs font-semibold text-on-surface-variant mb-1">SKU</span>
                <input
                  value={v.sku}
                  onChange={(e) => setForm((f) => ({
                    ...f,
                    variants: f.variants.map((vr, idx) => (idx === i ? { ...vr, sku: e.target.value } : vr)),
                  }))}
                  className="w-full rounded-lg border-2 border-outline-variant px-3 py-2.5 focus:border-primary focus:outline-none text-sm"
                />
              </label>
              {form.variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="p-2 text-error hover:bg-error-container rounded-lg transition"
                  title="Remove"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-label-lg text-label-lg sticker-border disabled:opacity-60"
        >
          {saving ? "Saving..." : productId ? "Update product" : "Create product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-6 py-3 rounded-full font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition"
        >
          Cancel
        </button>
      </div>
      {message && (
        <p className="text-sm text-error bg-error-container rounded-lg px-4 py-2.5">{message}</p>
      )}
    </form>
  );
}
