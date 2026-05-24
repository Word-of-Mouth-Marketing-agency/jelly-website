import { auth } from "@/auth";
import {
  clearUserCart,
  getUserCart,
  removeCartItem,
  setCartItemQuantity,
  upsertCartItem,
} from "@/lib/cart";
import { NextResponse } from "next/server";

async function readBody(request: Request) {
  try {
    return (await request.json()) as {
      variantId?: unknown;
      quantity?: unknown;
    };
  } catch {
    return {};
  }
}

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getUserCart(userId));
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await readBody(request);
  if (typeof body.variantId !== "string") {
    return NextResponse.json({ error: "Missing variant." }, { status: 400 });
  }

  const result = await upsertCartItem(
    userId,
    body.variantId,
    typeof body.quantity === "number" ? body.quantity : 1
  );
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(await getUserCart(userId));
}

export async function PATCH(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await readBody(request);
  if (typeof body.variantId !== "string" || typeof body.quantity !== "number") {
    return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
  }

  await setCartItemQuantity(userId, body.variantId, body.quantity);
  return NextResponse.json(await getUserCart(userId));
}

export async function DELETE(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await readBody(request);
  if (typeof body.variantId === "string") {
    await removeCartItem(userId, body.variantId);
  } else {
    await clearUserCart(userId);
  }

  return NextResponse.json(await getUserCart(userId));
}
