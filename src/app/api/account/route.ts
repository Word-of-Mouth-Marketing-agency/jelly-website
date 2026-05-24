import { auth } from "@/auth";
import { getProfile, profileSchema, updateProfile } from "@/lib/account";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getProfile(userId));
}

export async function PATCH(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = profileSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid profile data.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json(await updateProfile(userId, parsed.data));
}
