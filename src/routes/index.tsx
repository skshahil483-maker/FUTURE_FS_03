import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Coffee, UtensilsCrossed, Users, Zap, Sparkles, CarFront, Leaf, Smile,
  Star, MapPin, Phone, Clock, Menu as MenuIcon, X, Moon, Sun, ShoppingBag,
  Plus, Minus, Trash2, Instagram, Facebook, Twitter, MessageCircle, ChevronDown,
} from "lucide-react";
import heroImg from "@/assets/hero-cafe.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brew Buzz — Cafe & Family Restaurant, Kovur Nellore" },
      { name: "description", content: "Premium coffee, South Indian breakfast & family dining in Kovur, Nellore. Reserve a table or order online at Brew Buzz." },
      { property: "og:title", content: "Brew Buzz — Where Great Coffee Meets Great Food" },
      { property: "og:description", content: "Kovur, Nellore's favourite cafe & family restaurant. Dine-in, pickup, delivery & reservations." },
    ],
  }),
  component: Index,
});

type MenuItem = { name: string; price: number; desc?: string };
type MenuCategory = { title: string; items: MenuItem[] };

const MENU: MenuCategory[] = [
  {
    title: "Breakfast",
    items: [
      { name: "Idly", price: 60, desc: "Soft steamed rice cakes with sambar & chutney" },
      { name: "Ghee Karam Idly", price: 90, desc: "Spicy ghee-roasted idly with podi" },
      { name: "Sambar Idly", price: 80, desc: "Idly soaked in flavourful sambar" },
      { name: "Vada", price: 70, desc: "Crispy lentil donuts" },
      { name: "Poori", price: 90, desc: "Fluffy pooris with potato curry" },
      { name: "Pongal", price: 100, desc: "Creamy rice & lentil pongal" },
      { name: "Plain Dosa", price: 90 },
      { name: "Ravva Dosa", price: 110 },
      { name: "Onion Dosa", price: 120 },
      { name: "Masala Dosa", price: 130 },
      { name: "Plain Pesarattu", price: 110 },
      { name: "Upma Pesarattu", price: 140 },
      { name: "Ghee Karam Dosa", price: 150 },
    ],
  },
  {
    title: "South Indian Specials",
    items: [
      { name: "Veg Thali", price: 220, desc: "Complete vegetarian platter" },
      { name: "Curd Rice", price: 120 },
      { name: "Ghee Sambar Rice", price: 140 },
      { name: "Chapati with Veg Curry", price: 150 },
      { name: "Chapati with Non Veg Curry", price: 220 },
    ],
  },
  {
    title: "Non Veg Specials",
    items: [
      { name: "Chicken Pickle Rice", price: 240 },
      { name: "Chicken Curry", price: 260 },
      { name: "Chicken Fry", price: 280 },
      { name: "Mutton Curry", price: 360 },
      { name: "Mutton Fry", price: 380 },
      { name: "Chef Special", price: 400, desc: "Today's house special" },
    ],
  },
  {
    title: "Beverages",
    items: [
      { name: "Tea", price: 40 },
      { name: "Coffee", price: 60, desc: "House blend filter coffee" },
      { name: "Horlicks", price: 70 },
      { name: "Boost", price: 70 },
    ],
  },
];

const SPECIALITIES = [
  { icon: Coffee, title: "Premium Coffee", text: "Freshly brewed with hand-picked beans." },
  { icon: UtensilsCrossed, title: "South Indian Breakfast", text: "Authentic tastes, traditional recipes." },
  { icon: Users, title: "Family Dining", text: "Spacious, comfortable family ambience." },
  { icon: Zap, title: "Fast Service", text: "Quick & attentive every visit." },
  { icon: Sparkles, title: "Hygienic Environment", text: "Spotless kitchens & dining." },
  { icon: CarFront, title: "Spacious Parking", text: "Stress-free arrival, always." },
  { icon: Leaf, title: "Fresh Ingredients", text: "Sourced daily from local markets." },
  { icon: Smile, title: "Friendly Staff", text: "Warm hospitality from the heart." },
];

