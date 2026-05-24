import { auth } from "@/auth";
import { updateBanner, deleteBanner } from "@/lib/admin";
import { NextResponse } from "next/server";
import { z } from "zod";

const patchSchema = z.object({
  titleEn: z.string().trim().min(1).max(120).optional(),
  titleAr: z.string().trim().min(1).max(120).optional(),
  subtitleEn: z.string().trim().max(200).optional(),
  subtitleAr: z.string().trim().max(200).optional(),
  imageUrl: z.string().trim().min(1).optional(),
  linkUrl: z.string().trim().optional(),
  position: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await updateBanner(id, parsed.data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deleteBanner(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
