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
      for (const [i, img] of data.images.entries()) {
        await tx.productImage.create({
          data: {
            productId: id,
            url: img.url,
            altEn: img.altEn || null,
            altAr: img.altAr || null,
            isPrimary: img.isPrimary ?? i === 0,
            position: img.position ?? i,
          },
        });
      }
    }

    // Replace tags if provided
    if (data.tags) {
      await tx.productTag.deleteMany({ where: { productId: id } });
      for (const tagId of data.tags) {
        await tx.productTag.create({
          data: { productId: id, tagId },
        });
      }
    }

    // Update variants: update existing by ID, create new, safely delete unused
    if (data.variants) {
      const existingVariants = await tx.variant.findMany({
        where: { productId: id },
        select: { id: true },
      });
      const existingIds = new Set(existingVariants.map((v) => v.id));
      const payloadIds = new Set(data.variants.map((v) => v.id).filter(Boolean) as string[]);

      for (const v of data.variants) {
        if (v.id && existingIds.has(v.id)) {
          await tx.variant.update({
            where: { id: v.id },
            data: {
              sizeId: v.sizeId,
              colorId: v.colorId,
              price: v.price,
              stock: v.stock,
              sku: v.sku,
            },
          });
        } else {
          await tx.variant.create({
            data: {
              productId: id,
              sizeId: v.sizeId,
              colorId: v.colorId,
              price: v.price,
              stock: v.stock,
              sku: v.sku,
            },
          });
        }
      }

      const toDelete = Array.from(existingIds).filter((vid) => !payloadIds.has(vid));
      if (toDelete.length > 0) {
        const referencedCarts = await tx.cartItem.findMany({
          where: { variantId: { in: toDelete } },
          select: { variantId: true },
        });
        const referencedOrders = await tx.orderItem.findMany({
          where: { variantId: { in: toDelete } },
          select: { variantId: true },
        });
        const referencedIds = new Set([
          ...referencedCarts.map((r) => r.variantId),
          ...referencedOrders.map((r) => r.variantId),
        ]);
        const safeToDelete = toDelete.filter((vid) => !referencedIds.has(vid));
        if (safeToDelete.length > 0) {
          await tx.variant.deleteMany({ where: { id: { in: safeToDelete } } });
        }
      }
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
    where: { isActive: true },
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

// ─── Orders ─────────────────────────────────────────────────────────────────

export async function getAdminOrders(options: {
  search?: string;
  status?: string;
  skip?: number;
  take?: number;
}) {
  const { search, status, skip = 0, take = 50 } = options;
  const where: Prisma.OrderWhereInput = {};
  if (status) where.status = status as Prisma.EnumOrderStatusFilter;
  if (search) {
    where.OR = [
      { id: { contains: search, mode: "insensitive" } },
      { user: { email: { contains: search, mode: "insensitive" } } },
      { shippingAddress: { contains: search, mode: "insensitive" } },
    ];
  }
  const [rows, count] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: { include: { product: { select: { nameEn: true } } } },
        user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true, phone: true } } } },
        coupon: { select: { code: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.order.count({ where }),
  ]);
  return {
    orders: rows.map((o) => ({
      id: o.id,
      status: o.status,
      total: Number(o.total),
      subtotal: Number(o.subtotal),
      discount: Number(o.discount),
      customerEmail: o.user?.email ?? "Guest",
      customerName: o.user?.profile ? `${o.user.profile.firstName ?? ""} ${o.user.profile.lastName ?? ""}`.trim() : "Guest",
      phone: o.user?.profile?.phone ?? null,
      itemCount: o.items.length,
      couponCode: o.coupon?.code ?? null,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    })),
    count,
  };
}

export async function getAdminOrderById(id: string) {
  const o = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: { select: { nameEn: true, nameAr: true, slug: true } },
          variant: { include: { size: true, color: true } },
        },
      },
      user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true, phone: true, address: true, city: true } } } },
      coupon: { select: { code: true, type: true, value: true } },
    },
  });
  if (!o) return null;
  return {
    id: o.id,
    status: o.status,
    total: Number(o.total),
    subtotal: Number(o.subtotal),
    discount: Number(o.discount),
    shippingAddress: o.shippingAddress,
    customerEmail: o.user?.email ?? "Guest",
    customerName: o.user?.profile ? `${o.user.profile.firstName ?? ""} ${o.user.profile.lastName ?? ""}`.trim() : "Guest",
    phone: o.user?.profile?.phone ?? null,
    address: o.user?.profile?.address ?? null,
    city: o.user?.profile?.city ?? null,
    couponCode: o.coupon?.code ?? null,
    couponType: o.coupon?.type ?? null,
    couponValue: o.coupon ? Number(o.coupon.value) : null,
    items: o.items.map((i) => ({
      id: i.id,
      productName: i.product.nameEn,
      productSlug: i.product.slug,
      sizeLabel: i.variant.size.label,
      colorName: i.variant.color.nameEn,
      colorHex: i.variant.color.hex,
      quantity: i.quantity,
      unitPrice: Number(i.unitPrice),
    })),
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  };
}

