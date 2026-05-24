import { prisma } from "./prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function getDashboardStats() {
  const [
    totalOrders,
    totalRevenue,
    totalCustomers,
    totalProducts,
    pendingOrders,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.findMany({
      where: {
        variants: { some: { stock: { lte: 5, gt: 0 } } },
      },
      include: {
        images: { orderBy: [{ isPrimary: "desc" }], take: 1 },
        variants: { select: { stock: true } },
      },
      take: 10,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        items: { include: { product: { select: { nameEn: true } } } },
        user: { select: { email: true } },
      },
    }),
  ]);

  return {
    totalOrders,
    totalRevenue: Number(totalRevenue._sum.total ?? 0),
    totalCustomers,
    totalProducts,
    pendingOrders,
    lowStockProducts: lowStockProducts.map((p) => ({
      id: p.id,
      nameEn: p.nameEn,
      nameAr: p.nameAr,
      slug: p.slug,
      primaryImage: p.images[0]?.url ?? null,
      totalStock: p.variants.reduce((s, v) => s + v.stock, 0),
    })),
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      status: o.status,
      total: Number(o.total),
      itemCount: o.items.length,
      customerEmail: o.user?.email ?? "Guest",
      createdAt: o.createdAt.toISOString(),
    })),
  };
}

export async function getAdminProducts(options: {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  skip?: number;
  take?: number;
}) {
  const { search, categoryId, isActive, isFeatured, skip = 0, take = 50 } = options;

  const where: Prisma.ProductWhereInput = {};
  if (search) {
    where.OR = [
      { nameEn: { contains: search, mode: "insensitive" } },
      { nameAr: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;
  if (typeof isActive === "boolean") where.isActive = isActive;
  if (typeof isFeatured === "boolean") where.isFeatured = isFeatured;

  const [rows, count] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, nameEn: true, nameAr: true, slug: true } },
        images: { orderBy: [{ isPrimary: "desc" }, { position: "asc" }], take: 1 },
        variants: { select: { id: true, price: true, stock: true, size: true, color: true }, orderBy: [{ color: { nameEn: "asc" } }, { size: { label: "asc" } }] },
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: rows.map((p) => ({
      id: p.id,
      nameEn: p.nameEn,
      nameAr: p.nameAr,
      slug: p.slug,
      category: p.category,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      primaryImage: p.images[0]?.url ?? null,
      totalStock: p.variants.reduce((s, v) => s + v.stock, 0),
      minPrice: Math.min(...p.variants.map((v) => Number(v.price))),
      maxPrice: Math.max(...p.variants.map((v) => Number(v.price))),
      variants: p.variants.map((v) => ({
        id: v.id,
        price: Number(v.price),
        stock: v.stock,
        sizeLabel: v.size.label,
        colorName: v.color.nameEn,
      })),
      tags: p.tags.map((t) => ({ nameEn: t.tag.nameEn, nameAr: t.tag.nameAr })),
      createdAt: p.createdAt.toISOString(),
    })),
    count,
  };
}

