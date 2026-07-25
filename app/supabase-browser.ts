"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

type AuthConfig = {
  supabaseUrl?: string | null;
  supabasePublishableKey?: string | null;
};

let clientPromise: Promise<SupabaseClient | null> | null = null;

export function getSupabaseBrowserClient() {
  clientPromise ??= fetch("/api/auth/google/config")
    .then((response) => response.json() as Promise<AuthConfig>)
    .then((config) => {
      if (!config.supabaseUrl || !config.supabasePublishableKey) return null;
      return createClient(config.supabaseUrl, config.supabasePublishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    })
    .catch(() => null);
  return clientPromise;
}

export async function currentSupabaseAccessToken() {
  const client = await getSupabaseBrowserClient();
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data.session?.access_token ?? null;
}
