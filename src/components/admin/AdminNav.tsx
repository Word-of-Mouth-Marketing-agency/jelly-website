"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Grid3X3,
  ShoppingCart,
  Tag,
  Image,
  FileText,
  Users,
  BarChart3,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Grid3X3 },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { label: "Banners", href: "/admin/banners", icon: Image },
  { label: "Custom Orders", href: "/admin/custom-orders", icon: FileText },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Stock", href: "/admin/stock", icon: BarChart3 },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#1e1c10] text-white min-h-screen flex flex-col">
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/admin" className="inline-flex items-center gap-2">
          <span className="bg-[#fbe902] text-[#1e1c10] px-1.5 font-extrabold text-lg tracking-tight">
            JELLY
          </span>
          <span className="text-[#ccc7ab] text-sm font-medium">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-[#fbe902] text-[#1e1c10]"
                  : "text-[#ccc7ab] hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} strokeWidth={2} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#ccc7ab] hover:bg-white/10 hover:text-white transition"
        >
          <LogOut size={18} strokeWidth={2} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
