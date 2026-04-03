import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const STORAGE_KEY = "newsletter_subscribed";

const triggerHaptic = (pattern: number | number[]) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

const NewsletterSubscribe = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setSubscribed(true);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || subscribed) return;

    setLoading(true);
    triggerHaptic(30); // Light tap on submit
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        }
      );
      
      const data = await response.json();
      const error = !response.ok ? data : null;

      if (error) {
        const errorType = error.error;
        const message = error.message || "Something went wrong. Please try again.";

        if (errorType === "duplicate") {
          triggerHaptic([100, 50, 100]);
          toast.warning("Already Subscribed", {
            description: message,
            duration: 4000,
          });
          localStorage.setItem(STORAGE_KEY, "true");
          setSubscribed(true);
        } else if (errorType === "rate_limited") {
          triggerHaptic([200, 100, 200, 100, 200]);
          toast.error("Limit Reached", {
            description: message,
            duration: 4000,
          });
        } else if (errorType === "invalid_email") {
          triggerHaptic([100, 50, 100]);
          toast.error("Invalid Email", {
            description: message,
            duration: 3000,
          });
        } else {
          triggerHaptic([200, 100, 200]);
          toast.error("Oops!", {
            description: message,
            duration: 4000,
          });
        }
      } else {
        // Success — gentle double tap
        triggerHaptic([40, 80, 40]);
        toast.success("Welcome!", {
          description: data?.message || "You've been subscribed successfully.",
          duration: 4000,
        });
        localStorage.setItem(STORAGE_KEY, "true");
        setSubscribed(true);
        setEmail("");
      }
    } catch {
      triggerHaptic([200, 100, 200]);
      toast.error("Connection Error", {
        description: "Please check your internet and try again.",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="mb-6">
        <p className="text-sm font-light text-muted-foreground">
          ✓ You're subscribed to our newsletter
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <p className="text-sm font-normal text-foreground mb-2">Newsletter</p>
      <p className="text-xs font-light text-muted-foreground mb-3">
        Subscribe for updates and exclusive offers.
      </p>
      <form onSubmit={handleSubscribe} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          disabled={loading}
          className="flex-1 min-w-0 px-3 py-2 text-sm bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 transition-all"
        />
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="px-4 py-2 text-sm bg-foreground text-background rounded-md hover:opacity-90 transition-all disabled:opacity-50 whitespace-nowrap flex items-center gap-2 min-w-[100px] justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Sending</span>
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </form>
    </div>
  );
};

export default NewsletterSubscribe;
