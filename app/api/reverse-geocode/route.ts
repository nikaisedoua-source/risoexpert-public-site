export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { latitude?: number; longitude?: number };
  const { latitude, longitude } = body;
  if (typeof latitude !== "number" || typeof longitude !== "number" || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return Response.json({ error: "Coordonnées invalides." }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", latitude.toFixed(6));
  url.searchParams.set("lon", longitude.toFixed(6));
  url.searchParams.set("zoom", "10");
  url.searchParams.set("addressdetails", "1");
  const response = await fetch(url, {
    headers: {
      "user-agent": "RisoExpert/1.0 (+https://riso-assist-pro-ci.nikaisedoua.chatgpt.site)",
      "accept-language": "fr",
    },
  });
  if (!response.ok) return Response.json({ city: null }, { status: 502 });
  const result = await response.json() as { address?: Record<string, string> };
  const address = result.address ?? {};
  const city = address.city || address.town || address.municipality || address.village || address.county || null;
  return Response.json({ city, country: address.country_code?.toUpperCase() || "CI" }, {
    headers: { "cache-control": "public, max-age=86400" },
  });
}
