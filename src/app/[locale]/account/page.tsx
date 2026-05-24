import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#1e1c10] mb-2">My Account</h1>
        <p className="text-[#4a4732] mb-8">
          Signed in as <span className="font-semibold">{session.user.email}</span>
        </p>
        <div className="bg-white rounded-2xl p-8 border border-[#e8e2cf] shadow-sm">
          <p className="text-[#4a4732] text-sm">
            Account dashboard — Phase 4 will add orders, profile, and settings.
          </p>
        </div>
      </div>
    </div>
  );
}
