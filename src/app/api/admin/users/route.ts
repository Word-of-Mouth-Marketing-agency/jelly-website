import { auth } from "@/auth";
import { getAdminUsers } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const skip = Math.max(0, Number(searchParams.get("skip") ?? 0));
  const take = Math.min(100, Math.max(1, Number(searchParams.get("take") ?? 50)));

  try {
    const result = await getAdminUsers({ search, skip, take });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}
