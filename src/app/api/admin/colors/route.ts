import { auth } from "@/auth";
import { getAllColors } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const colors = await getAllColors();
    return NextResponse.json(colors);
  } catch {
    return NextResponse.json({ error: "Failed to load colors" }, { status: 500 });
  }
}
