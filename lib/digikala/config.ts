export type DigikalaConfig = {
  enabled: boolean;
  baseUrl: string;
  clientCode?: string;
  clientId?: string;
  clientSecret?: string;
  privateKey?: string;
  accessToken?: string;
  refreshToken?: string;
  sandbox: boolean;
};

const parseBoolean = (value: string | undefined, fallback = false) => {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  return ["1", "true", "yes", "on"].includes(normalized);
};

export const getDigikalaConfig = (): DigikalaConfig => {
  const baseUrl = (process.env.DIGIKALA_BASE_URL ?? "https://seller.digikala.com").replace(/\/+$/, "");
  const privateKey = process.env.DIGIKALA_PRIVATE_KEY?.trim();
  const clientCode = process.env.DIGIKALA_CLIENT_CODE?.trim();
  const clientId = process.env.DIGIKALA_CLIENT_ID?.trim();
  const clientSecret = process.env.DIGIKALA_CLIENT_SECRET?.trim();
  const accessToken = process.env.DIGIKALA_ACCESS_TOKEN?.trim();
  const refreshToken = process.env.DIGIKALA_REFRESH_TOKEN?.trim();
  const hasExplicitCredentials = Boolean(clientCode && clientId && clientSecret && (privateKey || process.env.DIGIKALA_PRIVATE_KEY_PATH));
  const hasStoredTokens = Boolean(accessToken && refreshToken);

  return {
    enabled: hasExplicitCredentials || hasStoredTokens,
    baseUrl,
    clientCode,
    clientId,
    clientSecret,
    privateKey,
    accessToken,
    refreshToken,
    sandbox: parseBoolean(process.env.DIGIKALA_SANDBOX, true),
  };
};

export const digikalaConfig = getDigikalaConfig();
