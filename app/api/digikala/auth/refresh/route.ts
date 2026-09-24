import { NextResponse } from "next/server";
import { getDigikalaConfig } from "@/lib/digikala/config";
import { readDigikalaAuthState, writeDigikalaAuthState } from "@/lib/digikala/storage";

export const runtime = "nodejs";

export async function POST() {
  try {
    const state = await readDigikalaAuthState();
    const refreshToken = state.refreshToken;

    if (!refreshToken) {
      return NextResponse.json({ ok: false, error: "No Digikala refresh token is stored on the server." }, { status: 400 });
    }

    const baseUrl = getDigikalaConfig().baseUrl.replace(/\/+$/, "");
    const response = await fetch(`${baseUrl}/open-api/v1/auth/refresh-token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: state.accessToken ?? "",
        refresh_token: refreshToken,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    if (!response.ok) {
      throw new Error(`Digikala refresh failed with status ${response.status}.`);
    }

    const data =
      payload.data && typeof payload.data === "object"
        ? (payload.data as Record<string, unknown>)
        : {};

    const nextAccessToken =
      typeof data.access_token === "string" ? data.access_token : "";

    const nextRefreshToken =
      typeof data.refresh_token === "string"
        ? data.refresh_token
        : refreshToken;

    await writeDigikalaAuthState({
      ...state,
      id: "default",
      accessToken: nextAccessToken || state.accessToken,
      refreshToken: nextRefreshToken,
      lastAuthenticatedAt: new Date().toISOString(),
      status: nextAccessToken ? "ACTIVE" : "FAILED",
    });

    return NextResponse.json({
      ok: true,
      accessTokenReceived: Boolean(nextAccessToken),
      refreshTokenReceived: Boolean(nextRefreshToken),
      response: {
        accessToken: nextAccessToken ? "[REDACTED]" : undefined,
        refreshToken: nextRefreshToken ? "[REDACTED]" : undefined,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Digikala refresh error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
