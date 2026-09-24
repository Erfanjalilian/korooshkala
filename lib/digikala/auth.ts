import { createPrivateKey, constants, privateDecrypt } from "node:crypto";
import { readFileSync } from "node:fs";
import { getDigikalaConfig } from "@/lib/digikala/config";
import { readDigikalaAuthState, writeDigikalaAuthState } from "@/lib/digikala/storage";

export type DigikalaAuthTokenBodyInput = {
  clientCode?: string;
  validationCode?: string;
  requestBody?: Record<string, unknown>;
  headers?: Record<string, string>;
};

const toBase64Payload = (value: string) => {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    throw new Error("Validation code is required.");
  }

  const padded = normalized.replace(/-/g, "+").replace(/_/g, "/");
  const length = padded.length % 4;
  const withPadding = length === 0 ? padded : padded + "=".repeat(4 - length);
  return Buffer.from(withPadding, "base64");
};

export const base64DecodeValidationCode = (input: string) => toBase64Payload(input);

const tryPrivateDecrypt = (privateKeyPem: string, source: Buffer) => {
  const key = createPrivateKey(privateKeyPem);
  const decryptCandidates = [
    { padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
    { padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha1" },
    { padding: constants.RSA_PKCS1_PADDING },
  ];

  for (const candidate of decryptCandidates) {
    try {
      return privateDecrypt(
        {
          key,
          padding: candidate.padding,
          ...(candidate.oaepHash ? { oaepHash: candidate.oaepHash } : {}),
        },
        source,
      );
    } catch {
      // Try the next standard RSA padding/Hash combination.
    }
  }

  throw new Error("Validation code could not be decrypted with the configured private key.");
};

export const getDigikalaPrivateKeyPem = () => {
  const config = getDigikalaConfig();
  const configuredPath = process.env.DIGIKALA_PRIVATE_KEY_PATH?.trim();

  if (configuredPath) {
    return readFileSync(configuredPath, "utf8").replace(/\r/g, "");
  }

  if (config.privateKey) {
    return config.privateKey.replace(/\r/g, "");
  }

  throw new Error("The Digikala private key is not configured. Set DIGIKALA_PRIVATE_KEY_PATH on the server and keep the file outside the repo.");
};

export const decryptValidationCode = (validationCode: string, privateKeyPem?: string) => {
  const keyPem = privateKeyPem ?? getDigikalaPrivateKeyPem();
  const decoded = base64DecodeValidationCode(validationCode);
  const decrypted = tryPrivateDecrypt(keyPem, decoded);
  return decrypted.toString("utf8");
};

export const buildDigikalaAuthTokenBody = ({
  validationCode,
}: DigikalaAuthTokenBodyInput) => {
  const authorizationCode = String(validationCode ?? "").trim();

  if (!authorizationCode) {
    throw new Error("Decrypted authorization code is required.");
  }

  return {
    authorization_code: authorizationCode,
  };
};

export const activateDigikalaToken = async ({
  clientCode,
  validationCode,
  requestBody,
  headers,
}: DigikalaAuthTokenBodyInput) => {
  const normalizedClientCode = String(clientCode ?? "").trim();
  const normalizedValidationCode = String(validationCode ?? "").trim();
  if (!normalizedClientCode || !normalizedValidationCode) {
    throw new Error("Client Code and Validation Code are required.");
  }

  const privateKeyPem = getDigikalaPrivateKeyPem();
  const decryptedValidationValue = decryptValidationCode(normalizedValidationCode, privateKeyPem);
  const body = buildDigikalaAuthTokenBody({
    validationCode: decryptedValidationValue,
  });

  const baseUrl = getDigikalaConfig().baseUrl.replace(/\/+$/, "");
  const response = await fetch(`${baseUrl}/open-api/v1/auth/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    throw new Error(`Digikala token activation failed with status ${response.status}.`);
  }

  const data =
    payload.data && typeof payload.data === "object"
      ? (payload.data as Record<string, unknown>)
      : {};

  const accessToken =
    typeof data.access_token === "string" ? data.access_token : "";
  const refreshToken =
    typeof data.refresh_token === "string" ? data.refresh_token : "";

  const state = await readDigikalaAuthState();
  const nextState = {
    ...state,
    id: "default" as const,
    clientCode: normalizedClientCode,
    accessToken: accessToken || state.accessToken,
    refreshToken: refreshToken || state.refreshToken,
    lastAuthenticatedAt: new Date().toISOString(),
    status: accessToken && refreshToken ? "ACTIVE" : state.status || "INACTIVE",
  };
  await writeDigikalaAuthState(nextState);

  return {
    accessToken: accessToken || undefined,
    refreshToken: refreshToken || undefined,
    response: payload,
  };
};
