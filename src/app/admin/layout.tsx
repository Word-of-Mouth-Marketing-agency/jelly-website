import { auth } from "@/auth";
import AdminNav from "@/components/admin/AdminNav";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex">
      <AdminNav />
      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
