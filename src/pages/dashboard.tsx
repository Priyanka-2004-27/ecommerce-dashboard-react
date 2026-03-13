import { useAuth } from "@/store/use-auth";
import { useCart } from "@/store/use-cart";
import { useProducts } from "@/hooks/use-products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, TrendingUp, IndianRupee, ArrowRight, Sparkles, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { formatINR } from "@/lib/currency";

export default function Dashboard() {
  const { session } = useAuth();
  const { data: products, isLoading } = useProducts();
  const cartTotal = useCart((state) => state.getCartTotal());
  const cartCount = useCart((state) => state.getCartCount());

  const user = session?.user;

  const stats = [
    {
      title: "Total Value in Cart",
      value: formatINR(cartTotal),
      icon: IndianRupee,
      description: "Ready for checkout",
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      title: "Items in Cart",
      value: cartCount,
      icon: ShoppingBag,
      description: "Across all categories",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Available Products",
      value: isLoading ? "-" : products?.length || 0,
      icon: Package,
      description: "In global catalog",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Active Session",
      value: "Active",
      icon: TrendingUp,
      description: "Currently logged in",
      color: "text-violet-500",
      bg: "bg-violet-500/10"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">

      {/* ── Hero Store Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border shadow-xl">
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600" />
        <div className="absolute inset-0 bg-gradient-to-tl from-yellow-400/30 via-transparent to-transparent" />
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-300/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-300/10 rounded-full blur-2xl" />

        {/* Floating badge */}
        <div className="relative z-10 px-8 md:px-14 pt-10 pb-10 md:pb-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-5 text-center md:text-left">
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full border border-white/20">
              <Sparkles className="w-4 h-4" />
              Curated for you
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight drop-shadow-sm">
              Welcome to My<br />
              <span className="text-yellow-300">E-Commerce Store</span>
            </h1>
            <p className="text-white/80 text-lg max-w-xl leading-relaxed">
              Discover thousands of premium products at unbeatable prices — all in <span className="font-semibold text-white">Indian Rupees ₹</span>.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
              <Link href="/products">
                <Button size="lg" className="rounded-xl bg-white text-indigo-700 hover:bg-white/90 shadow-lg font-semibold h-12 px-6 text-base">
                  Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/cart">
                <Button size="lg" variant="outline" className="rounded-xl border-white/30 text-white hover:bg-white/10 h-12 px-6 text-base">
                  View Cart <ShoppingBag className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side — offer pill */}
          <div className="shrink-0 flex flex-col items-center gap-3">
            <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center text-white space-y-1 shadow-xl">
              <Tag className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
              <p className="text-sm font-medium opacity-80">Today's Deals</p>
              <p className="text-4xl font-extrabold text-yellow-300">20% OFF</p>
              <p className="text-sm opacity-75">on selected items</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Welcome Message ── */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Good to see you, <span className="text-primary">{user?.name?.split(' ')[0] || 'User'}</span> 👋
          </h2>
          <p className="text-muted-foreground mt-1">
            Here's a quick look at your store activity today.
          </p>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/60 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-display font-bold tracking-tight text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
