import test from "node:test";
import assert from "node:assert/strict";
import { ORDER_NOTIFICATION_SMS, sendOrderNotificationSms } from "../lib/sms-ir.ts";

test("order notification uses the fixed SMS.ir Pattern payload", async () => {
  const originalFetch = globalThis.fetch;
  const originalApiKey = process.env.SMS_IR_API_KEY;
  let requestUrl;
  let requestInit;

  process.env.SMS_IR_API_KEY = "test-key";
  globalThis.fetch = async (input, init) => {
    requestUrl = input;
    requestInit = init;
    return new Response(null, { status: 200 });
  };

  try {
    await sendOrderNotificationSms();

    assert.equal(requestUrl, "https://api.sms.ir/v1/send/verify");
    assert.deepEqual(JSON.parse(String(requestInit?.body)), {
      mobile: ORDER_NOTIFICATION_SMS.mobile,
      templateId: ORDER_NOTIFICATION_SMS.templateId,
      parameters: [{ name: "site", value: ORDER_NOTIFICATION_SMS.site }],
    });
  } finally {
    globalThis.fetch = originalFetch;
    if (originalApiKey === undefined) delete process.env.SMS_IR_API_KEY;
    else process.env.SMS_IR_API_KEY = originalApiKey;
  }
});

test("SMS.ir failures expose only a generic status", async () => {
  const originalFetch = globalThis.fetch;
  const originalApiKey = process.env.SMS_IR_API_KEY;

  process.env.SMS_IR_API_KEY = "test-key";
  globalThis.fetch = async () => new Response("sensitive provider details", { status: 503 });

  try {
    await assert.rejects(sendOrderNotificationSms(), {
      message: "SMS.ir request failed with HTTP 503.",
    });
  } finally {
    globalThis.fetch = originalFetch;
    if (originalApiKey === undefined) delete process.env.SMS_IR_API_KEY;
    else process.env.SMS_IR_API_KEY = originalApiKey;
  }
});
