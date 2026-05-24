import { quoteCartItems } from "@/lib/cart";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      items?: unknown;
      couponCode?: unknown;
    };
    const items = Array.isArray(body.items) ? body.items : [];
    const couponCode =
      typeof body.couponCode === "string" ? body.couponCode : undefined;

    const quote = await quoteCartItems(
      items
        .filter(
          (item): item is { variantId: string; quantity: number } =>
            typeof item === "object" &&
            item !== null &&
            typeof (item as { variantId?: unknown }).variantId === "string"
        )
        .map((item) => ({
          variantId: item.variantId,
          quantity:
            typeof item.quantity === "number" ? item.quantity : 1,
        })),
      couponCode
    );

    return NextResponse.json(quote);
  } catch {
    return NextResponse.json({ error: "Invalid cart." }, { status: 400 });
  }
}
