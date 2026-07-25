import { env } from "cloudflare:workers";

export async function GET() {
  const runtime = env as unknown as {
    GOOGLE_CLIENT_ID?: string;
    SUPABASE_URL?: string;
    SUPABASE_PUBLISHABLE_KEY?: string;
  };
  return Response.json({
    clientId: runtime.GOOGLE_CLIENT_ID || null,
    supabaseUrl: runtime.SUPABASE_URL || null,
    supabasePublishableKey: runtime.SUPABASE_PUBLISHABLE_KEY || null,
  }, {
    headers: { "cache-control": "public, max-age=300" },
  });
}