export async function getAdminProductById(id: string) {
  const p = await prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, nameEn: true, nameAr: true, slug: true } },
      images: { orderBy: [{ isPrimary: "desc" }, { position: "asc" }] },
      variants: { include: { size: true, color: true }, orderBy: [{ color: { nameEn: "asc" } }, { size: { label: "asc" } }] },
      tags: { include: { tag: true } },
    },
  });
  if (!p) return null;
  return {
    id: p.id,
    nameEn: p.nameEn,
    nameAr: p.nameAr,
    descriptionEn: p.descriptionEn,
    descriptionAr: p.descriptionAr,
    slug: p.slug,
    categoryId: p.categoryId,
    category: p.category,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    images: p.images.map((img) => ({ id: img.id, url: img.url, altEn: img.altEn, altAr: img.altAr, isPrimary: img.isPrimary, position: img.position })),
    variants: p.variants.map((v) => ({
      id: v.id,
      price: Number(v.price),
      stock: v.stock,
      sku: v.sku,
      sizeId: v.sizeId,
      sizeLabel: v.size.label,
      colorId: v.colorId,
      colorName: v.color.nameEn,
      colorHex: v.color.hex,
    })),
    tags: p.tags.map((t) => ({ id: t.tag.id, nameEn: t.tag.nameEn, nameAr: t.tag.nameAr })),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export async function createProduct(data: {
  nameEn: string;
  nameAr: string;
  slug: string;
  descriptionEn?: string;
  descriptionAr?: string;
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
  images: Array<{ url: string; altEn?: string; altAr?: string; isPrimary?: boolean; position?: number }>;
  tags: string[];
  variants: Array<{ sizeId: string; colorId: string; price: number; stock: number; sku: string }>;
}) {
  const product = await prisma.product.create({
    data: {
      nameEn: data.nameEn,
      nameAr: data.nameAr,
      slug: data.slug,
      descriptionEn: data.descriptionEn,
      descriptionAr: data.descriptionAr,
      categoryId: data.categoryId,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      images: {
        create: data.images.map((img, i) => ({
          url: img.url,
          altEn: img.altEn,
          altAr: img.altAr,
          isPrimary: img.isPrimary ?? i === 0,
          position: img.position ?? i,
        })),
      },
      tags: {
        create: data.tags.map((tagId) => ({
          tag: { connect: { id: tagId } },
        })),
      },
      variants: {
        create: data.variants.map((v) => ({
          sizeId: v.sizeId,
          colorId: v.colorId,
          price: v.price,
          stock: v.stock,
          sku: v.sku,
        })),
      },
    },
  });
  return product;
}

export async function updateProduct(
  id: string,
  data: {
    nameEn?: string;
    nameAr?: string;
    slug?: string;
    descriptionEn?: string | null;
    descriptionAr?: string | null;
    categoryId?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    images?: Array<{ id?: string; url: string; altEn?: string; altAr?: string; isPrimary?: boolean; position?: number }>;
    tags?: string[];
    variants?: Array<{ id?: string; sizeId: string; colorId: string; price: number; stock: number; sku: string }>;
  }
) {
  return prisma.$transaction(async (tx) => {
    // Update product fields
    await tx.product.update({
      where: { id },
      data: {
        nameEn: data.nameEn,
        nameAr: data.nameAr,
        slug: data.slug,
        descriptionEn: data.descriptionEn,
        descriptionAr: data.descriptionAr,
        categoryId: data.categoryId,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
      },
    });

    // Replace images if provided
    if (data.images) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productImage.createMany({
        data: data.images.map((img, i) => ({
          productId: id,
          url: img.url,
          altEn: img.altEn,
          altAr: img.altAr,
          isPrimary: img.isPrimary ?? i === 0,
          position: img.position ?? i,
        })),
      });
    }

    // Replace tags if provided
    if (data.tags) {
      await tx.productTag.deleteMany({ where: { productId: id } });
      if (data.tags.length > 0) {
        await tx.productTag.createMany({
          data: data.tags.map((tagId) => ({ productId: id, tagId })),
        });
      }
    }

    // Replace variants if provided
    if (data.variants) {
      await tx.variant.deleteMany({ where: { productId: id } });
      await tx.variant.createMany({
        data: data.variants.map((v) => ({
          productId: id,
          sizeId: v.sizeId,
          colorId: v.colorId,
          price: v.price,
          stock: v.stock,
          sku: v.sku,
        })),
      });
    }

    return tx.product.findUnique({ where: { id } });
  });
}

export async function archiveProduct(id: string) {
  return prisma.product.update({
    where: { id },
    data: { isActive: false },
  });
}

export async function getAdminCategories() {
  const rows = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { nameEn: "asc" },
  });
  return rows.map((c) => ({
    id: c.id,
    nameEn: c.nameEn,
    nameAr: c.nameAr,
    slug: c.slug,
    image: c.image,
    isActive: c.isActive,
    productCount: c._count.products,
    createdAt: c.createdAt.toISOString(),
  }));
}

export async function createCategory(data: {
  nameEn: string;
  nameAr: string;
  slug: string;
  image?: string;
  isActive?: boolean;
}) {
  return prisma.category.create({
    data: {
      nameEn: data.nameEn,
      nameAr: data.nameAr,
      slug: data.slug,
      image: data.image,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateCategory(
  id: string,
  data: {
    nameEn?: string;
    nameAr?: string;
    slug?: string;
    image?: string | null;
    isActive?: boolean;
  }
) {
  return prisma.category.update({
    where: { id },
    data,
  });
}

export async function archiveCategory(id: string) {
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }
  return prisma.category.delete({ where: { id } });
}

export async function getAllTags() {
  return prisma.tag.findMany({ orderBy: { nameEn: "asc" } });
}

export async function getAllSizes() {
  return prisma.size.findMany({ orderBy: { label: "asc" } });
}

export async function getAllColors() {
  return prisma.color.findMany({ orderBy: { nameEn: "asc" } });
}
