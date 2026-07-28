import { env } from "cloudflare:workers";

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

export async function GET() {
  const rows = await env.DB.prepare(
    `SELECT id, author_name AS authorName, country, rating, comment, created_at AS createdAt
     FROM customer_reviews WHERE status = 'published'
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

  const authorName = clean(body.authorName, 60);
  const country = clean(body.country, 2).toUpperCase();
  const comment = clean(body.comment, 600);
  const rating = Number(body.rating);
  if (
    authorName.length < 2 || !["CI", "CM"].includes(country)
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
    "SELECT id FROM customer_reviews WHERE client_hash = ? AND created_at >= ? LIMIT 1",
  ).bind(clientHash, `${day}T00:00:00.000Z`).first();
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
      (id, author_name, country, rating, comment, client_hash, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'published', ?)`,
  ).bind(id, authorName, country, rating, comment, clientHash, createdAt).run();
  return Response.json({
    review: { id, authorName, country, rating, comment, createdAt },
  }, { status: 201 });
}
