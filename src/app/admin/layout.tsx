import { auth } from "@/auth";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex">
      {session?.user?.role === "ADMIN" && <AdminNav />}
      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
