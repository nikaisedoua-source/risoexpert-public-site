import { env } from "cloudflare:workers";

type ReviewUser = {
  id: string;
  name: string;
  picture: string;
};

type RuntimeEnv = {
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
};

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

async function currentUser(request: Request): Promise<ReviewUser | null> {
  const bearer = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  const runtime = env as unknown as RuntimeEnv;
  if (bearer && runtime.SUPABASE_URL && runtime.SUPABASE_PUBLISHABLE_KEY) {
    const response = await fetch(`${runtime.SUPABASE_URL.replace(/\/$/, "")}/auth/v1/user`, {
      headers: {
        apikey: runtime.SUPABASE_PUBLISHABLE_KEY,
        authorization: `Bearer ${bearer}`,
      },
    });
    if (response.ok) {
      const account = await response.json() as {
        id: string;
        email?: string;
        user_metadata?: { full_name?: string; avatar_url?: string; picture?: string };
      };
      const picture = account.user_metadata?.avatar_url || account.user_metadata?.picture || "";
      if (!picture) return null;
      return {
        id: account.id,
        name: account.user_metadata?.full_name || account.email || "Client",
        picture,
      };
    }
  }

  const token = (request.headers.get("cookie") ?? "").match(/(?:^|;\s*)riso_session=([^;]+)/)?.[1];
  if (!token) return null;
  const account = await env.DB.prepare(
    `SELECT u.id, u.name, u.picture FROM user_sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > CURRENT_TIMESTAMP`,
  ).bind(await sha256(token)).first<{ id: string; name: string; picture: string | null }>();
  return account?.picture ? { id: account.id, name: account.name, picture: account.picture } : null;
}

export async function GET() {
  const rows = await env.DB.prepare(
    `SELECT id, author_name AS authorName, profile_picture AS profilePicture,
       country, rating, comment, created_at AS createdAt
     FROM customer_reviews
     WHERE status = 'published' AND profile_picture IS NOT NULL
     ORDER BY created_at DESC LIMIT 40`,
  ).all();
  return Response.json({ reviews: rows.results }, {
    headers: { "cache-control": "public, max-age=60" },
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Données invalides." }, { status: 400 });
  if (clean(body.website, 200)) return new Response(null, { status: 204 });

  const user = await currentUser(request);
  if (!user) {
    return Response.json(
      { error: "Connectez-vous avec un compte possédant une photo de profil." },
      { status: 401 },
    );
  }

  const country = clean(body.country, 2).toUpperCase();
  const comment = clean(body.comment, 600);
  const rating = Number(body.rating);
  if (
    !["CI", "CM"].includes(country)
    || !Number.isInteger(rating) || rating < 1 || rating > 5
    || comment.length < 10
  ) {
    return Response.json({ error: "Vérifiez la note et le commentaire." }, { status: 422 });
  }

  const day = new Date().toISOString().slice(0, 10);
  const address = request.headers.get("cf-connecting-ip") ?? "unknown";
  const agent = request.headers.get("user-agent") ?? "unknown";
  const clientHash = await sha256(`${day}:${address}:${agent}`);
  const existing = await env.DB.prepare(
    "SELECT id FROM customer_reviews WHERE user_id = ? AND created_at >= ? LIMIT 1",
  ).bind(user.id, `${day}T00:00:00.000Z`).first();
  if (existing) {
    return Response.json(
      { error: "Un seul avis peut être publié par appareil et par jour." },
      { status: 429 },
    );
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO customer_reviews
      (id, user_id, author_name, profile_picture, country, rating, comment,
       client_hash, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)`,
  ).bind(
    id, user.id, user.name, user.picture, country, rating, comment, clientHash, createdAt,
  ).run();
  return Response.json({
    review: {
      id,
      authorName: user.name,
      profilePicture: user.picture,
      country,
      rating,
      comment,
      createdAt,
    },
  }, { status: 201 });
}
