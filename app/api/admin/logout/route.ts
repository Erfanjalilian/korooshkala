import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true, loggedOut: true });
  return clearAdminSessionCookie(response);
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true, loggedOut: true });
  return clearAdminSessionCookie(response);
}
