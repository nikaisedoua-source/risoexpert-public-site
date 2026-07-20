import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://riso-assist-pro.ci${path}`, {
      headers: {
        accept: "text/html",
        host: "riso-assist-pro.ci",
        "x-forwarded-host": "riso-assist-pro.ci",
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
  assert.match(html, /RisoExpert \| Technicien RISO en Côte d’Ivoire/);
  assert.match(html, /L’assistance technique RISO/);
  assert.match(html, /https:\/\/wa\.me\/2250777808051/);
  assert.match(html, /tel:\+2250777808051/);
  assert.match(html, /facebook\.com\/people\/Maintenancier-Riso\/61581266351611/);
  assert.match(html, /Expliquez votre problème maintenant/);
  assert.match(html, /href="\/api\/android-apk"/);
  assert.match(html, /visites enregistrées/);
  assert.match(html, /href="\/confidentialite"/);
  assert.match(html, /href="\/conditions"/);
  assert.match(html, /property="og:image" content="https:\/\/riso-assist-pro\.ci\/og\.png"/);
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
