import { auth } from "@/auth";
import { getAdminCategories, createCategory } from "@/lib/admin";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  nameEn: z.string().trim().min(1).max(120),
  nameAr: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/),
  image: z.string().trim().max(500).optional().default(""),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await getAdminCategories();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
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
      { error: "Invalid category data.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const category = await createCategory(parsed.data);
    return NextResponse.json({ id: category.id, slug: category.slug }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create category." }, { status: 500 });
  }
}
