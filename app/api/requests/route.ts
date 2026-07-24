import { env } from "cloudflare:workers";

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Données invalides." }, { status: 400 });

  const name = clean(body.name, 100);
  const phone = clean(body.phone, 30);
  const location = clean(body.location, 160);
  const machine = clean(body.machine, 120);
  const urgency = clean(body.urgency, 60);
  const errorMessage = clean(body.error, 160);
  const problem = clean(body.problem, 3000);
  if (!name || !phone || !location || !machine || !urgency || problem.length < 10 || body.legalConsent !== true) {
    return Response.json({ error: "Veuillez compléter tous les champs obligatoires." }, { status: 422 });
  }

  const latitude = typeof body.latitude === "number" && body.latitude >= -90 && body.latitude <= 90 ? body.latitude : null;
  const longitude = typeof body.longitude === "number" && body.longitude >= -180 && body.longitude <= 180 ? body.longitude : null;
  const id = `RS-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO support_requests
      (id, name, phone, location, latitude, longitude, machine, urgency, error_message, problem, status, consented_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'nouvelle', ?, ?)`,
  ).bind(id, name, phone, location, latitude, longitude, machine, urgency, errorMessage || null, problem, now, now).run();

  return Response.json({ id, status: "nouvelle" }, { status: 201 });
}
