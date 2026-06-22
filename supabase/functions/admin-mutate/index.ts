// Admin proxy: validates the caller is an authenticated admin on Lovable Cloud,
// then performs CRUD on the EXTERNAL Supabase project (where all app data lives)
// using the service-role key.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Lovable Cloud (auth)
const CLOUD_URL = Deno.env.get("SUPABASE_URL")!;
const CLOUD_ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const CLOUD_SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// External Supabase (data) — apnar app er actual database
const EXT_URL = "https://jqxesguuoxgithnqdtgl.supabase.co";
const EXT_SERVICE = Deno.env.get("EXTERNAL_SUPABASE_SERVICE_ROLE_KEY")!;

// Whitelist of tables that admins are allowed to manage
const ALLOWED_TABLES = new Set([
  "Products",
  "Category",
  "Top Products",
  "Sliders",
  "Banner",
  "Site config",
  "All-About",
  "All-Policy",
  "FAQ",
  "Refund and exchange policy",
  "Terms of Service",
  "Connects",
  "Channels",
  "Groups",
  "Social Platforms",
  "Reviews",
  "Subscribers",
]);

type Op = "insert" | "update" | "delete";

interface Payload {
  op: Op;
  table: string;
  values?: Record<string, unknown>;
  match?: Record<string, unknown>;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return json({ error: "Missing bearer token" }, 401);
    }

    // Verify user via Lovable Cloud
    const cloud = createClient(CLOUD_URL, CLOUD_ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userRes, error: userErr } = await cloud.auth.getUser();
    if (userErr || !userRes?.user) {
      return json({ error: "Unauthorized" }, 401);
    }

    // Check admin role via service-role client
    const cloudAdmin = createClient(CLOUD_URL, CLOUD_SERVICE);
    const { data: roleRow } = await cloudAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userRes.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) return json({ error: "Forbidden — admin only" }, 403);

    // Parse + validate body
    const body = (await req.json()) as Payload;
    if (!body?.op || !body?.table) return json({ error: "op + table required" }, 400);
    if (!ALLOWED_TABLES.has(body.table)) return json({ error: "Table not allowed" }, 400);
    if (!["insert", "update", "delete"].includes(body.op)) {
      return json({ error: "Invalid op" }, 400);
    }

    // Execute on external Supabase
    const ext = createClient(EXT_URL, EXT_SERVICE);
    let result;
    if (body.op === "insert") {
      if (!body.values) return json({ error: "values required" }, 400);
      result = await ext.from(body.table).insert(body.values).select();
    } else if (body.op === "update") {
      if (!body.values || !body.match) {
        return json({ error: "values + match required" }, 400);
      }
      let q = ext.from(body.table).update(body.values);
      for (const [k, v] of Object.entries(body.match)) q = q.eq(k, v as never);
      result = await q.select();
    } else {
      if (!body.match) return json({ error: "match required" }, 400);
      let q = ext.from(body.table).delete();
      for (const [k, v] of Object.entries(body.match)) q = q.eq(k, v as never);
      result = await q.select();
    }

    if (result.error) return json({ error: result.error.message }, 400);
    return json({ data: result.data });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
