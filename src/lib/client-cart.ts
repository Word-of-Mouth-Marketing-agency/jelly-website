"use client";

export type LocalCartItem = {
  variantId: string;
  quantity: number;
};

const CART_KEY = "jelly.cart.v1";

function normalize(items: LocalCartItem[]) {
  const map = new Map<string, number>();
  for (const item of items) {
    if (!item.variantId) continue;
    const quantity = Math.max(1, Math.min(99, Math.floor(item.quantity || 1)));
    map.set(item.variantId, (map.get(item.variantId) ?? 0) + quantity);
  }
  return Array.from(map, ([variantId, quantity]) => ({ variantId, quantity }));
}

export function readLocalCart(): LocalCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_KEY) ?? "[]");
    return Array.isArray(parsed) ? normalize(parsed) : [];
  } catch {
    return [];
  }
}

export function writeLocalCart(items: LocalCartItem[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(normalize(items)));
  window.dispatchEvent(new Event("jelly-cart-change"));
}

export function addLocalCartItem(variantId: string, quantity = 1) {
  const items = readLocalCart();
  const existing = items.find((item) => item.variantId === variantId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ variantId, quantity });
  }
  writeLocalCart(items);
}

export function setLocalCartItem(variantId: string, quantity: number) {
  writeLocalCart(
    readLocalCart()
      .map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
      .filter((item) => item.quantity > 0)
  );
}

export function clearLocalCart() {
  window.localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("jelly-cart-change"));
}
