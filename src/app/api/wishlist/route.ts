import { auth } from "@/auth";
import {
  addWishlistItem,
  getWishlistProductIds,
  removeWishlistItem,
} from "@/lib/products";
import { NextResponse } from "next/server";

async function readProductId(request: Request) {
  try {
    const body = (await request.json()) as { productId?: unknown };
    return typeof body.productId === "string" ? body.productId : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ids = await getWishlistProductIds(userId);
  return NextResponse.json({ productIds: Array.from(ids) });
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const productId = await readProductId(request);
  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  const result = await addWishlistItem(userId, productId);
  if (!result.ok) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const productId = await readProductId(request);
  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  await removeWishlistItem(userId, productId);
  return NextResponse.json({ ok: true });
}
