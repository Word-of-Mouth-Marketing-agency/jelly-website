import { validateCoupon } from "@/lib/cart";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    code?: unknown;
    subtotal?: unknown;
  };
  const code = typeof body.code === "string" ? body.code : "";
  const subtotal = typeof body.subtotal === "number" ? body.subtotal : 0;
  const result = await validateCoupon(code, subtotal);
  return NextResponse.json(result);
}
