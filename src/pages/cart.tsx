import { useCart } from "@/store/use-cart";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { formatINR } from "@/lib/currency";

export default function Cart() {
  const { getCart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  
  const cartItems = getCart();
  const total = getCartTotal();
  const tax = total * 0.08; // 8% tax mock
  const shipping = total > 0 && total < 50 ? 10 : 0; // free shipping over $50
  const finalTotal = total + tax + shipping;

  const handleCheckout = () => {
    toast.success("Checkout Initiated", {
      description: "In a real app, this would route to a payment processor.",
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto w-full">
        <div className="bg-primary/5 p-6 rounded-full mb-6">
          <ShoppingBag className="w-20 h-20 text-primary opacity-80" />
        </div>
        <h2 className="text-3xl font-display font-bold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground text-lg mb-8">
          Looks like you haven't added anything to your cart yet. Browse our products to find something you'll love.
        </p>
        <Link href="/products">
          <Button size="lg" className="rounded-full shadow-lg h-14 px-8 text-lg">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <h1 className="text-3xl font-display font-bold tracking-tight text-foreground mb-8">
        Shopping Cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3 space-y-4">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="overflow-hidden border-border/50 shadow-sm bg-card">
                  <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Item Image */}
                    <div className="w-full sm:w-32 h-32 bg-white rounded-xl flex items-center justify-center p-4 border shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="max-w-full max-h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold text-lg line-clamp-2">{item.title}</h3>
                      <p className="text-2xl font-bold text-foreground py-2">
                        {formatINR(item.price)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row sm:flex-col items-center justify-between w-full sm:w-auto gap-4">
                      <div className="flex items-center border rounded-full bg-secondary/50 p-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full hover:bg-background shadow-sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full hover:bg-background shadow-sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 sm:w-full rounded-full"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Remove</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
          <Card className="border-border shadow-md bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-display font-bold">Order Summary</h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">{formatINR(total)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-medium text-foreground">{formatINR(tax)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-medium text-green-500">Free</span>
                  ) : (
                    <span className="font-medium text-foreground">{formatINR(shipping)}</span>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between items-end">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-3xl font-bold tracking-tight text-primary">
                    {formatINR(finalTotal)}
                  </span>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <Button 
                  className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/25"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure encrypted checkout</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
