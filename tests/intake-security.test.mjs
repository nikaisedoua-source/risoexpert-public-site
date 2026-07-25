import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const [route, form, schema, migration] = await Promise.all([
  readFile(new URL("app/api/requests/route.ts", root), "utf8"),
  readFile(new URL("app/request-form.tsx", root), "utf8"),
  readFile(new URL("db/schema.ts", root), "utf8"),
  readFile(new URL("drizzle/0003_first_veda.sql", root), "utf8"),
]);

test("valide le formulaire public côté serveur", () => {
  assert.match(route, /body\.legalConsent !== true/);
  assert.match(route, /allowedUrgencies\.has\(urgency\)/);
  assert.match(route, /problem\.length < 10/);
  assert.match(route, /Trop de demandes/);
  assert.match(form, /name="website"/);
});

test("ne stocke pas l'adresse IP brute et associe la session disponible", () => {
  assert.match(route, /sha256\(`\$\{day\}:\$\{address\}:\$\{agent\}`\)/);
  assert.doesNotMatch(schema, /ipAddress|ip_address/);
  assert.match(schema, /userId: text\("user_id"\)/);
  assert.match(migration, /ADD `user_id` text/);
});

test("bascule vers Supabase sans repli silencieux en cas d'erreur métier", () => {
  assert.match(route, /public_support_intakes/);
  assert.match(route, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(route, /throw new Error\("La plateforme métier est momentanément indisponible\."\)/);
  assert.match(route, /if \(!savedToSupabase\)/);
});
