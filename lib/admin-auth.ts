import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE_NAME = "korooshkala_admin";

const ADMIN_SECRET_KEYS = ["ADMIN_SECRET", "KOROOSHKALA_ADMIN_SECRET"] as const;

export const getAdminSecret = () =>
  ADMIN_SECRET_KEYS.map((key) => process.env[key]).find((value) => Boolean(value?.trim()))?.trim() ?? "";

export const hasAdminSecretConfigured = () => Boolean(getAdminSecret());

export const isAdminAuthBypassed = () => process.env.NODE_ENV === "development";

const signToken = (value: string, secret: string) => createHmac("sha256", secret).update(value).digest("hex");

export const createAdminSessionToken = () => {
  const payload = randomBytes(24).toString("hex");
  const secret = getAdminSecret();
  if (!secret) throw new Error("ADMIN_SECRET is not configured on the server.");
  const signature = signToken(payload, secret);
  return `${payload}.${signature}`;
};

const getCookieValue = (cookieHeader: string | null | undefined, name: string) => {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.split(";").find((entry) => entry.trim().startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : undefined;
};

export const isValidAdminCookieToken = (token: string | undefined) => {
  if (!token || !hasAdminSecretConfigured()) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expectedSignature = signToken(payload, getAdminSecret());
  if (expectedSignature.length !== signature.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
  } catch {
    return false;
  }
};

export const isAuthorizedAdminRequest = (request: Request) => {
  if (isAdminAuthBypassed()) return true;

  const secret = getAdminSecret();
  if (!secret) return false;

  const bearerToken = request.headers.get("authorization");
  if (bearerToken && bearerToken.startsWith("Bearer ") && bearerToken.slice(7).trim() === secret) {
    return true;
  }

  const sharedSecretHeader = request.headers.get("x-admin-secret") ?? request.headers.get("x-admin-token");
  if (sharedSecretHeader && sharedSecretHeader.trim() === secret) {
    return true;
  }

  const cookieToken = getCookieValue(request.headers.get("cookie"), ADMIN_COOKIE_NAME);
  return isValidAdminCookieToken(cookieToken);
};

export const responseWithAdminUnauthorized = () =>
  NextResponse.json({ error: "Unauthorized. Configure ADMIN_SECRET and sign in via /api/admin/login." }, { status: 401 });

export const setAdminSessionCookie = (response: NextResponse) => {
  const value = createAdminSessionToken();
  response.cookies.set(ADMIN_COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
};

export const clearAdminSessionCookie = (response: NextResponse) => {
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
};
