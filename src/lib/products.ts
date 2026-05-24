import { prisma } from "./prisma";
import type { Prisma } from "@/generated/prisma/client";

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
  minPriceValue: number;
  maxPriceValue: number;
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

export type ProductSearchFilters = {
  q?: string;
  category?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-low" | "price-high" | "name";
};

export type CatalogFilterOptions = {
  categories: CategoryInfo[];
  colors: Array<{ id: string; nameEn: string; nameAr: string; hex: string }>;
  sizes: Array<{ id: string; label: string }>;
};

// ─── Internal Helpers ─────────────────────────────────────────────────────────

function fmt(val: { toString(): string }): string {
  return `$${parseFloat(val.toString()).toFixed(2)}`;
}

function priceRange(prices: Array<{ toString(): string }>): {
  min: string;
  max: string;
  minValue: number;
  maxValue: number;
} {
  if (!prices.length) {
    return { min: "$0.00", max: "$0.00", minValue: 0, maxValue: 0 };
  }
  const nums = prices.map((p) => parseFloat(p.toString()));
  const minValue = Math.min(...nums);
  const maxValue = Math.max(...nums);
  return {
    min: `$${minValue.toFixed(2)}`,
    max: `$${maxValue.toFixed(2)}`,
    minValue,
    maxValue,
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
  const { min, max, minValue, maxValue } = priceRange(
    p.variants.map((v) => v.price)
  );
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
    minPriceValue: minValue,
    maxPriceValue: maxValue,
    tags: p.tags.map((t) => ({
      nameEn: t.tag.nameEn,
      nameAr: t.tag.nameAr,
    })),
    isFeatured: p.isFeatured,
    inStock: totalStock > 0,
  };
}

function parseSearchTerm(value?: string) {
  const term = value?.trim();
  return term ? term.slice(0, 80) : undefined;
}

function buildProductWhere(filters: ProductSearchFilters) {
  const q = parseSearchTerm(filters.q);
  const and: Prisma.ProductWhereInput[] = [{ isActive: true }];

  if (q) {
    const textFilter = { contains: q, mode: "insensitive" as const };
    and.push({
      OR: [
        { nameEn: textFilter },
        { nameAr: textFilter },
        { descriptionEn: textFilter },
        { descriptionAr: textFilter },
        { slug: textFilter },
        { category: { nameEn: textFilter } },
        { category: { nameAr: textFilter } },
        { category: { slug: textFilter } },
        { variants: { some: { color: { nameEn: textFilter } } } },
        { variants: { some: { color: { nameAr: textFilter } } } },
        { tags: { some: { tag: { nameEn: textFilter } } } },
        { tags: { some: { tag: { nameAr: textFilter } } } },
      ],
    });
  }

  if (filters.category) {
    and.push({ category: { slug: filters.category } });
  }

  if (filters.color) {
    and.push({ variants: { some: { colorId: filters.color } } });
  }

  if (filters.size) {
    and.push({ variants: { some: { sizeId: filters.size } } });
  }

  const price: Prisma.DecimalFilter<"Variant"> = {};
  if (typeof filters.minPrice === "number") price.gte = filters.minPrice;
  if (typeof filters.maxPrice === "number") price.lte = filters.maxPrice;
  if (Object.keys(price).length > 0) {
    and.push({ variants: { some: { price } } });
  }

  return { AND: and };
}

function sortProducts(
  products: ProductSummary[],
  sort: ProductSearchFilters["sort"]
) {
  if (sort === "price-low") {
    return products.sort((a, b) => a.minPriceValue - b.minPriceValue);
  }
  if (sort === "price-high") {
    return products.sort((a, b) => b.maxPriceValue - a.maxPriceValue);
  }
  if (sort === "name") {
    return products.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
  }
  return products;
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

export async function searchProducts(
  filters: ProductSearchFilters
): Promise<ProductSummary[]> {
  const rows = await prisma.product.findMany({
    where: buildProductWhere(filters),
    include: summaryInclude,
    orderBy: [{ createdAt: "desc" }],
  });

  return sortProducts(rows.map(toSummary), filters.sort ?? "newest");
}

export async function getCatalogFilterOptions(): Promise<CatalogFilterOptions> {
  const [categories, colors, sizes] = await Promise.all([
    getCategories(),
    prisma.color.findMany({ orderBy: { nameEn: "asc" } }),
    prisma.size.findMany({ orderBy: { label: "asc" } }),
  ]);

  return {
    categories,
    colors: colors.map((color) => ({
      id: color.id,
      nameEn: color.nameEn,
      nameAr: color.nameAr,
      hex: color.hex,
    })),
    sizes: sizes.map((size) => ({ id: size.id, label: size.label })),
  };
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

export async function getWishlistProductIds(userId?: string | null) {
  if (!userId) return new Set<string>();

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: { items: { select: { productId: true } } },
  });

  return new Set(wishlist?.items.map((item) => item.productId) ?? []);
}

export async function getWishlistProducts(
  userId: string
): Promise<ProductSummary[]> {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: summaryInclude,
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    wishlist?.items
      .filter((item) => item.product.isActive)
      .map((item) => toSummary(item.product)) ?? []
  );
}

export async function addWishlistItem(userId: string, productId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
    select: { id: true },
  });

  if (!product) return { ok: false as const, reason: "not-found" as const };

  const wishlist = await prisma.wishlist.upsert({
    where: { userId },
    create: { userId },
    update: {},
    select: { id: true },
  });

  await prisma.wishlistItem.upsert({
    where: {
      wishlistId_productId: {
        wishlistId: wishlist.id,
        productId,
      },
    },
    create: {
      wishlistId: wishlist.id,
      productId,
    },
    update: {},
  });

  return { ok: true as const };
}

export async function removeWishlistItem(userId: string, productId: string) {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!wishlist) return;

  await prisma.wishlistItem.deleteMany({
    where: {
      wishlistId: wishlist.id,
      productId,
    },
  });
}
