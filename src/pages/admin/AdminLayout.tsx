import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "./useAdminAuth";
import { ADMIN_TABLES } from "./adminConfig";
import { LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminLayout = () => {
  const { loading, isAdmin } = useAdminAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }
  if (!isAdmin) return null;

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-60 border-r border-border flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Admin</p>
          <p className="text-base font-medium">Control Panel</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 text-sm">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-5 py-2 hover:bg-muted",
                isActive && "bg-muted font-medium",
              )
            }
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </NavLink>
          <div className="mt-2 px-5 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
            Manage
          </div>
          {ADMIN_TABLES.map((t) => (
            <NavLink
              key={t.key}
              to={`/admin/${t.key}`}
              className={({ isActive }) =>
                cn(
                  "block px-5 py-2 hover:bg-muted",
                  isActive && "bg-muted font-medium",
                )
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-3 space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-none"
            onClick={() => window.open("/", "_blank")}
          >
            View site
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full rounded-none"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
