import { NextResponse } from "next/server";
import { getDigikalaConfig } from "@/lib/digikala/config";

export const runtime = "nodejs";

export async function GET() {
  const config = getDigikalaConfig();
  return NextResponse.json({
    enabled: config.enabled,
    baseUrl: config.baseUrl,
    sandbox: config.sandbox,
    hasClientCode: Boolean(config.clientCode),
    hasClientId: Boolean(config.clientId),
    hasClientSecret: Boolean(config.clientSecret),
    hasPrivateKey: Boolean(config.privateKey),
    hasAccessToken: Boolean(config.accessToken),
    hasRefreshToken: Boolean(config.refreshToken),
  });
}