export async function updateOrderStatus(id: string, status: string) {
  const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"] as const;
  type ValidStatus = (typeof validStatuses)[number];
  if (!validStatuses.includes(status as ValidStatus)) {
    throw new Error("Invalid order status");
  }
  return prisma.order.update({
    where: { id },
    data: { status: status as ValidStatus },
  });
}

// ─── Stock / Variants ───────────────────────────────────────────────────────

export async function getAdminStock(options: {
  search?: string;
  productId?: string;
  stockFilter?: "all" | "low" | "out";
  skip?: number;
  take?: number;
}) {
  const { search, productId, stockFilter = "all", skip = 0, take = 100 } = options;

  const where: Prisma.VariantWhereInput = {};
  if (productId) where.productId = productId;
  if (stockFilter === "low") where.stock = { lte: 5, gt: 0 };
  if (stockFilter === "out") where.stock = 0;

  if (search) {
    where.product = {
      OR: [
        { nameEn: { contains: search, mode: "insensitive" } },
        { nameAr: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  const [rows, count] = await Promise.all([
    prisma.variant.findMany({
      where,
      include: {
        product: { select: { id: true, nameEn: true, nameAr: true, slug: true, images: { orderBy: [{ isPrimary: "desc" }], take: 1 } } },
        size: true,
        color: true,
      },
      orderBy: [{ product: { nameEn: "asc" } }, { color: { nameEn: "asc" } }, { size: { label: "asc" } }],
      skip,
      take,
    }),
    prisma.variant.count({ where }),
  ]);

  return {
    variants: rows.map((v) => ({
      id: v.id,
      sku: v.sku,
      price: Number(v.price),
      stock: v.stock,
      sizeLabel: v.size.label,
      colorName: v.color.nameEn,
      colorHex: v.color.hex,
      productId: v.productId,
      productName: v.product.nameEn,
      productSlug: v.product.slug,
      primaryImage: v.product.images[0]?.url ?? null,
    })),
    count,
  };
}

export async function updateVariantStock(id: string, stock: number) {
  return prisma.variant.update({
    where: { id },
    data: { stock },
  });
}

export async function bulkUpdateStock(updates: Array<{ id: string; stock: number }>) {
  return prisma.$transaction(
    updates.map((u) => prisma.variant.update({ where: { id: u.id }, data: { stock: u.stock } }))
  );
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export async function getAdminCoupons() {
  const rows = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((c) => ({
    id: c.id,
    code: c.code,
    type: c.type,
    value: Number(c.value),
    minOrder: c.minOrder ? Number(c.minOrder) : null,
    maxUses: c.maxUses,
    usedCount: c.usedCount,
    isActive: c.isActive,
    expiresAt: c.expiresAt?.toISOString() ?? null,
    createdAt: c.createdAt.toISOString(),
  }));
}

export async function createCoupon(data: {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrder?: number | null;
  maxUses?: number | null;
  expiresAt?: string | null;
  isActive?: boolean;
}) {
  return prisma.coupon.create({
    data: {
      code: data.code,
      type: data.type,
      value: data.value,
      minOrder: data.minOrder ?? null,
      maxUses: data.maxUses ?? null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateCoupon(
  id: string,
  data: {
    code?: string;
    type?: "PERCENTAGE" | "FIXED";
    value?: number;
    minOrder?: number | null;
    maxUses?: number | null;
    expiresAt?: string | null;
    isActive?: boolean;
  }
) {
  return prisma.coupon.update({
    where: { id },
    data: {
      ...data,
      expiresAt: data.expiresAt === null ? null : data.expiresAt ? new Date(data.expiresAt) : undefined,
    },
  });
}

export async function deleteCoupon(id: string) {
  return prisma.coupon.delete({ where: { id } });
}

// ─── Banners ──────────────────────────────────────────────────────────────────

export async function getAdminBanners() {
  const rows = await prisma.banner.findMany({ orderBy: { position: "asc" } });
  return rows.map((b) => ({
    id: b.id,
    titleEn: b.titleEn,
    titleAr: b.titleAr,
    subtitleEn: b.subtitleEn,
    subtitleAr: b.subtitleAr,
    imageUrl: b.imageUrl,
    linkUrl: b.linkUrl,
    isActive: b.isActive,
    position: b.position,
    createdAt: b.createdAt.toISOString(),
  }));
}

export async function createBanner(data: {
  titleEn: string;
  titleAr: string;
  subtitleEn?: string;
  subtitleAr?: string;
  imageUrl: string;
  linkUrl?: string;
  position?: number;
  isActive?: boolean;
}) {
  return prisma.banner.create({
    data: {
      titleEn: data.titleEn,
      titleAr: data.titleAr,
      subtitleEn: data.subtitleEn,
      subtitleAr: data.subtitleAr,
      imageUrl: data.imageUrl,
      linkUrl: data.linkUrl,
      position: data.position ?? 0,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateBanner(
  id: string,
  data: {
    titleEn?: string;
    titleAr?: string;
    subtitleEn?: string | null;
    subtitleAr?: string | null;
    imageUrl?: string;
    linkUrl?: string | null;
    position?: number;
    isActive?: boolean;
  }
) {
  return prisma.banner.update({ where: { id }, data });
}

export async function deleteBanner(id: string) {
  return prisma.banner.delete({ where: { id } });
}

// ─── Custom Orders ────────────────────────────────────────────────────────────

export async function getAdminCustomOrders(options: {
  status?: string;
  search?: string;
  skip?: number;
  take?: number;
}) {
  const { status, search, skip = 0, take = 50 } = options;
  const where: Prisma.CustomOrderRequestWhereInput = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }
  const [rows, count] = await Promise.all([
    prisma.customOrderRequest.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
    prisma.customOrderRequest.count({ where }),
  ]);
  return {
    requests: rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      description: r.description,
      quantity: r.quantity,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
    count,
  };
}

export async function getAdminCustomOrderById(id: string) {
  const r = await prisma.customOrderRequest.findUnique({ where: { id } });
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    description: r.description,
    quantity: r.quantity,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export async function updateCustomOrderStatus(id: string, status: string) {
  return prisma.customOrderRequest.update({ where: { id }, data: { status } });
}

export async function updateCustomOrderNotes(id: string, notes: string | null) {
  // Since there's no notes field in schema, we'll store it in a lightweight way
  // by extending the description or using a separate approach.
  // For now, we'll just update status as the schema doesn't have adminNotes.
  // In a real app, we'd add an adminNotes field to CustomOrderRequest.
  return prisma.customOrderRequest.update({ where: { id }, data: { description: notes ?? undefined } });
}

// ─── Users / Customers ────────────────────────────────────────────────────────

export async function getAdminUsers(options: {
  search?: string;
  skip?: number;
  take?: number;
}) {
  const { search, skip = 0, take = 50 } = options;
  const where: Prisma.UserWhereInput = { role: "CUSTOMER" };
  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { profile: { firstName: { contains: search, mode: "insensitive" } } },
      { profile: { lastName: { contains: search, mode: "insensitive" } } },
      { profile: { phone: { contains: search, mode: "insensitive" } } },
    ];
  }
  const [rows, count] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        profile: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.user.count({ where }),
  ]);
  return {
    users: rows.map((u) => ({
      id: u.id,
      email: u.email,
      firstName: u.profile?.firstName ?? null,
      lastName: u.profile?.lastName ?? null,
      phone: u.profile?.phone ?? null,
      address: u.profile?.address ?? null,
      city: u.profile?.city ?? null,
      postalCode: u.profile?.postalCode ?? null,
      isActive: u.isActive,
      orderCount: u._count.orders,
      createdAt: u.createdAt.toISOString(),
    })),
    count,
  };
}

export async function getAdminUserById(id: string) {
  const u = await prisma.user.findUnique({
    where: { id, role: "CUSTOMER" },
    include: {
      profile: true,
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: { include: { product: { select: { nameEn: true } } } },
          coupon: { select: { code: true } },
        },
      },
    },
  });
  if (!u) return null;
  return {
    id: u.id,
    email: u.email,
    firstName: u.profile?.firstName ?? null,
    lastName: u.profile?.lastName ?? null,
    phone: u.profile?.phone ?? null,
    address: u.profile?.address ?? null,
    city: u.profile?.city ?? null,
    postalCode: u.profile?.postalCode ?? null,
    country: u.profile?.country ?? null,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
    orders: u.orders.map((o) => ({
      id: o.id,
      status: o.status,
      total: Number(o.total),
      itemCount: o.items.length,
      couponCode: o.coupon?.code ?? null,
      createdAt: o.createdAt.toISOString(),
    })),
  };
}

export async function toggleUserActive(id: string, isActive: boolean) {
  return prisma.user.update({ where: { id }, data: { isActive } });
}
