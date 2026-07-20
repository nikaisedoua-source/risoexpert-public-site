import { env } from "cloudflare:workers";

type CloudflareRequest = Request & {
  cf?: { city?: string; country?: string; latitude?: string; longitude?: string };
};

async function snapshot() {
  const rows = await env.DB.prepare(
    "SELECT city, country, latitude, longitude, visits FROM visitor_locations ORDER BY visits DESC LIMIT 12",
  ).all();
  const total = await env.DB.prepare(
    "SELECT COALESCE(SUM(visits), 0) AS total FROM visitor_locations",
  ).first<{ total: number }>();
  return { total: Number(total?.total ?? 0), locations: rows.results };
}

export async function GET() {
  return Response.json(await snapshot(), {
    headers: { "cache-control": "no-store" },
  });
}

export async function POST(request: CloudflareRequest) {
  const alreadyCounted = request.headers.get("cookie")?.includes("risoexpert_visit=");
  if (!alreadyCounted) {
    const city = request.cf?.city?.trim() || "Localisation inconnue";
    const country = request.cf?.country?.trim() || "—";
    const latitude = Number.parseFloat(request.cf?.latitude ?? "");
    const longitude = Number.parseFloat(request.cf?.longitude ?? "");
    const cityKey = `${country}:${city}`.toLocaleLowerCase("fr");
    await env.DB.prepare(
      `INSERT INTO visitor_locations(city_key, city, country, latitude, longitude, visits, updated_at)
       VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
       ON CONFLICT(city_key) DO UPDATE SET
         visits = visits + 1,
         latitude = COALESCE(excluded.latitude, latitude),
         longitude = COALESCE(excluded.longitude, longitude),
         updated_at = CURRENT_TIMESTAMP`,
    )
      .bind(
        cityKey,
        city,
        country,
        Number.isFinite(latitude) ? latitude : null,
        Number.isFinite(longitude) ? longitude : null,
      )
      .run();
  }
  const response = Response.json(await snapshot(), {
    headers: { "cache-control": "no-store" },
  });
  if (!alreadyCounted) {
    response.headers.append(
      "set-cookie",
      "risoexpert_visit=1; Max-Age=86400; Path=/; Secure; SameSite=Lax",
    );
  }
  return response;
}
