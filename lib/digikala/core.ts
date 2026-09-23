export type DigikalaSyncStatus = "PENDING" | "SYNCING" | "SYNCED" | "FAILED";

export const normalizeDigikalaSyncStatus = (value: unknown): DigikalaSyncStatus => {
  const normalized = String(value ?? "").trim().toUpperCase();

  if (normalized === "QUEUED") return "PENDING";
  if (["PENDING", "SYNCING", "SYNCED", "FAILED"].includes(normalized)) {
    return normalized as DigikalaSyncStatus;
  }

  return "PENDING";
};

export const buildDigikalaQueue = <T>(items: T[], batchSize: number): T[][] => {
  const safeBatchSize = Math.max(1, Number(batchSize) || 25);
  if (items.length === 0) return [];

  const queue: T[][] = [];
  for (let index = 0; index < items.length; index += safeBatchSize) {
    queue.push(items.slice(index, index + safeBatchSize));
  }

  return queue;
};

const shouldRedactKey = (key: string) => {
  const normalized = key.toLowerCase();
  return [
    "token",
    "secret",
    "privatekey",
    "private_key",
    "authorization",
    "apikey",
    "api_key",
    "password",
    "cookie",
  ].some((candidate) => normalized.includes(candidate));
};

export const sanitizeDigikalaError = <T>(input: T): T => {
  const visit = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map((item) => visit(item));
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, child]) => [
          key,
          shouldRedactKey(key) ? "[REDACTED]" : visit(child),
        ]),
      );
    }
    return value;
  };

  return visit(input) as T;
};
