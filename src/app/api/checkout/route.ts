import { auth } from "@/auth";
import { createCheckoutOrder, type CheckoutCustomer } from "@/lib/cart";
import { NextResponse } from "next/server";

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validateCustomer(input: unknown): CheckoutCustomer | null {
  const raw = (input ?? {}) as Record<string, unknown>;
  const customer = {
    name: cleanString(raw.name),
    email: cleanString(raw.email),
    phone: cleanString(raw.phone),
    address: cleanString(raw.address),
    city: cleanString(raw.city),
  };

  if (
    customer.name.length < 2 ||
    !customer.email.includes("@") ||
    customer.phone.length < 6 ||
    customer.address.length < 6 ||
    customer.city.length < 2
  ) {
    return null;
  }

  return customer;
}

export async function POST(request: Request) {
  const session = await auth();
  const body = (await request.json().catch(() => ({}))) as {
    items?: unknown;
    couponCode?: unknown;
    customer?: unknown;
  };

  const customer = validateCustomer(body.customer);
  if (!customer) {
    return NextResponse.json(
      { error: "Please complete all customer fields." },
      { status: 400 }
    );
  }

  const items = Array.isArray(body.items) ? body.items : [];
  const result = await createCheckoutOrder({
    userId: session?.user?.id,
    couponCode:
      typeof body.couponCode === "string" ? body.couponCode : undefined,
    customer,
    items: items
      .filter(
        (item): item is { variantId: string; quantity: number } =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as { variantId?: unknown }).variantId === "string"
      )
      .map((item) => ({
        variantId: item.variantId,
        quantity: typeof item.quantity === "number" ? item.quantity : 1,
      })),
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    orderId: result.order.id,
    orderNumber: `JELLY-${result.order.id.slice(-6).toUpperCase()}`,
    total: Number(result.order.total),
  });
}
