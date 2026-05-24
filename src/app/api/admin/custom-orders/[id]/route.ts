import { auth } from "@/auth";
import { getAdminCustomOrderById, updateCustomOrderStatus } from "@/lib/admin";
import { NextResponse } from "next/server";
import { z } from "zod";

const patchSchema = z.object({
  status: z.string().min(1),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const requestData = await getAdminCustomOrderById(id);
    if (!requestData) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(requestData);
  } catch {
    return NextResponse.json({ error: "Failed to load custom order" }, { status: 500 });
  }
}

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
    await updateCustomOrderStatus(id, parsed.data.status);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update custom order" }, { status: 500 });
  }
}
