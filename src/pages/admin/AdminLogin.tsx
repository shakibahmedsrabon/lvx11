import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";

/**
 * Admin login — Lovable Cloud email/password. After sign-in we verify the
 * 'admin' role; if missing, the user is signed out immediately.
 */
const AdminLogin = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // If already authed + admin, bounce to /admin
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (role) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast({
          title: "Account created",
          description:
            "Ekhon ekta admin role assign korte hobe — Lovable Cloud > Users e giye apnar user_id niye user_roles table e ('admin') row add korte hobe, othoba ami niche instruction dichchi.",
        });
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("No user");
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!role) {
        await supabase.auth.signOut();
        throw new Error("This account has no admin role.");
      }
      navigate("/admin", { replace: true });
    } catch (err) {
      toast({
        title: "Login failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <SEOHead title="Admin Login" />
      <form
        onSubmit={handle}
        className="w-full max-w-sm space-y-5 border border-border p-8"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-light">Admin {mode === "signup" ? "Signup" : "Login"}</h1>
          <p className="text-xs text-muted-foreground">
            Restricted — admin role required.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </div>
        <Button type="submit" className="w-full rounded-none" disabled={busy}>
          {busy ? "..." : mode === "signup" ? "Create account" : "Sign in"}
        </Button>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="block text-xs text-muted-foreground hover:text-foreground w-full text-center"
        >
          {mode === "signin"
            ? "First time? Create admin account"
            : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
