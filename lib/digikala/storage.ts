import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type DigikalaProductMapping = {
  id: string;
  localProductId: string;
  digikalaProductId: string;
  localVariantId?: string;
  digikalaVariantId?: string;
  digikalaCategoryId?: string;
  syncStatus: "PENDING" | "SYNCING" | "SYNCED" | "FAILED";
  lastSyncedAt?: string;
  lastSyncError?: string;
  createdAt: string;
  updatedAt: string;
};

export type DigikalaCategoryMapping = {
  id: string;
  localCategoryId: string;
  localCategoryName: string;
  digikalaCategoryId: string;
  digikalaCategoryName?: string;
  createdAt: string;
  updatedAt: string;
};

export type DigikalaAuthState = {
  id: "default";
  clientCode?: string;
  accessToken?: string;
  refreshToken?: string;
  lastAuthenticatedAt?: string;
  lastError?: string;
  status?: "INACTIVE" | "ACTIVE" | "FAILED";
};

const dataDirectory = path.join(process.cwd(), "data", "digikala");

async function ensureDirectory() {
  await mkdir(dataDirectory, { recursive: true });
}

async function readJson<T>(fileName: string, fallback: T): Promise<T> {
  try {
    await ensureDirectory();
    return JSON.parse(await readFile(path.join(dataDirectory, fileName), "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(fileName: string, value: T) {
  await ensureDirectory();
  const filePath = path.join(dataDirectory, fileName);
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, {
    encoding: "utf8",
    mode: fileName === "auth-state.json" ? 0o600 : 0o644,
  });

  if (fileName === "auth-state.json") {
    const { chmod } = await import("node:fs/promises");
    await chmod(filePath, 0o600);
  }
}

export const readDigikalaProductMappings = () =>
  readJson<DigikalaProductMapping[]>("product-mappings.json", []);

export const writeDigikalaProductMappings = (value: DigikalaProductMapping[]) =>
  writeJson("product-mappings.json", value);

export const readDigikalaCategoryMappings = () =>
  readJson<DigikalaCategoryMapping[]>("category-mappings.json", []);

export const writeDigikalaCategoryMappings = (value: DigikalaCategoryMapping[]) =>
  writeJson("category-mappings.json", value);

export const readDigikalaSyncLogs = () => readJson<Array<Record<string, unknown>>>("sync-logs.json", []);
export const writeDigikalaSyncLogs = (value: Array<Record<string, unknown>>) => writeJson("sync-logs.json", value);

export const readDigikalaAuthState = () =>
  readJson<DigikalaAuthState>("auth-state.json", { id: "default", status: "INACTIVE" });

export const writeDigikalaAuthState = (value: DigikalaAuthState) =>
  writeJson("auth-state.json", value);
