import { auth } from "@/auth";
import { getAdminCoupons, createCoupon } from "@/lib/admin";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  code: z.string().trim().min(1).max(50),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive(),
  minOrder: z.number().positive().nullable().optional(),
  maxUses: z.number().int().min(1).nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const coupons = await getAdminCoupons();
    return NextResponse.json(coupons);
  } catch {
    return NextResponse.json({ error: "Failed to load coupons" }, { status: 500 });
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
    const coupon = await createCoupon(parsed.data);
    return NextResponse.json({ id: coupon.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create coupon. Code may already exist." }, { status: 500 });
  }
}
