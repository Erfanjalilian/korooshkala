import { NextResponse } from "next/server";
import { clearAdminSessionCookie, getAdminSecret, hasAdminSecretConfigured, setAdminSessionCookie } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { secret?: string };
  const providedSecret = String(body.secret ?? "").trim();
  const headerSecret = request.headers.get("x-admin-secret") ?? request.headers.get("x-admin-token") ?? "";
  const secret = providedSecret || headerSecret.trim();
  const expectedSecret = getAdminSecret();

  if (!hasAdminSecretConfigured()) {
    return NextResponse.json({ error: "ADMIN_SECRET is required to enable administrator access." }, { status: 503 });
  }

  if (!secret || secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, authenticated: true });
  return setAdminSessionCookie(response);
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  return clearAdminSessionCookie(response);
}