const REVIEWS = [
  { name: "Ananya R.", text: "Excellent ambience and delicious food. Highly recommended." },
  { name: "Karthik V.", text: "Fast service and great coffee experience." },
  { name: "Meena S.", text: "Perfect family restaurant with quality food." },
];

const GALLERY = [
  "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
  "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80",
  "https://images.unsplash.com/photo-1525193612562-0ec53b0e5d7c?w=800&q=80",
  "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80",
];

function Index() {
  const [dark, setDark] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, { item: MenuItem; qty: number }>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(0);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const cartCount = Object.values(cart).reduce((a, b) => a + b.qty, 0);
  const cartTotal = Object.values(cart).reduce((a, b) => a + b.qty * b.item.price, 0);

  const addToCart = (item: MenuItem) => {
    setCart((c) => ({
      ...c,
      [item.name]: { item, qty: (c[item.name]?.qty ?? 0) + 1 },
    }));
    toast.success(`${item.name} added to cart`, { description: `₹${item.price} • Tap cart to checkout` });
  };
  const dec = (n: string) =>
    setCart((c) => {
      const cur = c[n];
      if (!cur) return c;
      if (cur.qty <= 1) { const { [n]: _, ...rest } = c; return rest; }
      return { ...c, [n]: { ...cur, qty: cur.qty - 1 } };
    });
  const remove = (n: string) => setCart((c) => { const { [n]: _, ...rest } = c; return rest; });

  const placeOrder = () => {
    if (!cartCount) return;
    toast.success("Order placed successfully!", {
      description: `${cartCount} item(s) • ₹${cartTotal}. Our team will call you shortly.`,
    });
    setCart({});
    setCartOpen(false);
  };

  const reserve = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim();
    if (!name) return toast.error("Please enter your name");
    toast.success("Table reserved!", { description: `Thank you, ${name}. We'll confirm shortly on WhatsApp.` });
    e.currentTarget.reset();
  };
  const sendContact = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim();
    if (!name) return toast.error("Please enter your name");
    toast.success("Message sent!", { description: `Thanks ${name}, we'll get back to you soon.` });
    e.currentTarget.reset();
  };

  const nav = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "menu", label: "Menu" },
    { id: "gallery", label: "Gallery" },
    { id: "reserve", label: "Reserve" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Toaster position="top-right" richColors />

      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-4">
          <a href="#home" className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="w-9 h-9 rounded-full grid place-items-center" style={{ background: "var(--gradient-gold)" }}>
              <Coffee className="w-5 h-5 text-[color:var(--ink)]" />
            </span>
            <span>Brew <span className="text-gradient-gold">Buzz</span></span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="relative hover:text-accent transition-colors">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={() => setDark((d) => !d)} aria-label="Toggle theme">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setCartOpen(true)} className="relative" aria-label="Cart">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-[color:var(--ink)] text-[10px] font-bold grid place-items-center">{cartCount}</span>
              )}
            </Button>
            <Button size="icon" variant="ghost" className="md:hidden" onClick={() => setNavOpen((v) => !v)} aria-label="Menu">
              {navOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        {navOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
            <div className="px-5 py-4 flex flex-col gap-3">
              {nav.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => setNavOpen(false)} className="py-1">{n.label}</a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="Brew Buzz cafe interior" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        {/* steam */}
        <div className="absolute left-1/2 bottom-20 -translate-x-1/2 pointer-events-none hidden md:block">
          {[0, 0.5, 1].map((d) => (
            <span key={d} className="absolute block w-2 h-16 rounded-full bg-white/40 blur-md animate-steam" style={{ left: `${d * 18 - 10}px`, animationDelay: `${d}s` }} />
          ))}
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-cream text-xs tracking-[0.2em] uppercase mb-6" style={{ color: "var(--cream)" }}>
            <Star className="w-3 h-3 fill-current text-[color:var(--gold)]" /> 4.5 • Kovur, Nellore
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-4" style={{ color: "var(--cream)" }}>
            Brew <span className="text-gradient-gold">Buzz</span>
          </h1>
          <p className="font-display italic text-xl md:text-2xl mb-4" style={{ color: "var(--cream)" }}>
            Where Great Coffee Meets Great Food
          </p>
          <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto" style={{ color: "color-mix(in oklab, var(--cream) 85%, transparent)" }}>
            Experience the perfect blend of premium coffee, delicious meals, and a warm atmosphere in the heart of Kovur, Nellore.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="shadow-gold" style={{ background: "var(--gradient-gold)", color: "var(--ink)" }}>
              <a href="#reserve">Reserve a Table</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="glass-dark border-[color:var(--gold)]" style={{ color: "var(--cream)" }}>
              <a href="#menu">View Menu</a>
            </Button>
          </div>
        </div>
        <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-scroll-bounce" style={{ color: "var(--cream)" }}>
          <ChevronDown className="w-7 h-7" />
        </a>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80" alt="" className="rounded-2xl shadow-luxe aspect-[4/5] object-cover animate-float-slow" loading="lazy" />
            <img src="https://images.unsplash.com/photo-1525193612562-0ec53b0e5d7c?w=600&q=80" alt="" className="rounded-2xl shadow-luxe aspect-[4/5] object-cover mt-10" loading="lazy" />
          </div>
          <div>
            <span className="text-accent text-xs tracking-[0.3em] uppercase">About Us</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-6">About <span className="text-gradient-gold">Brew Buzz</span></h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Brew Buzz is one of Nellore's favourite dining destinations — offering freshly prepared South Indian breakfasts, delicious meals, premium coffee, and family-friendly dining experiences. With exceptional service, comfortable ambience and quality ingredients, Brew Buzz has become a preferred stop for food lovers and coffee enthusiasts.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: "4.5★", l: "Customer Rating" },
                { v: "100+", l: "Happy Reviews" },
                { v: "Family", l: "Friendly Dining" },
                { v: "Fast", l: "Service" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-border bg-card p-5 hover:shadow-gold transition-shadow">
                  <div className="font-display text-3xl font-bold text-gradient-gold">{s.v}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SPECIALITIES */}
      <section className="py-24 px-6" style={{ backgroundColor: "color-mix(in oklab, var(--coffee) 8%, var(--background))" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-accent text-xs tracking-[0.3em] uppercase">Why us</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">What Makes Us Special</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SPECIALITIES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="group rounded-2xl glass p-6 hover:-translate-y-2 transition-all duration-300 hover:shadow-gold">
                <div className="w-12 h-12 rounded-xl grid place-items-center mb-4" style={{ background: "var(--gradient-gold)" }}>
                  <Icon className="w-6 h-6 text-[color:var(--ink)]" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-accent text-xs tracking-[0.3em] uppercase">Our Menu</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">Crafted With Love</h2>
            <p className="text-muted-foreground mt-3">₹200 – ₹400 per person • Add to cart or reserve a table</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {MENU.map((c, i) => (
              <button
                key={c.title}
                onClick={() => setActiveCat(i)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                  activeCat === i
                    ? "border-transparent text-[color:var(--ink)] shadow-gold"
                    : "border-border bg-card hover:border-accent"
                }`}
                style={activeCat === i ? { background: "var(--gradient-gold)" } : undefined}
              >
                {c.title}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {MENU[activeCat].items.map((item) => (
              <div key={item.name} className="group flex items-start gap-4 p-5 rounded-2xl border border-border bg-card hover:border-accent hover:shadow-gold transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3">
                    <h3 className="font-display text-lg font-semibold truncate">{item.name}</h3>
                    <div className="flex-1 border-b border-dashed border-border mb-1" />
                    <span className="font-semibold text-accent">₹{item.price}</span>
                  </div>
                  {item.desc && <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>}
                </div>
                <Button size="sm" onClick={() => addToCart(item)} className="shrink-0" style={{ background: "var(--gradient-gold)", color: "var(--ink)" }}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESERVE */}
      <section id="reserve" className="py-24 px-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--coffee), var(--ink))" }}>
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div style={{ color: "var(--cream)" }}>
            <span className="text-[color:var(--gold)] text-xs tracking-[0.3em] uppercase">Reservation</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-5">Reserve Your Table</h2>
            <p className="opacity-80 mb-6">Plan a cosy evening or a family lunch. Tell us when and we'll have your table ready.</p>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-3"><Clock className="w-4 h-4 text-[color:var(--gold)]" /> 7:00 AM – 11:00 PM</p>
              <p className="flex items-center gap-3"><Phone className="w-4 h-4 text-[color:var(--gold)]" /> +91 96407 23456</p>
              <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-[color:var(--gold)]" /> Kovur, Nellore, AP 524137</p>
            </div>
          </div>
          <form onSubmit={reserve} className="glass-dark rounded-3xl p-7 space-y-4" style={{ color: "var(--cream)" }}>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name"><Input name="name" required placeholder="Your name" className="bg-white/10 border-white/20 text-[color:var(--cream)] placeholder:text-white/50" /></Field>
              <Field label="Phone Number"><Input name="phone" required placeholder="+91 ..." className="bg-white/10 border-white/20 text-[color:var(--cream)] placeholder:text-white/50" /></Field>
              <Field label="Email"><Input name="email" type="email" placeholder="you@email.com" className="bg-white/10 border-white/20 text-[color:var(--cream)] placeholder:text-white/50" /></Field>
              <Field label="Guests"><Input name="guests" type="number" min={1} defaultValue={2} className="bg-white/10 border-white/20 text-[color:var(--cream)]" /></Field>
              <Field label="Date"><Input name="date" type="date" required className="bg-white/10 border-white/20 text-[color:var(--cream)]" /></Field>
              <Field label="Time"><Input name="time" type="time" required className="bg-white/10 border-white/20 text-[color:var(--cream)]" /></Field>
            </div>
            <Field label="Special Request">
              <Textarea name="request" rows={3} placeholder="Birthday, window seat, etc." className="bg-white/10 border-white/20 text-[color:var(--cream)] placeholder:text-white/50" />
            </Field>
            <Button type="submit" size="lg" className="w-full shadow-gold" style={{ background: "var(--gradient-gold)", color: "var(--ink)" }}>Reserve Table</Button>
          </form>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-accent text-xs tracking-[0.3em] uppercase">Gallery</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">A Taste Of Brew Buzz</h2>
          </div>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {GALLERY.map((src, i) => (
              <div key={src} className="break-inside-avoid overflow-hidden rounded-2xl group relative">
                <img src={src} alt="" loading="lazy" className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${i % 3 === 0 ? "aspect-[3/4]" : i % 2 === 0 ? "aspect-square" : "aspect-[4/5]"}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24 px-6" style={{ backgroundColor: "color-mix(in oklab, var(--coffee) 8%, var(--background))" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-accent text-xs tracking-[0.3em] uppercase">Reviews</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">Loved By Our Guests</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-2xl bg-card border border-border p-7 hover:shadow-gold transition-shadow">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[color:var(--gold)] text-[color:var(--gold)]" />
                  ))}
                </div>
                <p className="font-display italic text-lg mb-5">"{r.text}"</p>
                <p className="text-sm font-medium">— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT + LOCATION */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
          <div>
            <span className="text-accent text-xs tracking-[0.3em] uppercase">Contact</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-6">Get In Touch</h2>
            <form onSubmit={sendContact} className="space-y-4 rounded-3xl border border-border bg-card p-7">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name"><Input name="name" required placeholder="Your name" /></Field>
                <Field label="Email"><Input name="email" type="email" required placeholder="you@email.com" /></Field>
              </div>
              <Field label="Phone"><Input name="phone" placeholder="+91 ..." /></Field>
              <Field label="Message"><Textarea name="message" rows={4} required placeholder="Your message" /></Field>
              <Button type="submit" size="lg" className="w-full shadow-gold" style={{ background: "var(--gradient-gold)", color: "var(--ink)" }}>Send Message</Button>
            </form>
          </div>
          <div>
            <span className="text-accent text-xs tracking-[0.3em] uppercase">Visit Us</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-6">Find Brew Buzz</h2>
            <div className="rounded-3xl overflow-hidden border border-border shadow-luxe">
              <iframe
                title="Brew Buzz Location"
                src="https://www.google.com/maps?q=Kovur,Nellore,Andhra+Pradesh+524137&output=embed"
                className="w-full h-72 border-0"
                loading="lazy"
              />
              <div className="p-6 bg-card space-y-3">
                <p className="flex items-start gap-3 text-sm"><MapPin className="w-4 h-4 text-accent mt-0.5" /> Brew Buzz, Kovur, Nellore, Andhra Pradesh 524137</p>
                <p className="flex items-center gap-3 text-sm"><Phone className="w-4 h-4 text-accent" /> +91 96407 23456</p>
                <p className="flex items-center gap-3 text-sm"><Clock className="w-4 h-4 text-accent" /> 7:00 AM – 11:00 PM (Daily)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 pt-16 pb-8" style={{ background: "var(--ink)", color: "var(--cream)" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 font-display text-xl font-bold mb-4">
              <span className="w-9 h-9 rounded-full grid place-items-center" style={{ background: "var(--gradient-gold)" }}>
                <Coffee className="w-5 h-5 text-[color:var(--ink)]" />
              </span>
              Brew <span className="text-gradient-gold">Buzz</span>
            </div>
            <p className="text-sm opacity-70">Where great coffee meets great food. Kovur, Nellore's favourite cafe & family restaurant.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-[color:var(--gold)]">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-80">
              {nav.map((n) => <li key={n.id}><a href={`#${n.id}`} className="hover:text-[color:var(--gold)]">{n.label}</a></li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-[color:var(--gold)]">Menu</h4>
            <ul className="space-y-2 text-sm opacity-80">
              {MENU.map((c) => <li key={c.title}><a href="#menu" className="hover:text-[color:var(--gold)]">{c.title}</a></li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-[color:var(--gold)]">Contact</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Kovur, Nellore, AP 524137</li>
              <li>+91 96407 23456</li>
              <li>7:00 AM – 11:00 PM</li>
            </ul>
            <div className="flex gap-3 mt-4">
              {[Instagram, Facebook, Twitter].map((I, i) => (
                <a key={i} href="#" className="w-9 h-9 grid place-items-center rounded-full border border-white/15 hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] transition-colors">
                  <I className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 text-center text-xs opacity-60">
          © 2025 Brew Buzz. All Rights Reserved.
        </div>
      </footer>

      {/* WhatsApp floating */}
      <a
        href="https://wa.me/919640723456"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full grid place-items-center shadow-gold animate-float-slow"
        style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", color: "white" }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-[60]" onClick={() => setCartOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-background border-l border-border shadow-luxe flex flex-col animate-fade-up"
          >
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-display text-xl font-bold flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-accent" /> Your Cart</h3>
              <Button size="icon" variant="ghost" onClick={() => setCartOpen(false)}><X className="w-4 h-4" /></Button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cartCount === 0 ? (
                <p className="text-center text-muted-foreground py-16">Your cart is empty.<br />Browse the menu to add items.</p>
              ) : (
                Object.values(cart).map(({ item, qty }) => (
                  <div key={item.name} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">₹{item.price} × {qty}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => dec(item.name)}><Minus className="w-3 h-3" /></Button>
                      <span className="w-6 text-center text-sm">{qty}</span>
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => addToCart(item)}><Plus className="w-3 h-3" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => remove(item.name)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cartCount > 0 && (
              <div className="p-5 border-t border-border space-y-3">
                <div className="flex justify-between font-display text-lg"><span>Total</span><span className="text-gradient-gold font-bold">₹{cartTotal}</span></div>
                <Button onClick={placeOrder} size="lg" className="w-full shadow-gold" style={{ background: "var(--gradient-gold)", color: "var(--ink)" }}>Place Order</Button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider opacity-80">{label}</Label>
      {children}
    </div>
  );
}
