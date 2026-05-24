import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <header className="bg-[#1e1c10] text-white px-8 py-4 flex items-center justify-between">
        <span className="font-extrabold text-lg tracking-tight">
          <span className="bg-[#fbe902] text-[#1e1c10] px-1.5">JELLY</span>{" "}
          <span className="text-[#ccc7ab] font-normal text-sm ml-1">Admin</span>
        </span>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-[#ccc7ab]">{session.user.email}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="text-white hover:text-[#fbe902] transition font-medium"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="p-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-extrabold text-[#1e1c10] mb-2">Dashboard</h1>
        <p className="text-[#4a4732] mb-8 text-sm">
          Signed in as <span className="font-semibold">{session.user.email}</span> (ADMIN)
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Products", href: "/admin/products" },
            { label: "Categories", href: "/admin/categories" },
            { label: "Orders", href: "/admin/orders" },
            { label: "Coupons", href: "/admin/coupons" },
            { label: "Banners", href: "/admin/banners" },
            { label: "Custom Orders", href: "/admin/custom-orders" },
            { label: "Users", href: "/admin/users" },
            { label: "Stock", href: "/admin/stock" },
          ].map((item) => (
            <div
              key={item.href}
              className="bg-white rounded-xl p-6 border border-[#e8e2cf] shadow-sm"
            >
              <p className="font-bold text-[#1e1c10]">{item.label}</p>
              <p className="text-xs text-[#4a4732] mt-1">Phase 6</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
