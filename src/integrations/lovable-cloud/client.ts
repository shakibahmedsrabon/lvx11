/**
 * Lovable Cloud client — separate from the external data client.
 * Used for admin authentication and the user_roles table.
 */
import { createClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_SUPABASE_URL as string;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const cloudSupabase = createClient(URL, KEY, {
  auth: {
    storage: localStorage,
    storageKey: "lovable-cloud-auth",
    persistSession: true,
    autoRefreshToken: true,
  },
});
