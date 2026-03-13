import { ReactNode, useEffect } from "react";
import { Navbar } from "./Navbar";
import { useAuth } from "@/store/use-auth";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export function AppLayout({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const isPublic = location === "/login" || location === "/register";
    const isLoggedIn = !!session;

    if (!isLoggedIn && !isPublic) {
      setLocation("/login");
    } else if (isLoggedIn && isPublic) {
      setLocation("/dashboard");
    }
  }, [location, session, setLocation]);

  // If trying to access protected route without session, render nothing while redirecting
  if (!session && location !== "/login" && location !== "/register") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary app-gradient-bg">
      {session && <Navbar />}
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
