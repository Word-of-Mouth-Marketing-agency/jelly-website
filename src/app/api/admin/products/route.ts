import { auth } from "@/auth";
import { getAdminProducts, createProduct } from "@/lib/admin";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  nameEn: z.string().trim().min(1).max(120),
  nameAr: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/),
  descriptionEn: z.string().trim().max(2000).optional().default(""),
  descriptionAr: z.string().trim().max(2000).optional().default(""),
  categoryId: z.string().trim().min(1),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  images: z.array(
    z.object({
      url: z.string().trim().min(1),
      altEn: z.string().optional(),
      altAr: z.string().optional(),
      isPrimary: z.boolean().optional(),
      position: z.number().optional(),
    })
  ).min(1),
  tags: z.array(z.string()).default([]),
  variants: z.array(
    z.object({
      sizeId: z.string().trim().min(1),
      colorId: z.string().trim().min(1),
      price: z.number().positive(),
      stock: z.number().int().min(0),
      sku: z.string().trim().min(1).max(60),
    })
  ).min(1),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const isActive = searchParams.has("isActive") ? searchParams.get("isActive") === "true" : undefined;
  const isFeatured = searchParams.has("isFeatured") ? searchParams.get("isFeatured") === "true" : undefined;
  const skip = Math.max(0, Number(searchParams.get("skip") ?? 0));
  const take = Math.min(100, Math.max(1, Number(searchParams.get("take") ?? 50)));

  try {
    const result = await getAdminProducts({
      search,
      categoryId,
      isActive,
      isFeatured,
      skip,
      take,
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid product data.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const product = await createProduct(parsed.data);
    return NextResponse.json({ id: product.id, slug: product.slug }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
