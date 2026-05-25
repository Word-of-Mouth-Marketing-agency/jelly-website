import { auth } from "@/auth";
import { getDashboardStats } from "@/lib/admin";
import { money } from "@/lib/money";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
  ImageOff,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const stats = await getDashboardStats();

  const statCards = [
    { label: "Total Orders", value: stats.totalOrders.toString(), icon: ShoppingBag, color: "bg-blue-50 text-blue-700" },
    { label: "Total Revenue", value: money(stats.totalRevenue), icon: DollarSign, color: "bg-green-50 text-green-700" },
    { label: "Total Customers", value: stats.totalCustomers.toString(), icon: Users, color: "bg-purple-50 text-purple-700" },
    { label: "Total Products", value: stats.totalProducts.toString(), icon: Package, color: "bg-orange-50 text-orange-700" },
    { label: "Pending Orders", value: stats.pendingOrders.toString(), icon: Clock, color: "bg-yellow-50 text-yellow-700" },
    { label: "Low Stock Items", value: stats.lowStockProducts.length.toString(), icon: AlertTriangle, color: "bg-red-50 text-red-700" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-1">Dashboard</h1>
          <p className="text-on-surface-variant text-sm">Overview of your Jelly store.</p>
        </div>
        <span className="text-sm text-on-surface-variant">{session.user.email}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl sticker-border p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon size={20} strokeWidth={2} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-on-surface-variant font-medium">{card.label}</p>
                <p className="font-headline-md text-headline-md">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl sticker-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-headline-md text-headline-md">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="text-on-surface-variant text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-outline-variant p-4 hover:border-primary transition"
                >
                  <div>
                    <span className="font-bold text-sm">JELLY-{order.id.slice(-6).toUpperCase()}</span>
                    <span className="text-xs text-on-surface-variant ml-2">{order.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-on-surface-variant">{order.itemCount} items</span>
                    <span className="font-bold text-sm">{money(order.total)}</span>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-surface-container-high text-on-surface-variant">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl sticker-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-headline-md text-headline-md">Low Stock Products</h2>
            <Link href="/admin/stock" className="text-sm font-semibold text-primary hover:underline">
              Manage stock
            </Link>
          </div>
          {stats.lowStockProducts.length === 0 ? (
            <p className="text-on-surface-variant text-sm">All products are well stocked.</p>
          ) : (
            <div className="space-y-3">
              {stats.lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 rounded-xl border border-outline-variant p-3 hover:border-primary transition"
                >
                  <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                    {product.primaryImage ? (
                      <>
                        <img
                          src={product.primaryImage}
                          alt={product.nameEn}
                          className="w-full h-full object-cover absolute inset-0 z-10"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <ImageOff size={18} className="text-outline-variant" />
                      </>
                    ) : (
                      <ImageOff size={18} className="text-outline-variant" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{product.nameEn}</p>
                    <p className="text-xs text-on-surface-variant">Stock: {product.totalStock}</p>
                  </div>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
