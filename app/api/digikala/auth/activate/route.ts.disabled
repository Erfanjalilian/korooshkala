import { NextResponse } from "next/server";
import { activateDigikalaToken } from "@/lib/digikala/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      clientCode?: string;
      validationCode?: string;
      requestBody?: Record<string, unknown>;
      headers?: Record<string, string>;
    };

    if (!body.clientCode || !body.validationCode) {
      return NextResponse.json(
        {
          error:
            "Client Code و Validation Code لازم هستند. مقدار Validation Code باید از پنل Digikala گرفته شود و فقط در backend پردازش شود.",
        },
        { status: 400 },
      );
    }

    const result = await activateDigikalaToken({
      clientCode: body.clientCode,
      validationCode: body.validationCode,
      requestBody: body.requestBody,
      headers: body.headers,
    });

    return NextResponse.json({
      ok: true,
      status: "ACTIVE",
      accessTokenReceived: Boolean(result.accessToken),
      refreshTokenReceived: Boolean(result.refreshToken),
      response: {
        accessToken: result.accessToken ? "[REDACTED]" : undefined,
        refreshToken: result.refreshToken ? "[REDACTED]" : undefined,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Digikala activation error";
    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 400 },
    );
  }
}
