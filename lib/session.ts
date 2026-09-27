import { createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export const SESSION_LIFETIME_SECONDS = 60 * 60 * 24 * 30;

type StoredSession = {
  tokenHash: string;
  userId: string;
  expiresAt: number;
};

const dataDirectory = path.join(process.cwd(), "data");
const sessionsFile = path.join(dataDirectory, "sessions.json");
let sessionWriteQueue: Promise<void> = Promise.resolve();

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

function getCookieToken(cookieHeader: string | null | undefined) {
  return cookieHeader?.match(/(?:^|;\s*)jk_session=([^;]+)/)?.[1];
}

async function readSessions(): Promise<StoredSession[]> {
  try {
    const sessions = JSON.parse(await readFile(sessionsFile, "utf8")) as unknown;
    return Array.isArray(sessions) ? sessions as StoredSession[] : [];
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
}

async function updateSessions(update: (sessions: StoredSession[]) => StoredSession[]) {
  const operation = sessionWriteQueue.then(async () => {
    const nextSessions = update(await readSessions());
    await mkdir(dataDirectory, { recursive: true });
    const temporaryFile = `${sessionsFile}.${randomBytes(8).toString("hex")}.tmp`;
    await writeFile(temporaryFile, `${JSON.stringify(nextSessions, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
    await rename(temporaryFile, sessionsFile);
  });
  sessionWriteQueue = operation.catch(() => undefined);
  await operation;
}

export async function getSessionUserId(cookieHeader: string | null | undefined) {
  const token = getCookieToken(cookieHeader);
  if (!token) return undefined;

  const tokenHash = hashToken(token);
  const session = (await readSessions()).find((item) => item.tokenHash === tokenHash);
  if (!session || session.expiresAt <= Date.now()) return undefined;
  return session.userId;
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  await updateSessions((sessions) => [
    ...sessions.filter((session) => session.expiresAt > now),
    { tokenHash: hashToken(token), userId, expiresAt: now + SESSION_LIFETIME_SECONDS * 1000 },
  ]);
  return token;
}

export async function clearSession(cookieHeader: string | null | undefined) {
  const token = getCookieToken(cookieHeader);
  if (!token) return;

  const tokenHash = hashToken(token);
  await updateSessions((sessions) => sessions.filter((session) => session.tokenHash !== tokenHash));
}