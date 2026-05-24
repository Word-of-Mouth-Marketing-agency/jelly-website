import { auth } from "@/auth";
import { mergeUserCart } from "@/lib/cart";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { items?: unknown };
  const items = Array.isArray(body.items) ? body.items : [];
  const cart = await mergeUserCart(
    userId,
    items
      .filter(
        (item): item is { variantId: string; quantity: number } =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as { variantId?: unknown }).variantId === "string"
      )
      .map((item) => ({
        variantId: item.variantId,
        quantity: typeof item.quantity === "number" ? item.quantity : 1,
      }))
  );

  return NextResponse.json(cart);
}
