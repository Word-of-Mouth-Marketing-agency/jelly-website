import { auth } from "@/auth";
import { getAllSizes } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sizes = await getAllSizes();
    return NextResponse.json(sizes);
  } catch {
    return NextResponse.json({ error: "Failed to load sizes" }, { status: 500 });
  }
}
