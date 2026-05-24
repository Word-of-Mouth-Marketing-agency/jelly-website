import { auth } from "@/auth";
import { getAdminBanners, createBanner } from "@/lib/admin";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  titleEn: z.string().trim().min(1).max(120),
  titleAr: z.string().trim().min(1).max(120),
  subtitleEn: z.string().trim().max(200).optional(),
  subtitleAr: z.string().trim().max(200).optional(),
  imageUrl: z.string().trim().min(1),
  linkUrl: z.string().trim().optional(),
  position: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const banners = await getAdminBanners();
    return NextResponse.json(banners);
  } catch {
    return NextResponse.json({ error: "Failed to load banners" }, { status: 500 });
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
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const banner = await createBanner(parsed.data);
    return NextResponse.json({ id: banner.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
