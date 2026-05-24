import { auth } from "@/auth";
import { getAdminProductById, updateProduct, archiveProduct } from "@/lib/admin";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  nameEn: z.string().trim().min(1).max(120).optional(),
  nameAr: z.string().trim().min(1).max(120).optional(),
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/).optional(),
  descriptionEn: z.string().trim().max(2000).optional().nullable(),
  descriptionAr: z.string().trim().max(2000).optional().nullable(),
  categoryId: z.string().trim().min(1).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  images: z.array(
    z.object({
      id: z.string().optional(),
      url: z.string().trim().min(1),
      altEn: z.string().optional(),
      altAr: z.string().optional(),
      isPrimary: z.boolean().optional(),
      position: z.number().optional(),
    })
  ).optional(),
  tags: z.array(z.string()).optional(),
  variants: z.array(
    z.object({
      id: z.string().optional(),
      sizeId: z.string().trim().min(1),
      colorId: z.string().trim().min(1),
      price: z.number().positive(),
      stock: z.number().int().min(0),
      sku: z.string().trim().min(1).max(60),
    })
  ).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const product = await getAdminProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to load product" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid product data.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await updateProduct(id, parsed.data);
    const product = await getAdminProductById(id);
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await archiveProduct(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to archive product." }, { status: 500 });
  }
}
