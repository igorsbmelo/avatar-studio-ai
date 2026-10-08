import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://hkbsfabrxgdwbjdveesz.supabase.co";

const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_phopOGsWG3qRAEchg2FeGw_FhDLp31m";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
