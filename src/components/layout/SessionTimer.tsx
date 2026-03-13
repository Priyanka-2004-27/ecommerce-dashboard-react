import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useAuth } from "@/store/use-auth";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SessionTimer() {
  const { session, checkSession, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [warningShown, setWarningShown] = useState(false);

  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, session.expiresAt - now);
      setTimeLeft(remaining);

      // Warning at 1 minute
      if (remaining <= 60000 && remaining > 0 && !warningShown) {
        toast.warning("Session expiring soon", {
          description: "Your session will expire in 1 minute. Activity will refresh it.",
        });
        setWarningShown(true);
      }

      // Expired
      if (remaining === 0) {
        clearInterval(interval);
        if (checkSession() === false) { // double check and clear
          toast.error("Session Expired", {
            description: "Please log in again to continue.",
          });
          setLocation("/login");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session, warningShown, checkSession, setLocation]);

  // Reset warning when session gets extended
  useEffect(() => {
    if (timeLeft > 60000) {
      setWarningShown(false);
    }
  }, [timeLeft]);

  if (!session) return null;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const isDanger = timeLeft <= 60000;

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors duration-300",
      isDanger 
        ? "bg-destructive/10 text-destructive border-destructive/20 animate-pulse" 
        : "bg-secondary text-secondary-foreground border-border"
    )}>
      <Clock className="w-4 h-4" />
      <span className="tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
