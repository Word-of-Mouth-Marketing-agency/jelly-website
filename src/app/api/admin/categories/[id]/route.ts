import { auth } from "@/auth";
import { updateCategory, archiveCategory, getAdminCategories } from "@/lib/admin";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  nameEn: z.string().trim().min(1).max(120).optional(),
  nameAr: z.string().trim().min(1).max(120).optional(),
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/).optional(),
  image: z.string().trim().max(500).optional().nullable(),
  isActive: z.boolean().optional(),
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
    const categories = await getAdminCategories();
    const category = categories.find((c) => c.id === id);
    if (!category) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Failed to load category" }, { status: 500 });
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
      { error: "Invalid category data.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const category = await updateCategory(id, parsed.data);
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Failed to update category." }, { status: 500 });
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
    const category = await archiveCategory(id);
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Failed to archive category." }, { status: 500 });
  }
}
