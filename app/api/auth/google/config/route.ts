import { env } from "cloudflare:workers";

export async function GET() {
  const clientId = (env as unknown as { GOOGLE_CLIENT_ID?: string }).GOOGLE_CLIENT_ID;
  return Response.json({ clientId: clientId || null }, {
    headers: { "cache-control": "public, max-age=300" },
  });
}
