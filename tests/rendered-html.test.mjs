import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://risoexpert.odoo.com${path}`, {
      headers: {
        accept: "text/html",
        host: "risoexpert.odoo.com",
        "x-forwarded-host": "risoexpert.odoo.com",
        "x-forwarded-proto": "https",
      },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("rend la vitrine commerciale avec ses contacts et son SEO", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="fr">/i);
  assert.match(html, /RisoExpert \| Assistance RISO en Côte d’Ivoire et au Cameroun/);
  assert.match(
    html,
    /<meta name="google-site-verification" content="fW1ox3Pn4mb5nef3Lxk6ffyM0kDgtYhxi9cmeTKxRpE"\/>/,
  );
  assert.match(html, /L’assistance technique RISO/);
  assert.match(html, /https:\/\/wa\.me\/2250777808051/);
  assert.match(html, /tel:\+2250777808051/);
  assert.match(html, /facebook\.com\/people\/Techniciens-Riso-ci\/61558758369166/);
  assert.match(html, /linkedin\.com\/company\/risoexpert/);
  assert.match(html, /x\.com\/RisoExpertCI/);
  assert.match(html, /whatsapp\.com\/channel\/0029VaeghXMATRSuL58NHn1x/);
  assert.match(html, /wa\.me\/23777416692/);
  assert.doesNotMatch(html, /nikaise-doua|DecassanKoui/);
  assert.match(html, /Expliquez votre problème maintenant/);
  assert.match(html, /Devis avant intervention/);
  assert.match(html, /Côte d’Ivoire 🇨🇮 et Cameroun 🇨🇲/i);
  assert.match(html, /RisoExpert traverse les frontières/i);
  assert.match(html, /Douala/);
  assert.match(html, /Yaoundé/);
  assert.match(html, /guide technique essentiel/i);
  assert.match(html, /Source officielle RISO/i);
  assert.match(html, /Les modèles RISO, actuels et historiques/i);
  assert.match(html, /ComColor GN/i);
  assert.match(html, /Questions fréquentes/);
  assert.match(html, /Votre expérience compte/);
  assert.match(html, /Publier mon avis/);
  assert.match(html, /Appeler en urgence/);
  assert.match(html, /href="\/api\/android-apk"/);
  assert.match(html, /Télécharger l’APK Android/);
  assert.doesNotMatch(html, /visites enregistrées|premières visites réelles|suivi GPS/i);
  assert.match(html, /href="\/confidentialite"/);
  assert.match(html, /href="\/conditions"/);
  assert.match(html, /property="og:image" content="https:\/\/risoexpert\.odoo\.com\/og\.png"/);
  assert.doesNotMatch(html, /localhost|codex-preview|Building your site/);
});

test("rend les conditions d’utilisation", async () => {
  const response = await render("/conditions");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Conditions d’utilisation/);
  assert.match(html, /Données et sécurité/);
  assert.match(html, /droit de Côte d’Ivoire/);
  assert.match(html, /ne vaut pas renonciation aux droits légaux/i);
});

test("rend la politique de confidentialité", async () => {
  const response = await render("/confidentialite");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Politique de confidentialité/);
  assert.match(html, /Données collectées/);
  assert.match(html, /Vos droits/);
  assert.match(html, /suppression définitive du compte/i);
  assert.match(html, /Supabase/);
  assert.match(html, /Firebase/);
});

test("expose les fichiers de référencement", async () => {
  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap: https:\/\/risoexpert\.odoo\.com\/sitemap\.xml/);

  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  assert.match(xml, /<loc>https:\/\/risoexpert\.odoo\.com\/<\/loc>/);
  assert.match(xml, /<loc>https:\/\/risoexpert\.odoo\.com\/conditions<\/loc>/);
});
