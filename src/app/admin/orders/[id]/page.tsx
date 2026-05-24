"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Phone, CheckCircle, AlertCircle } from "lucide-react";
import { money } from "@/lib/money";

type OrderDetail = {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  discount: number;
  shippingAddress: string;
  customerEmail: string;
  customerName: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  couponCode: string | null;
  couponType: string | null;
  couponValue: number | null;
  items: Array<{
    id: string;
    productName: string;
    productSlug: string;
    sizeLabel: string;
    colorName: string;
    colorHex: string;
    quantity: number;
    unitPrice: number;
  }>;
  createdAt: string;
  updatedAt: string;
};

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PROCESSING: "bg-indigo-50 text-indigo-700",
  SHIPPED: "bg-purple-50 text-purple-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-600",
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setOrder(data);
          setNewStatus(data.status);
        }
      })
      .catch(() => setError("Failed to load order"))
      .finally(() => setLoading(false));
    return () => { cancelled = true; };
  }, [id]);

  async function updateStatus() {
    if (!order || newStatus === order.status) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrder((o) => (o ? { ...o, status: newStatus } : o));
      } else {
        setError("Failed to update status");
      }
    } catch {
      setError("Failed to update status");
    } finally {
      setSaving(false);
    }
  }

  const whatsappLink = order?.phone
    ? `https://wa.me/${order.phone.replace(/\D/g, "")}`
    : null;

  if (loading) return <div className="p-12 text-center text-on-surface-variant text-sm">Loading order...</div>;
  if (!order) return <div className="p-12 text-center text-error text-sm">Order not found.</div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to orders
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <div className="bg-white rounded-2xl sticker-border p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h1 className="font-display-lg text-display-lg text-on-surface mb-1">Order {order.id.slice(0, 12)}</h1>
                <p className="text-on-surface-variant text-sm">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                {order.status}
              </span>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-center gap-2">
                <AlertCircle size={16} aria-hidden="true" />
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="rounded-lg border-2 border-outline-variant px-4 py-2.5 text-sm focus:border-primary focus:outline-none bg-white"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={updateStatus}
                disabled={saving || newStatus === order.status}
                className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-5 py-2.5 rounded-full font-label-lg text-label-lg sticker-border hover:scale-[1.01] transition disabled:opacity-50"
              >
                <CheckCircle size={16} aria-hidden="true" />
                {saving ? "Saving..." : "Update Status"}
              </button>
            </div>

            <div className="border-t border-outline-variant pt-4">
              <h2 className="font-bold text-on-surface mb-3">Items</h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-high/50">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-on-surface-variant">Size: {item.sizeLabel} · Color: {item.colorName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{money(item.unitPrice)}</p>
                      <p className="text-xs text-on-surface-variant">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white rounded-2xl sticker-border p-6">
            <h2 className="font-bold text-on-surface mb-3">Customer</h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{order.customerName}</p>
              <p className="text-on-surface-variant">{order.customerEmail}</p>
              {order.phone && <p className="text-on-surface-variant">{order.phone}</p>}
              {order.address && <p className="text-on-surface-variant">{order.address}</p>}
              {order.city && <p className="text-on-surface-variant">{order.city}</p>}
            </div>
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition"
              >
                <Phone size={16} aria-hidden="true" />
                WhatsApp
              </a>
            )}
          </div>

          <div className="bg-white rounded-2xl sticker-border p-6">
            <h2 className="font-bold text-on-surface mb-3">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal</span>
                <span>{money(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Discount</span>
                  <span className="text-green-700">-{money(order.discount)}</span>
                </div>
              )}
              {order.couponCode && (
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Coupon</span>
                  <span className="text-primary font-medium">{order.couponCode}</span>
                </div>
              )}
              <div className="border-t border-outline-variant pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>{money(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
