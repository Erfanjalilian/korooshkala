type SmsIrParameter = { name: string; value: string };

export const ORDER_NOTIFICATION_SMS = {
  mobile: "09124541307",
  templateId: 461869,
  site: "کورووش‌کالا",
};

async function sendSmsIrPattern(mobile: string, templateId: number, parameters: SmsIrParameter[]) {
  const apiKey = process.env.SMS_IR_API_KEY;
  if (!apiKey) throw new Error("SMS.ir is not configured.");

  let response: Response;
  try {
    response = await fetch("https://api.sms.ir/v1/send/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", "X-API-KEY": apiKey },
      body: JSON.stringify({ mobile, templateId, parameters }),
    });
  } catch {
    throw new Error("SMS.ir request failed.");
  }

  if (!response.ok) throw new Error(`SMS.ir request failed with HTTP ${response.status}.`);
}

export function sendOtpSms(mobile: string, code: string) {
  const templateId = Number(process.env.SMS_IR_TEMPLATE_ID || "323089");
  const parameterName = process.env.SMS_IR_TEMPLATE_PARAMETER || "Code";
  return sendSmsIrPattern(mobile, templateId, [{ name: parameterName, value: code }]);
}

export function sendOrderNotificationSms() {
  return sendSmsIrPattern(ORDER_NOTIFICATION_SMS.mobile, ORDER_NOTIFICATION_SMS.templateId, [
    { name: "site", value: ORDER_NOTIFICATION_SMS.site },
  ]);
}
