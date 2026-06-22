import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cloudSupabase as supabase } from "@/integrations/lovable-cloud/client";
import type { Session } from "@supabase/supabase-js";

/**
 * Checks the current Lovable Cloud auth session AND that the user has the
 * 'admin' role in user_roles. Returns auth state.
 */
export function useAdminAuth(redirectIfMissing = true) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const verify = async (s: Session | null) => {
      if (!s) {
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", s.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!mounted) return;
      setIsAdmin(!!data);
      setLoading(false);
    };

    // Listen first
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      verify(s);
    });

    // Then check existing session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      verify(data.session);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loading && redirectIfMissing && (!session || !isAdmin)) {
      navigate("/admin/login", { replace: true });
    }
  }, [loading, session, isAdmin, redirectIfMissing, navigate]);

  return { session, isAdmin, loading };
}
