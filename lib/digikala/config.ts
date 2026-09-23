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

  return {
    enabled: Boolean(process.env.DIGIKALA_CLIENT_CODE || process.env.DIGIKALA_CLIENT_ID || baseUrl),
    baseUrl,
    clientCode: process.env.DIGIKALA_CLIENT_CODE?.trim(),
    clientId: process.env.DIGIKALA_CLIENT_ID?.trim(),
    clientSecret: process.env.DIGIKALA_CLIENT_SECRET?.trim(),
    privateKey,
    accessToken: process.env.DIGIKALA_ACCESS_TOKEN?.trim(),
    refreshToken: process.env.DIGIKALA_REFRESH_TOKEN?.trim(),
    sandbox: parseBoolean(process.env.DIGIKALA_SANDBOX, true),
  };
};

export const digikalaConfig = getDigikalaConfig();
