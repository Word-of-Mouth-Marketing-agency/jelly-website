import { prisma } from "./prisma";

// ─── Shared Types ─────────────────────────────────────────────────────────────

export type ProductSummary = {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  categorySlug: string;
  categoryNameEn: string;
  categoryNameAr: string;
  primaryImage: string | null;
  altEn: string | null;
  minPrice: string;
  maxPrice: string;
  tags: Array<{ nameEn: string; nameAr: string }>;
  isFeatured: boolean;
  inStock: boolean;
};

export type ProductDetail = {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  slug: string;
  category: {
    id: string;
    slug: string;
    nameEn: string;
    nameAr: string;
  };
  images: Array<{
    id: string;
    url: string;
    altEn: string | null;
    altAr: string | null;
    isPrimary: boolean;
    position: number;
  }>;
  variants: Array<{
    id: string;
    price: string;
    stock: number;
    sku: string;
    size: { id: string; label: string };
    color: { id: string; nameEn: string; nameAr: string; hex: string };
  }>;
  tags: Array<{ nameEn: string; nameAr: string }>;
  isFeatured: boolean;
  minPrice: string;
  maxPrice: string;
};

export type CategoryInfo = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  image: string | null;
  productCount: number;
};

// ─── Internal Helpers ─────────────────────────────────────────────────────────

function fmt(val: { toString(): string }): string {
  return `$${parseFloat(val.toString()).toFixed(2)}`;
}

function priceRange(prices: Array<{ toString(): string }>): {
  min: string;
  max: string;
} {
  if (!prices.length) return { min: "$0.00", max: "$0.00" };
  const nums = prices.map((p) => parseFloat(p.toString()));
  return {
    min: `$${Math.min(...nums).toFixed(2)}`,
    max: `$${Math.max(...nums).toFixed(2)}`,
  };
}

function toSummary(p: {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  isFeatured: boolean;
  images: Array<{ url: string; altEn: string | null }>;
  variants: Array<{ price: { toString(): string }; stock: number }>;
  tags: Array<{ tag: { nameEn: string; nameAr: string } }>;
  category: { slug: string; nameEn: string; nameAr: string };
}): ProductSummary {
  const { min, max } = priceRange(p.variants.map((v) => v.price));
  const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);
  return {
    id: p.id,
    nameEn: p.nameEn,
    nameAr: p.nameAr,
    slug: p.slug,
    categorySlug: p.category.slug,
    categoryNameEn: p.category.nameEn,
    categoryNameAr: p.category.nameAr,
    primaryImage: p.images[0]?.url ?? null,
    altEn: p.images[0]?.altEn ?? null,
    minPrice: min,
    maxPrice: max,
    tags: p.tags.map((t) => ({
      nameEn: t.tag.nameEn,
      nameAr: t.tag.nameAr,
    })),
    isFeatured: p.isFeatured,
    inStock: totalStock > 0,
  };
}

// ─── Prisma include shapes ────────────────────────────────────────────────────

const summaryInclude = {
  images: {
    orderBy: [{ isPrimary: "desc" as const }, { position: "asc" as const }],
    take: 1,
  },
  variants: { select: { price: true, stock: true } },
  tags: { include: { tag: true } },
  category: { select: { slug: true, nameEn: true, nameAr: true } },
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<CategoryInfo[]> {
  const rows = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
    orderBy: { nameEn: "asc" },
  });
  return rows.map((c) => ({
    id: c.id,
    slug: c.slug,
    nameEn: c.nameEn,
    nameAr: c.nameAr,
    image: c.image ?? null,
    productCount: c._count.products,
  }));
}

export async function getCategoryBySlug(
  slug: string
): Promise<CategoryInfo | null> {
  const c = await prisma.category.findFirst({
    where: { slug, isActive: true },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
  if (!c) return null;
  return {
    id: c.id,
    slug: c.slug,
    nameEn: c.nameEn,
    nameAr: c.nameAr,
    image: c.image ?? null,
    productCount: c._count.products,
  };
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<ProductSummary[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true, category: { slug: categorySlug } },
    include: summaryInclude,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(toSummary);
}

export async function getProductBySlug(
  slug: string
): Promise<ProductDetail | null> {
  const p = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: {
        orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
      },
      variants: {
        include: { size: true, color: true },
        orderBy: [{ color: { nameEn: "asc" } }, { size: { label: "asc" } }],
      },
      tags: { include: { tag: true } },
    },
  });
  if (!p) return null;

  const { min, max } = priceRange(p.variants.map((v) => v.price));

  return {
    id: p.id,
    nameEn: p.nameEn,
    nameAr: p.nameAr,
    descriptionEn: p.descriptionEn,
    descriptionAr: p.descriptionAr,
    slug: p.slug,
    category: {
      id: p.category.id,
      slug: p.category.slug,
      nameEn: p.category.nameEn,
      nameAr: p.category.nameAr,
    },
    images: p.images.map((img) => ({
      id: img.id,
      url: img.url,
      altEn: img.altEn,
      altAr: img.altAr,
      isPrimary: img.isPrimary,
      position: img.position,
    })),
    variants: p.variants.map((v) => ({
      id: v.id,
      price: fmt(v.price),
      stock: v.stock,
      sku: v.sku,
      size: { id: v.size.id, label: v.size.label },
      color: {
        id: v.color.id,
        nameEn: v.color.nameEn,
        nameAr: v.color.nameAr,
        hex: v.color.hex,
      },
    })),
    tags: p.tags.map((t) => ({ nameEn: t.tag.nameEn, nameAr: t.tag.nameAr })),
    isFeatured: p.isFeatured,
    minPrice: min,
    maxPrice: max,
  };
}

export async function getRelatedProducts(
  currentProductId: string,
  categoryId: string,
  limit = 4
): Promise<ProductSummary[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true, categoryId, id: { not: currentProductId } },
    take: limit,
    include: summaryInclude,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(toSummary);
}

export async function getFeaturedProducts(limit = 8): Promise<ProductSummary[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    take: limit,
    include: summaryInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toSummary);
}
