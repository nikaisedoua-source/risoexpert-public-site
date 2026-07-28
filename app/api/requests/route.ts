import { env } from "cloudflare:workers";

type RuntimeEnv = {
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

type SessionUser = {
  id: string;
  email: string;
  name: string;
};

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

async function currentUser(request: Request): Promise<SessionUser | null> {
  const bearer = request.headers.get("authorization")
    ?.match(/^Bearer\s+(.+)$/i)?.[1];
  const runtime = env as unknown as RuntimeEnv;
  if (bearer && runtime.SUPABASE_URL && runtime.SUPABASE_PUBLISHABLE_KEY) {
    const response = await fetch(
      `${runtime.SUPABASE_URL.replace(/\/$/, "")}/auth/v1/user`,
      {
        headers: {
          apikey: runtime.SUPABASE_PUBLISHABLE_KEY,
          authorization: `Bearer ${bearer}`,
        },
      },
    );
    if (response.ok) {
      const account = await response.json() as {
        id: string;
        email?: string;
        user_metadata?: { full_name?: string };
      };
      return {
        id: account.id,
        email: account.email ?? "",
        name: account.user_metadata?.full_name ?? account.email ?? "Client",
      };
    }
  }
  const token = (request.headers.get("cookie") ?? "")
    .match(/(?:^|;\s*)riso_session=([^;]+)/)?.[1];
  if (!token) return null;
  return await env.DB.prepare(
    `SELECT u.id, u.email, u.name FROM user_sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > CURRENT_TIMESTAMP`,
  ).bind(await sha256(token)).first<SessionUser>();
}

async function enforceRateLimit(request: Request) {
  const day = new Date().toISOString().slice(0, 10);
  const address = request.headers.get("cf-connecting-ip") ?? "unknown";
  const agent = request.headers.get("user-agent") ?? "unknown";
  const clientHash = await sha256(`${day}:${address}:${agent}`);
  const key = `${day}:${clientHash}`;
  const updated = await env.DB.prepare(
    `INSERT INTO intake_rate_limits(key, client_hash, day, requests, updated_at)
     VALUES (?, ?, ?, 1, ?)
     ON CONFLICT(key) DO UPDATE SET
       requests = requests + 1, updated_at = excluded.updated_at
     RETURNING requests`,
  ).bind(key, clientHash, day, new Date().toISOString())
    .first<{ requests: number }>();
  if ((updated?.requests ?? 1) > 10) {
    throw new Response(
      JSON.stringify({ error: "Trop de demandes. Réessayez demain ou contactez-nous directement." }),
      { status: 429, headers: { "content-type": "application/json", "retry-after": "3600" } },
    );
  }
}

async function saveToSupabase(payload: Record<string, unknown>) {
  const runtime = env as unknown as RuntimeEnv;
  if (!runtime.SUPABASE_URL || !runtime.SUPABASE_SERVICE_ROLE_KEY) return false;
  const response = await fetch(
    `${runtime.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/public_support_intakes`,
    {
      method: "POST",
      headers: {
        apikey: runtime.SUPABASE_SERVICE_ROLE_KEY,
        authorization: `Bearer ${runtime.SUPABASE_SERVICE_ROLE_KEY}`,
        "content-type": "application/json",
        prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    },
  );
  if (!response.ok) {
    console.error("public_intake_failed", response.status);
    throw new Error("La plateforme métier est momentanément indisponible.");
  }
  return true;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Données invalides." }, { status: 400 });
  if (clean(body.website, 200)) return new Response(null, { status: 204 });

  const name = clean(body.name, 100);
  const phone = clean(body.phone, 30);
  const city = clean(body.location, 140);
  const country = clean(body.country, 2).toUpperCase();
  const allowedCountries = new Set(["CI", "CM"]);
  const location = `${country} — ${city}`;
  const machine = clean(body.machine, 120);
  const urgency = clean(body.urgency, 60);
  const errorMessage = clean(body.error, 160);
  const problem = clean(body.problem, 3000);
  const allowedUrgencies = new Set([
    "Normale",
    "Élevée",
    "Critique — production arrêtée",
  ]);
  if (
    !name || !/^[+()0-9 .-]{8,30}$/.test(phone) || !city
    || !allowedCountries.has(country) || !machine
    || !allowedUrgencies.has(urgency) || problem.length < 10
    || body.legalConsent !== true
  ) {
    return Response.json(
      { error: "Veuillez vérifier les champs obligatoires." },
      { status: 422 },
    );
  }

  try {
    await enforceRateLimit(request);
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: "Vérification temporairement indisponible." }, { status: 503 });
  }

  const latitude =
    typeof body.latitude === "number" && body.latitude >= -90 && body.latitude <= 90
      ? body.latitude
      : null;
  const longitude =
    typeof body.longitude === "number" && body.longitude >= -180 && body.longitude <= 180
      ? body.longitude
      : null;
  const reference =
    `RS-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const now = new Date().toISOString();
  const user = await currentUser(request);
  const intake = {
    reference,
    source: "public_site",
    source_user_id:
      user && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(user.id)
        ? user.id
        : null,
    source_user_email: user?.email ?? null,
    name,
    phone,
    location,
    latitude,
    longitude,
    machine,
    urgency,
    error_message: errorMessage || null,
    problem,
    consented_at: now,
    status: "new",
    created_at: now,
  };

  try {
    const savedToSupabase = await saveToSupabase(intake);
    if (!savedToSupabase) {
      await env.DB.prepare(
        `INSERT INTO support_requests
          (id, user_id, name, phone, location, latitude, longitude, machine,
           urgency, error_message, problem, status, consented_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'nouvelle', ?, ?)`,
      ).bind(
        reference,
        user?.id ?? null,
        name,
        phone,
        location,
        latitude,
        longitude,
        machine,
        urgency,
        errorMessage || null,
        problem,
        now,
        now,
      ).run();
    }
    return Response.json({ id: reference, status: "nouvelle" }, { status: 201 });
  } catch (error) {
    console.error("request_save_failed", error instanceof Error ? error.message : "unknown");
    return Response.json(
      { error: "Enregistrement impossible pour le moment. Contactez-nous par téléphone ou WhatsApp." },
      { status: 503 },
    );
  }
}
