import { randomUUID } from "node:crypto";

const sessions = new Map<string, string>();

export function getSessionUserId(cookieHeader: string | null | undefined) {
  const match = cookieHeader?.match(/(?:^|;\s*)jk_session=([^;]+)/);
  const sessionId = match?.[1];
  if (!sessionId) return undefined;
  return sessions.get(sessionId);
}

export function createSession(userId: string) {
  const sessionId = randomUUID();
  sessions.set(sessionId, userId);
  return sessionId;
}

export function clearSession(cookieHeader: string | null | undefined) {
  const match = cookieHeader?.match(/(?:^|;\s*)jk_session=([^;]+)/);
  const sessionId = match?.[1];
  if (sessionId) sessions.delete(sessionId);
}
