import { env } from "cloudflare:workers";

const objectKey = "RisoExpert-Android.apk";

type RuntimeEnv = {
  APK_BUCKET?: R2Bucket;
  APK_UPLOAD_SECRET?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

function bucket() {
  const value = (env as unknown as RuntimeEnv).APK_BUCKET;
  if (!value) throw new Error("Stockage APK indisponible");
  return value;
}

async function recordDownload() {
  const runtime = env as unknown as RuntimeEnv;
  if (!runtime.SUPABASE_URL || !runtime.SUPABASE_SERVICE_ROLE_KEY) return null;
  const response = await fetch(
    `${runtime.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/rpc/record_android_download`,
    {
      method: "POST",
      headers: {
        apikey: runtime.SUPABASE_SERVICE_ROLE_KEY,
        authorization: `Bearer ${runtime.SUPABASE_SERVICE_ROLE_KEY}`,
        "content-type": "application/json",
      },
      body: "{}",
    },
  );
  if (!response.ok) {
    console.error("android_download_count_failed", response.status);
    return null;
  }
  return await response.json() as {
    version_name?: string;
    checksum_sha256?: string;
  } | null;
}

export async function GET() {
  const object = await bucket().get(objectKey);
  if (!object) {
    return Response.json(
      { error: "L’application est momentanément indisponible." },
      { status: 503 },
    );
  }
  const release = await recordDownload();
  return new Response(object.body, {
    headers: {
      "content-type": "application/vnd.android.package-archive",
      "content-disposition": `attachment; filename="${objectKey}"`,
      "content-length": String(object.size),
      "cache-control": "public, max-age=3600",
      "x-content-type-options": "nosniff",
      ...(release?.version_name
        ? { "x-risoexpert-version": release.version_name }
        : {}),
      ...(release?.checksum_sha256
        ? { "x-risoexpert-sha256": release.checksum_sha256 }
        : {}),
    },
  });
}

export async function PUT(request: Request) {
  const expected = (env as unknown as RuntimeEnv).APK_UPLOAD_SECRET;
  if (!expected || request.headers.get("authorization") !== `Bearer ${expected}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!request.body) return new Response("Missing body", { status: 400 });
  await bucket().put(objectKey, request.body, {
    httpMetadata: {
      contentType: "application/vnd.android.package-archive",
      contentDisposition: `attachment; filename="${objectKey}"`,
    },
  });
  return Response.json({ uploaded: true });
}
