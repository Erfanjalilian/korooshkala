import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_LIFETIME_SECONDS = 60 * 60 * 24 * 30;
const DEVELOPMENT_SECRET = "korooshkala-local-session-secret-only";

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (secret) {
    if (Buffer.byteLength(secret) < 32) {
      throw new Error("SESSION_SECRET must be at least 32 bytes.");
    }
    return secret;
  }
  if (process.env.NODE_ENV !== "production") return DEVELOPMENT_SECRET;
  throw new Error("SESSION_SECRET must be configured in production.");
}

function sign(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export function getSessionUserId(cookieHeader: string | null | undefined) {
  const match = cookieHeader?.match(/(?:^|;\s*)jk_session=([^;]+)/);
  const token = match?.[1];
  if (!token) return undefined;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return undefined;

  try {
    const expectedSignature = Buffer.from(sign(encodedPayload));
    const actualSignature = Buffer.from(signature);
    if (actualSignature.length !== expectedSignature.length || !timingSafeEqual(actualSignature, expectedSignature)) {
      return undefined;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as {
      userId?: unknown;
      expiresAt?: unknown;
    };
    if (typeof payload.userId !== "string" || typeof payload.expiresAt !== "number" || payload.expiresAt <= Date.now()) {
      return undefined;
    }
    return payload.userId;
  } catch {
    return undefined;
  }
}

export function createSession(userId: string) {
  const encodedPayload = Buffer.from(JSON.stringify({
    userId,
    expiresAt: Date.now() + SESSION_LIFETIME_SECONDS * 1000,
  })).toString("base64url");
  return `${encodedPayload}.${sign(encodedPayload)}`;
}


