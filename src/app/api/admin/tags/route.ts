import { auth } from "@/auth";
import { getAllTags } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tags = await getAllTags();
    return NextResponse.json(tags);
  } catch {
    return NextResponse.json({ error: "Failed to load tags" }, { status: 500 });
  }
}
