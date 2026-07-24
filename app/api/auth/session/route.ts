import { env } from "cloudflare:workers";

const sha256 = async (value: string) => {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

export async function GET(request: Request) {
  const token = (request.headers.get("cookie") ?? "").match(/(?:^|;\s*)riso_session=([^;]+)/)?.[1];
  if (!token) return Response.json({ user: null });
  const hash = await sha256(token);
  const user = await env.DB.prepare(
    `SELECT u.name, u.email, u.picture FROM user_sessions s
     JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > CURRENT_TIMESTAMP`,
  ).bind(hash).first();
  return Response.json({ user: user || null }, { headers: { "cache-control": "no-store" } });
}

export async function DELETE(request: Request) {
  const token = (request.headers.get("cookie") ?? "").match(/(?:^|;\s*)riso_session=([^;]+)/)?.[1];
  if (token) await env.DB.prepare("DELETE FROM user_sessions WHERE token_hash = ?").bind(await sha256(token)).run();
  const response = Response.json({ signedOut: true });
  response.headers.append("set-cookie", "riso_session=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax");
  return response;
}
