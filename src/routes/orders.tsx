import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Coffee, ClipboardList, Check, ChefHat, Bike, PackageCheck,
  MessageCircle, ShoppingBag,
} from "lucide-react";
import {
  loadOrders, statusOf, whatsappUrl, STATUS_LABELS,
  type Order, type OrderStatus,
} from "@/lib/orders";

export const Route = createFileRoute("/orders")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Your Orders — Brew Buzz" },
      { name: "description", content: "Track your Brew Buzz orders and delivery status in real time." },
    ],
  }),
  component: OrdersPage,
});

const STEPS: { key: OrderStatus; label: string; Icon: typeof Check }[] = [
  { key: "confirmed", label: "Confirmed", Icon: Check },
  { key: "preparing", label: "Preparing", Icon: ChefHat },
  { key: "out", label: "Out for Delivery", Icon: Bike },
  { key: "delivered", label: "Delivered", Icon: PackageCheck },
];
const ORDER: OrderStatus[] = ["confirmed", "preparing", "out", "delivered"];

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [, tick] = useState(0);

  useEffect(() => {
    const sync = () => setOrders(loadOrders());
    sync();
    window.addEventListener("brewbuzz:orders", sync);
    window.addEventListener("storage", sync);
    const t = setInterval(() => tick((n) => n + 1), 15_000);
    return () => {
      window.removeEventListener("brewbuzz:orders", sync);
      window.removeEventListener("storage", sync);
      clearInterval(t);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="w-9 h-9 rounded-full grid place-items-center" style={{ background: "var(--gradient-gold)" }}>
              <Coffee className="w-5 h-5 text-[color:var(--ink)]" />
            </span>
            Brew <span className="text-gradient-gold">Buzz</span>
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link to="/"><ArrowLeft className="w-4 h-4 mr-1" /> Back home</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-12">
        <div className="mb-10">
          <span className="text-accent text-xs tracking-[0.3em] uppercase">My Orders</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-3">Order History & Status</h1>
          <p className="text-muted-foreground mt-2">Live status of your recent Brew Buzz orders.</p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center">
            <div className="w-16 h-16 rounded-full grid place-items-center mx-auto mb-4" style={{ background: "var(--gradient-gold)" }}>
              <ClipboardList className="w-7 h-7 text-[color:var(--ink)]" />
            </div>
            <h2 className="font-display text-2xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Place your first order to see it here.</p>
            <Button asChild className="shadow-gold" style={{ background: "var(--gradient-gold)", color: "var(--ink)" }}>
              <Link to="/"><ShoppingBag className="w-4 h-4 mr-2" /> Browse Menu</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((o) => <OrderCard key={o.id} order={o} />)}
          </div>
        )}
      </main>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const { status } = statusOf(order);
  const activeIdx = ORDER.indexOf(status);
  const placed = new Date(order.placedAt).toLocaleString("en-IN", {
    dateStyle: "medium", timeStyle: "short",
  });

  return (
    <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-luxe">
      <div className="p-6 border-b border-border flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{order.id}</span>
            <span>•</span>
            <span>{placed}</span>
          </div>
          <div className="font-display text-2xl font-semibold mt-1">
            {order.items.length} item{order.items.length > 1 ? "s" : ""} · <span className="text-gradient-gold">₹{order.total}</span>
          </div>
        </div>
        <span
          className="text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{
            background: status === "delivered"
              ? "color-mix(in oklab, var(--gold) 25%, transparent)"
              : "color-mix(in oklab, var(--coffee) 15%, transparent)",
            color: status === "delivered" ? "var(--coffee)" : "var(--coffee)",
            border: "1px solid color-mix(in oklab, var(--gold) 40%, transparent)",
          }}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      {/* Tracker */}
      <div className="px-6 pt-7 pb-2">
        <div className="relative flex justify-between">
          <div className="absolute left-5 right-5 top-5 h-0.5 bg-border" />
          <div
            className="absolute left-5 top-5 h-0.5 transition-all duration-700"
            style={{
              width: `calc((100% - 2.5rem) * ${activeIdx / (STEPS.length - 1)})`,
              background: "var(--gradient-gold)",
            }}
          />
          {STEPS.map(({ key, label, Icon }, i) => {
            const done = i <= activeIdx;
            return (
              <div key={key} className="relative z-10 flex flex-col items-center w-1/4">
                <div
                  className={`w-10 h-10 rounded-full grid place-items-center border-2 transition-all ${done ? "shadow-gold" : ""}`}
                  style={{
                    background: done ? "var(--gradient-gold)" : "var(--background)",
                    borderColor: done ? "transparent" : "var(--border)",
                    color: done ? "var(--ink)" : "var(--muted-foreground)",
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`mt-2 text-[11px] sm:text-xs text-center ${done ? "font-semibold" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items */}
      <div className="px-6 py-5 border-t border-border bg-muted/30">
        <div className="space-y-2">
          {order.items.map((it) => (
            <div key={it.name} className="flex justify-between text-sm">
              <span>{it.name} <span className="text-muted-foreground">× {it.qty}</span></span>
              <span className="font-medium">₹{it.price * it.qty}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 flex flex-wrap gap-2 justify-end border-t border-border">
        <Button asChild variant="outline" size="sm">
          <a href={whatsappUrl(order)} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-4 h-4 mr-1" /> Confirm on WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
