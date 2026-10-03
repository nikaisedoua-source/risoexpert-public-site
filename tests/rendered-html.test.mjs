import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/", host = "risoexpert.website") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", process.pid + "-" + Date.now() + "-" + path + "-" + host);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("https://" + host + path, { headers: { accept: "text/html", host, "x-forwarded-host": host, "x-forwarded-proto": "https" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("rend le site unifié et conserve les services, les communautés et les fonctions existantes", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html lang="fr">/i);
  assert.match(html, /RisoExpert \| Technicien RISO en Côte d’Ivoire/);
  assert.match(html, /L’expertise RISO, à portée de main/);
  assert.match(html, /google-site-verification/);
  assert.match(html, /fW1ox3Pn4mb5nef3Lxk6ffyM0kDgtYhxi9cmeTKxRpE/);
  assert.match(html, /Diagnostic, dépannage, maintenance et suivi machine/);
  assert.match(html, /https:\/\/wa\.me\/2250777808051/);
  assert.match(html, /tel:\+2250777808051/);
  assert.match(html, /facebook\.com\/people\/Techniciens-Riso-ci\/61558758369166/);
  assert.match(html, /instagram\.com\/risoexpert\.ci/);
  assert.match(html, /linkedin\.com\/company\/risoexpert/);
  assert.match(html, /x\.com\/RisoExpertCI/);
  assert.match(html, /t\.me\/\+WSj_HtJdAts5N2E0/);
  assert.match(html, /whatsapp\.com\/channel\/0029VaeghXMATRSuL58NHn1x/);
  assert.match(html, /Expliquez votre problème maintenant/);
  assert.match(html, /Devis avant intervention/);
  assert.match(html, /Identifiez votre modèle parmi les références RISO/);
  assert.match(html, /Avis clients/);
  assert.match(html, /Questions fréquentes/);
  assert.match(html, /Imprimerie Nouvelle Vision/);
  assert.match(html, /href="\/api\/android-apk"/);
  assert.match(html, /Télécharger l’APK/);
  assert.match(html, /href="\/confidentialite"/);
  assert.match(html, /href="\/conditions"/);
  assert.doesNotMatch(html, /Cameroun|risoexpert\.odoo\.com|nikaisedoua\.chatgpt\.site|DecassanKoui|nikaise-doua/i);
  assert.doesNotMatch(html, /visites enregistrées|premières visites réelles|suivi GPS/i);
});

test("les partages et le référencement utilisent le domaine officiel même avec un hôte différent", async () => {
  const html = await (await render("/", "preview.example.test")).text();
  assert.match(html, /property="og:image" content="https:\/\/risoexpert\.website\/og\.png"/);
  assert.match(html, /property="og:url" content="https:\/\/risoexpert\.website\/"/);
  assert.match(html, /rel="canonical" href="https:\/\/risoexpert\.website\/"/);
  assert.doesNotMatch(html, /preview\.example\.test|localhost|codex-preview|Building your site/);
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

test("les fichiers de référencement annoncent seulement le domaine officiel", async () => {
  const robots = await render("/robots.txt", "preview.example.test");
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap: https:\/\/risoexpert\.website\/sitemap\.xml/);
  const sitemap = await render("/sitemap.xml", "preview.example.test");
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  assert.match(xml, /<loc>https:\/\/risoexpert\.website\/<\/loc>/);
  assert.match(xml, /<loc>https:\/\/risoexpert\.website\/conditions<\/loc>/);
  assert.doesNotMatch(xml, /preview\.example\.test/);
});
