import { supabase as cloud } from "@/integrations/supabase/client";
import { createClient } from "@supabase/supabase-js";

/**
 * External Supabase client — anon key only, READ-only from the client.
 * All admin reads of the actual app data go through this. Writes go through
 * the `admin-mutate` edge function which uses the service-role key server-side.
 */
const EXT_URL = "https://jqxesguuoxgithnqdtgl.supabase.co";
const EXT_ANON = "sb_publishable_jh1j7FRESieIGOCnrzPPSg_F_1XL3lw";

export const extSupabase = createClient(EXT_URL, EXT_ANON);

export type AdminOp = "insert" | "update" | "delete";

export async function adminMutate(
  op: AdminOp,
  table: string,
  payload: { values?: Record<string, unknown>; match?: Record<string, unknown> } = {},
) {
  const { data, error } = await cloud.functions.invoke("admin-mutate", {
    body: { op, table, ...payload },
  });
  if (error) throw new Error(error.message);
  if ((data as any)?.error) throw new Error((data as any).error);
  return (data as any)?.data;
}
