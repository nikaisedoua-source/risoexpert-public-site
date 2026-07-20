import { env } from "cloudflare:workers";

type CloudflareRequest = Request & {
  cf?: { city?: string; country?: string; latitude?: string; longitude?: string };
};

async function snapshot() {
  const rows = await env.DB.prepare(
    "SELECT city, country, latitude, longitude, visits FROM visitor_locations ORDER BY visits DESC LIMIT 50",
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
  const cookies = request.headers.get("cookie") ?? "";
  const alreadyCounted = cookies.includes("risoexpert_visit=");
  const alreadyLocated = cookies.includes("risoexpert_geo=");
  const supplied = await request.json().catch(() => ({})) as Record<string, unknown>;
  const safeText = (value: unknown, fallback: string) => typeof value === "string" && value.trim().length > 0 && value.trim().length <= 100 ? value.trim() : fallback;
  const city = request.cf?.city?.trim() || safeText(supplied.city, "Localisation inconnue");
  const country = request.cf?.country?.trim() || safeText(supplied.country, "—");
  const suppliedLatitude = typeof supplied.latitude === "number" ? supplied.latitude : Number.NaN;
  const suppliedLongitude = typeof supplied.longitude === "number" ? supplied.longitude : Number.NaN;
  const cfLatitude = Number.parseFloat(request.cf?.latitude ?? "");
  const cfLongitude = Number.parseFloat(request.cf?.longitude ?? "");
  const latitude = Number.isFinite(cfLatitude) ? cfLatitude : suppliedLatitude;
  const longitude = Number.isFinite(cfLongitude) ? cfLongitude : suppliedLongitude;
  const validLatitude = Number.isFinite(latitude) && latitude >= -90 && latitude <= 90;
  const validLongitude = Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
  const hasRealLocation = city !== "Localisation inconnue" && country !== "—" && validLatitude && validLongitude;
  const cityKey = `${country}:${city}`.toLocaleLowerCase("fr");
  const upsertLocation = () => env.DB.prepare(
      `INSERT INTO visitor_locations(city_key, city, country, latitude, longitude, visits, updated_at)
       VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
       ON CONFLICT(city_key) DO UPDATE SET
         visits = visits + 1,
         latitude = COALESCE(excluded.latitude, latitude),
         longitude = COALESCE(excluded.longitude, longitude),
         updated_at = CURRENT_TIMESTAMP`,
    ).bind(cityKey, city, country, validLatitude ? latitude : null, validLongitude ? longitude : null);

  if (!alreadyCounted) {
    await upsertLocation().run();
  } else if (hasRealLocation && !alreadyLocated) {
    const unknown = await env.DB.prepare(
      "SELECT visits FROM visitor_locations WHERE city_key = ?",
    ).bind("—:localisation inconnue").first<{ visits: number }>();
    if (Number(unknown?.visits ?? 0) > 0) {
      await env.DB.batch([
        env.DB.prepare("UPDATE visitor_locations SET visits = visits - 1, updated_at = CURRENT_TIMESTAMP WHERE city_key = ? AND visits > 0").bind("—:localisation inconnue"),
        env.DB.prepare("DELETE FROM visitor_locations WHERE city_key = ? AND visits <= 0").bind("—:localisation inconnue"),
        upsertLocation(),
      ]);
    }
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
  if (hasRealLocation && !alreadyLocated) {
    response.headers.append(
      "set-cookie",
      `risoexpert_geo=${encodeURIComponent(cityKey)}; Max-Age=31536000; Path=/; Secure; SameSite=Lax`,
    );
  }
  return response;
}
