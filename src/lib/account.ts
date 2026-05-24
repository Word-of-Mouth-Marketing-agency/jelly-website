import { prisma } from "./prisma";
import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().trim().max(60).optional().default(""),
  lastName: z.string().trim().max(60).optional().default(""),
  phone: z.string().trim().max(40).optional().default(""),
  address: z.string().trim().max(240).optional().default(""),
  city: z.string().trim().max(80).optional().default(""),
  postalCode: z.string().trim().max(30).optional().default(""),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export function orderNumber(orderId: string) {
  return `JELLY-${orderId.slice(-6).toUpperCase()}`;
}

export function parseShippingAddress(value: string) {
  try {
    const parsed = JSON.parse(value) as {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      city?: string;
    };
    return {
      name: parsed.name ?? "",
      email: parsed.email ?? "",
      phone: parsed.phone ?? "",
      address: parsed.address ?? "",
      city: parsed.city ?? "",
    };
  } catch {
    return { name: "", email: "", phone: "", address: value, city: "" };
  }
}

export async function getAccountOverview(userId: string) {
  const [user, recentOrders, orderCount, wishlistCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { items: true },
    }),
    prisma.order.count({ where: { userId } }),
    prisma.wishlistItem.count({ where: { wishlist: { userId } } }),
  ]);

  const totalSpent = await prisma.order.aggregate({
    where: { userId },
    _sum: { total: true },
  });

  return {
    user,
    recentOrders,
    stats: {
      orderCount,
      wishlistCount,
      totalSpent: Number(totalSpent._sum.total ?? 0),
    },
  };
}

export async function getProfile(userId: string) {
  return prisma.profile.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

export async function updateProfile(userId: string, input: ProfileInput) {
  return prisma.profile.upsert({
    where: { userId },
    create: { userId, ...input },
    update: input,
  });
}

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true,
          variant: { include: { size: true, color: true } },
        },
      },
    },
  });
}

export async function getUserOrderById(userId: string, orderId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      coupon: true,
      items: {
        include: {
          product: {
            include: {
              images: {
                orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
                take: 1,
              },
            },
          },
          variant: { include: { size: true, color: true } },
        },
      },
    },
  });
}
