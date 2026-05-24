import { auth } from "@/auth";
import { getAdminStock, bulkUpdateStock } from "@/lib/admin";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const productId = searchParams.get("productId") ?? undefined;
  const stockFilter = (searchParams.get("stockFilter") as "all" | "low" | "out") ?? "all";
  const skip = Math.max(0, Number(searchParams.get("skip") ?? 0));
  const take = Math.min(200, Math.max(1, Number(searchParams.get("take") ?? 100)));

  try {
    const result = await getAdminStock({ search, productId, stockFilter, skip, take });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to load stock" }, { status: 500 });
  }
}

const patchSchema = z.object({
  updates: z.array(
    z.object({
      id: z.string().min(1),
      stock: z.number().int().min(0),
    })
  ).min(1),
});

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await bulkUpdateStock(parsed.data.updates);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update stock" }, { status: 500 });
  }
}
