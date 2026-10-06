import { NextResponse } from "next/server";

type DigikalaWebhookPayload = {
  event_type?: unknown;
  data?: unknown;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as DigikalaWebhookPayload;

    const eventType =
      typeof payload.event_type === "string"
        ? payload.event_type
        : "unknown";

    console.log("[Digikala Webhook] Event received:", eventType);

    return NextResponse.json(
      {
        status: "ok",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        status: "error",
        message: "Invalid webhook payload",
      },
      { status: 400 },
    );
  }
}
