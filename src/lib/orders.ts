export type OrderStatus = "confirmed" | "preparing" | "out" | "delivered";

export type OrderItem = { name: string; price: number; qty: number };

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  type: "delivery" | "pickup" | "dine-in";
  customerName?: string;
  customerPhone?: string;
  placedAt: number; // epoch ms
};

const KEY = "brewbuzz.orders";

export function loadOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveOrder(o: Order) {
  const list = loadOrders();
  list.unshift(o);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 30)));
  window.dispatchEvent(new Event("brewbuzz:orders"));
}

// Derive status from time elapsed (simulated kitchen + delivery progress)
export function statusOf(o: Order): { status: OrderStatus; progress: number } {
  const elapsed = (Date.now() - o.placedAt) / 1000; // seconds
  if (o.type === "dine-in") {
    if (elapsed < 60) return { status: "confirmed", progress: 0.25 };
    if (elapsed < 300) return { status: "preparing", progress: 0.6 };
    return { status: "delivered", progress: 1 };
  }
  if (elapsed < 90) return { status: "confirmed", progress: 0.2 };
  if (elapsed < 480) return { status: "preparing", progress: 0.5 };
  if (elapsed < 1500) return { status: "out", progress: 0.8 };
  return { status: "delivered", progress: 1 };
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  confirmed: "Order Confirmed",
  preparing: "Preparing in Kitchen",
  out: "Out for Delivery",
  delivered: "Delivered",
};

export const WHATSAPP_NUMBER = "919640723456";

export function buildWhatsappMessage(o: Order): string {
  const lines = [
    `*New Order — Brew Buzz*`,
    `Order ID: ${o.id}`,
    `Type: ${o.type.toUpperCase()}`,
    o.customerName ? `Name: ${o.customerName}` : "",
    o.customerPhone ? `Phone: ${o.customerPhone}` : "",
    ``,
    `*Items:*`,
    ...o.items.map((i) => `• ${i.name} × ${i.qty} — ₹${i.price * i.qty}`),
    ``,
    `*Total: ₹${o.total}*`,
    ``,
    `Please confirm my order. Thank you!`,
  ].filter(Boolean);
  return lines.join("\n");
}

export function whatsappUrl(o: Order): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsappMessage(o))}`;
}
