import { Link, useLocation } from "wouter";
import { ShoppingBag, Package, LayoutDashboard, User, LogOut, Hexagon } from "lucide-react";
import { useAuth } from "@/store/use-auth";
import { useCart } from "@/store/use-cart";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const { session, logout } = useAuth();
  const cartCount = useCart((state) => state.getCartCount());

  if (!session) return null;

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/products", label: "Products", icon: Package },
    { href: "/cart", label: "Cart", icon: ShoppingBag, badge: cartCount },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Hexagon className="h-6 w-6 text-primary fill-primary/20" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
              Aura<span className="text-primary">Shop</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "relative h-10 px-4 gap-2 font-medium transition-all duration-300",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm animate-in zoom-in">
                        {link.badge}
                      </span>
                    )}
                    {isActive && (
                      <motion.div 
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-secondary/50 rounded-md -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleLogout}
              title="Logout"
              className="rounded-full w-10 h-10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (Bottom Bar style or simple scroll) */}
      <div className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 overflow-x-auto flex items-center gap-2 hide-scrollbar">
        {navLinks.map((link) => {
            const isActive = location === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className="flex-1 min-w-[80px]">
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full h-12 flex flex-col gap-1 items-center justify-center px-0 relative",
                    isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="absolute top-1 right-1/4 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {link.badge}
                    </span>
                  )}
                </Button>
              </Link>
            );
          })}
      </div>
    </nav>
  );
}
