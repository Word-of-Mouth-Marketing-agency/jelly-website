import { auth } from "@/auth";
import { getDashboardStats } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "Failed to load dashboard stats" }, { status: 500 });
  }
}
