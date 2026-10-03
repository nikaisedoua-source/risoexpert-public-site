import { SITE_ORIGIN } from "../site-config";

export async function GET() {
  const origin = SITE_ORIGIN;
  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`,
    { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } },
  );
}
