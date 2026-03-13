import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Hexagon, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/store/use-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const login = useAuth((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      // Simulate network delay for better UX
      await new Promise(r => setTimeout(r, 800));
      login(values.email, values.password);
      toast.success("Welcome back!");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative z-10 bg-background/50 backdrop-blur-3xl lg:backdrop-blur-none lg:bg-background">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <Hexagon className="h-10 w-10 text-primary fill-primary/20" />
              </div>
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-lg">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <Card className="p-8 shadow-xl shadow-primary/5 border-border/50 bg-background/80 backdrop-blur-md">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@example.com" 
                          className="h-12 bg-secondary/50 border-secondary-border focus-visible:ring-primary/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-foreground/80">Password</FormLabel>
                      </div>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="h-12 bg-secondary/50 border-secondary-border focus-visible:ring-primary/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <>Sign in <ArrowRight className="ml-2 h-5 w-5" /></>
                  )}
                </Button>
              </form>
            </Form>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Shopping Panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center">
        {/* Warm gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-400 to-pink-500" />
        <div className="absolute inset-0 bg-gradient-to-tl from-yellow-300/40 via-transparent to-transparent" />

        {/* Floating emoji decorations */}
        <span className="absolute top-10 left-10 text-5xl animate-bounce" style={{ animationDelay: '0s',   animationDuration: '3s' }}>🛍️</span>
        <span className="absolute top-24 right-16 text-4xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}>🎁</span>
        <span className="absolute bottom-20 left-16 text-4xl animate-bounce" style={{ animationDelay: '1s',  animationDuration: '4s' }}>🛒</span>
        <span className="absolute bottom-32 right-12 text-5xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }}>⚡</span>
        <span className="absolute top-1/2 left-8 text-3xl animate-bounce"   style={{ animationDelay: '0.8s', animationDuration: '2.8s' }}>✨</span>
        <span className="absolute top-16 left-1/2 text-3xl animate-bounce"  style={{ animationDelay: '1.2s', animationDuration: '3.8s' }}>💥</span>

        {/* Center content card */}
        <div className="relative z-10 max-w-sm mx-12 text-center space-y-6">
          <div className="text-7xl mb-2">🛍️</div>
          <h2 className="text-4xl font-display font-extrabold text-white drop-shadow-md leading-tight">
            Your Favourite<br />Store is Here!
          </h2>
          <p className="text-white/90 text-lg leading-relaxed drop-shadow-sm">
            Shop thousands of products, grab the best deals, and enjoy a seamless experience — all in ₹.
          </p>

          {/* Deal pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {["🔥 Hot Deals", "🏷️ Best Prices", "🚀 Fast Checkout", "⭐ Top Rated"].map(label => (
              <span key={label} className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full border border-white/30">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
