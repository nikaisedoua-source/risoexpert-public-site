import { env } from "cloudflare:workers";

const objectKey = "RisoExpert-Android.apk";

function bucket() {
  const value = (env as unknown as { APK_BUCKET?: R2Bucket }).APK_BUCKET;
  if (!value) throw new Error("Stockage APK indisponible");
  return value;
}

export async function GET() {
  const object = await bucket().get(objectKey);
  if (!object) {
    return Response.json(
      { error: "L’application est momentanément indisponible." },
      { status: 503 },
    );
  }
  return new Response(object.body, {
    headers: {
      "content-type": "application/vnd.android.package-archive",
      "content-disposition": `attachment; filename="${objectKey}"`,
      "content-length": String(object.size),
      "cache-control": "public, max-age=3600",
      "x-content-type-options": "nosniff",
    },
  });
}

export async function PUT(request: Request) {
  const expected = (env as unknown as { APK_UPLOAD_SECRET?: string })
    .APK_UPLOAD_SECRET;
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
