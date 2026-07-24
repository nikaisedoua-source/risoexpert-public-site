import { env } from "cloudflare:workers";

type GoogleProfile = {
  aud?: string; sub?: string; email?: string; email_verified?: string;
  name?: string; picture?: string;
};

const sha256 = async (value: string) => {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

export async function POST(request: Request) {
  const { credential } = await request.json().catch(() => ({ credential: null })) as { credential?: string };
  const clientId = (env as unknown as { GOOGLE_CLIENT_ID?: string }).GOOGLE_CLIENT_ID;
  if (!clientId || !credential) return Response.json({ error: "Connexion indisponible." }, { status: 400 });

  const verification = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
  const profile = verification.ok ? await verification.json() as GoogleProfile : null;
  if (!profile?.sub || profile.aud !== clientId || !profile.email || profile.email_verified !== "true") {
    return Response.json({ error: "Identité Google non valide." }, { status: 401 });
  }

  const now = new Date();
  const userId = `usr_${profile.sub}`;
  await env.DB.prepare(
    `INSERT INTO users(id, google_sub, email, name, picture, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(google_sub) DO UPDATE SET email=excluded.email, name=excluded.name,
       picture=excluded.picture, updated_at=excluded.updated_at`,
  ).bind(userId, profile.sub, profile.email, profile.name || profile.email, profile.picture || null, now.toISOString(), now.toISOString()).run();

  const token = crypto.randomUUID() + crypto.randomUUID();
  const tokenHash = await sha256(token);
  const expires = new Date(now.getTime() + 30 * 86400_000);
  await env.DB.prepare(
    "INSERT INTO user_sessions(token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
  ).bind(tokenHash, userId, expires.toISOString(), now.toISOString()).run();

  const response = Response.json({ user: { email: profile.email, name: profile.name, picture: profile.picture } });
  response.headers.append("set-cookie", `riso_session=${token}; Max-Age=2592000; Path=/; HttpOnly; Secure; SameSite=Lax`);
  return response;
}
