import { prisma } from "./prisma";
import { money } from "./money";

export type CartInputItem = {
  variantId: string;
  quantity: number;
};

export type CartLine = {
  variantId: string;
  productId: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  image: string | null;
  size: string;
  colorEn: string;
  colorAr: string;
  colorHex: string;
  price: number;
  stock: number;
  quantity: number;
  lineTotal: number;
};

export type CartTotals = {
  subtotal: number;
  discount: number;
  total: number;
};

export type CartQuote = CartTotals & {
  items: CartLine[];
  couponCode?: string;
  couponId?: string;
  couponError?: string;
};

export type CheckoutCustomer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
};

function cleanQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.min(99, Math.floor(quantity)));
}

function normalizeItems(items: CartInputItem[]) {
  const map = new Map<string, number>();
  for (const item of items) {
    if (!item.variantId) continue;
    map.set(
      item.variantId,
      (map.get(item.variantId) ?? 0) + cleanQuantity(item.quantity)
    );
  }
  return Array.from(map, ([variantId, quantity]) => ({ variantId, quantity }));
}

export async function getVariantForCart(variantId: string) {
  const variant = await prisma.variant.findUnique({
    where: { id: variantId },
    include: {
      product: {
        include: {
          images: {
            orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
            take: 1,
          },
        },
      },
      size: true,
      color: true,
    },
  });

  if (!variant || !variant.product.isActive) return null;

  return {
    variantId: variant.id,
    productId: variant.productId,
    slug: variant.product.slug,
    nameEn: variant.product.nameEn,
    nameAr: variant.product.nameAr,
    image: variant.product.images[0]?.url ?? null,
    size: variant.size.label,
    colorEn: variant.color.nameEn,
    colorAr: variant.color.nameAr,
    colorHex: variant.color.hex,
    price: Number(variant.price),
    stock: variant.stock,
  };
}

export async function quoteCartItems(
  inputItems: CartInputItem[],
  couponCode?: string | null
): Promise<CartQuote> {
  const normalized = normalizeItems(inputItems);
  const variants = await Promise.all(
    normalized.map((item) => getVariantForCart(item.variantId))
  );

  const items = normalized.flatMap((item, index) => {
    const variant = variants[index];
    if (!variant) return [];
    const quantity = Math.min(item.quantity, variant.stock);
    if (quantity < 1) return [];
    return [
      {
        ...variant,
        quantity,
        lineTotal: variant.price * quantity,
      },
    ];
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const coupon = await validateCoupon(couponCode, subtotal);
  const discount = coupon.discount;

  return {
    items,
    subtotal,
    discount,
    total: Math.max(0, subtotal - discount),
    couponCode: coupon.code,
    couponId: coupon.id,
    couponError: coupon.error,
  };
}

export async function validateCoupon(
  code: string | null | undefined,
  subtotal: number
) {
  const normalized = code?.trim().toUpperCase();
  if (!normalized) return { discount: 0 };

  const coupon = await prisma.coupon.findUnique({
    where: { code: normalized },
  });

  if (!coupon || !coupon.isActive) {
    return { discount: 0, error: "Coupon not found." };
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { discount: 0, error: "Coupon has expired." };
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { discount: 0, error: "Coupon has reached its limit." };
  }

  const minOrder = coupon.minOrder === null ? 0 : Number(coupon.minOrder);
  if (subtotal < minOrder) {
    return {
      discount: 0,
      error: `Coupon requires a minimum order of ${money(minOrder)}.`,
    };
  }

  const rawValue = Number(coupon.value);
  const discount =
    coupon.type === "PERCENTAGE"
      ? subtotal * (rawValue / 100)
      : Math.min(rawValue, subtotal);

  return {
    id: coupon.id,
    code: coupon.code,
    discount,
  };
}

export async function getUserCart(userId: string): Promise<CartQuote> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  return quoteCartItems(
    cart?.items.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
    })) ?? []
  );
}

export async function upsertCartItem(
  userId: string,
  variantId: string,
  quantity: number
) {
  const variant = await getVariantForCart(variantId);
  if (!variant) return { ok: false as const, error: "Variant not found." };
  if (variant.stock < 1) return { ok: false as const, error: "Out of stock." };

  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    select: { id: true },
  });

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
  });

  const nextQuantity = Math.min(
    variant.stock,
    cleanQuantity(quantity) + (existing?.quantity ?? 0)
  );

  await prisma.cartItem.upsert({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
    create: {
      cartId: cart.id,
      productId: variant.productId,
      variantId,
      quantity: nextQuantity,
    },
    update: { quantity: nextQuantity },
  });

  return { ok: true as const };
}

export async function setCartItemQuantity(
  userId: string,
  variantId: string,
  quantity: number
) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;
  if (quantity < 1) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, variantId } });
    return;
  }

  const variant = await getVariantForCart(variantId);
  const nextQuantity = Math.min(cleanQuantity(quantity), variant?.stock ?? 0);
  if (nextQuantity < 1) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, variantId } });
    return;
  }

  await prisma.cartItem.updateMany({
    where: { cartId: cart.id, variantId },
    data: { quantity: nextQuantity },
  });
}

export async function removeCartItem(userId: string, variantId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id, variantId } });
}

export async function clearUserCart(userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}

export async function mergeUserCart(userId: string, items: CartInputItem[]) {
  for (const item of normalizeItems(items)) {
    await upsertCartItem(userId, item.variantId, item.quantity);
  }
  return getUserCart(userId);
}

export async function createCheckoutOrder(input: {
  userId?: string;
  items: CartInputItem[];
  couponCode?: string | null;
  customer: CheckoutCustomer;
}) {
  const quote = await quoteCartItems(input.items, input.couponCode);
  if (quote.items.length === 0) {
    return { ok: false as const, error: "Your cart is empty." };
  }
  if (quote.couponError) {
    return { ok: false as const, error: quote.couponError };
  }

  for (const item of quote.items) {
    if (item.quantity > item.stock) {
      return {
        ok: false as const,
        error: `${item.nameEn} has only ${item.stock} available.`,
      };
    }
  }

  const shippingAddress = JSON.stringify(input.customer);

  const order = await prisma.$transaction(async (tx) => {
    for (const item of quote.items) {
      const updated = await tx.variant.updateMany({
        where: { id: item.variantId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (updated.count !== 1) {
        throw new Error(`${item.nameEn} is no longer available.`);
      }
    }

    if (quote.couponId) {
      await tx.coupon.update({
        where: { id: quote.couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    const created = await tx.order.create({
      data: {
        userId: input.userId,
        subtotal: quote.subtotal,
        discount: quote.discount,
        total: quote.total,
        couponId: quote.couponId,
        shippingAddress,
        items: {
          create: quote.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
        },
      },
      include: { items: true },
    });

    if (input.userId) {
      await tx.cartItem.deleteMany({
        where: { cart: { userId: input.userId } },
      });
    }

    return created;
  });

  return { ok: true as const, order, quote };
}

export async function getOrderForSuccess(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { id: true } } },
  });
}
