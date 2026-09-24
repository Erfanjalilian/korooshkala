import { getDigikalaConfig } from "@/lib/digikala/config";
import { sanitizeDigikalaError } from "@/lib/digikala/core";

export type DigikalaApiError = Error & {
  status?: number;
  endpoint?: string;
  retryable?: boolean;
};

export type DigikalaRequestOptions = RequestInit & {
  requireAuth?: boolean;
  retryable?: boolean;
  isAuthRequest?: boolean;
};

const tokenState = {
  accessToken: undefined as string | undefined,
  refreshToken: undefined as string | undefined,
  expiresAt: 0,
};

const redact = (value: unknown) => sanitizeDigikalaError(value);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableStatus = (status?: number) => status === 408 || status === 429 || (status !== undefined && status >= 500);

export class DigikalaClient {
  private readonly config = getDigikalaConfig();

  private buildUrl(pathname: string) {
    const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return `${this.config.baseUrl}${normalizedPath}`;
  }

  private buildHeaders(token?: string, extraHeaders: Record<string, string> = {}) {
    const headers = new Headers({
      Accept: "application/json",
      ...extraHeaders,
    });

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    if (this.config.clientCode) {
      headers.set("X-Digikala-Client-Code", this.config.clientCode);
    }

    return headers;
  }

  private async requestInternal(endpoint: string, options: DigikalaRequestOptions = {}): Promise<Response> {
    const token = options.isAuthRequest ? tokenState.accessToken : tokenState.accessToken ?? this.config.accessToken;
    const response = await fetch(this.buildUrl(endpoint), {
      ...options,
      headers: this.buildHeaders(token, Object.fromEntries(new Headers(options.headers as HeadersInit).entries())),
    });

    if (!response.ok) {
      const bodyText = await response.text();
      const parsedBody = bodyText ? JSON.parse(bodyText) : undefined;
      const error = new Error(`Digikala API request failed (${response.status})`) as DigikalaApiError;
      error.status = response.status;
      error.endpoint = endpoint;
      error.retryable = isRetryableStatus(response.status);
      console.warn("Digikala API error", redact({ endpoint, status: response.status, body: parsedBody }));
      throw error;
    }

    return response;
  }

  async request<T>(endpoint: string, options: DigikalaRequestOptions = {}): Promise<T> {
    const requestOptions = { ...options };
    const attemptLimit = 4;

    for (let attempt = 1; attempt <= attemptLimit; attempt += 1) {
      try {
        const response = await this.requestInternal(endpoint, requestOptions);
        const payload = await response.text();
        return payload ? (JSON.parse(payload) as T) : (undefined as T);
      } catch (error) {
        const digikalaError = error as DigikalaApiError;
        const shouldRetry = requestOptions.retryable !== false && digikalaError.retryable && attempt < attemptLimit;

        if (shouldRetry) {
          await wait(Math.min(1000 * 2 ** (attempt - 1), 8000));
          continue;
        }

        if (digikalaError.status === 401 && !requestOptions.isAuthRequest) {
          await this.refreshAccessToken();
          const retried = await this.requestInternal(endpoint, { ...requestOptions, retryable: false });
          const payload = await retried.text();
          return payload ? (JSON.parse(payload) as T) : (undefined as T);
        }

        throw error;
      }
    }

    throw new Error("Digikala request failed after retries");
  }

  async refreshAccessToken() {
    if (!this.config.refreshToken && !tokenState.refreshToken) {
      throw new Error("Digikala refresh token is not configured.");
    }

    const refreshToken = tokenState.refreshToken ?? this.config.refreshToken;
    const accessToken = tokenState.accessToken ?? this.config.accessToken ?? "";

    const response = await fetch(this.buildUrl("/open-api/v1/auth/refresh-token"), {
      method: "POST",
      headers: this.buildHeaders(undefined, { "Content-Type": "application/json" }),
      body: JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const error = new Error("Digikala refresh token request failed") as DigikalaApiError;
      error.status = response.status;
      throw error;
    }

    const payload = (await response.json()) as {
      data?: {
        access_token?: string;
        refresh_token?: string;
        access_token_expires_at?: { date?: string };
      };
    };

    const data = payload.data ?? {};
    const nextAccessToken = data.access_token ?? tokenState.accessToken;
    const nextRefreshToken = data.refresh_token ?? refreshToken;

    tokenState.accessToken = nextAccessToken;
    tokenState.refreshToken = nextRefreshToken;

    const expiresAt = data.access_token_expires_at?.date
      ? Date.parse(data.access_token_expires_at.date)
      : NaN;

    tokenState.expiresAt =
      Number.isFinite(expiresAt)
        ? expiresAt
        : Date.now() + 3600 * 1000;

    return payload;
  }

  async authenticateWithClientCredentials(body: Record<string, unknown>) {
    const response = await this.requestInternal("/open-api/v1/auth/token", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      isAuthRequest: true,
      retryable: false,
    });

    const payload = (await response.json()) as {
      data?: {
        access_token?: string;
        refresh_token?: string;
        access_token_expires_at?: { date?: string };
      };
    };

    const data = payload.data ?? {};
    tokenState.accessToken = data.access_token ?? tokenState.accessToken;
    tokenState.refreshToken = data.refresh_token ?? tokenState.refreshToken;

    const expiresAt = data.access_token_expires_at?.date
      ? Date.parse(data.access_token_expires_at.date)
      : NaN;

    tokenState.expiresAt =
      Number.isFinite(expiresAt)
        ? expiresAt
        : Date.now() + 3600 * 1000;

    return payload;
  }
}

export const digikalaClient = new DigikalaClient();
