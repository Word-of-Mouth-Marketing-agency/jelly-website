import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function WishlistPage({
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
        <h1 className="text-3xl font-extrabold text-[#1e1c10] mb-2">My Wishlist</h1>
        <p className="text-[#4a4732] mb-8">
          Signed in as <span className="font-semibold">{session.user.email}</span>
        </p>
        <div className="bg-white rounded-2xl p-8 border border-[#e8e2cf] shadow-sm">
          <p className="text-[#4a4732] text-sm">
            Wishlist items — Phase 4 will connect this to your saved products.
          </p>
        </div>
      </div>
    </div>
  );
}
