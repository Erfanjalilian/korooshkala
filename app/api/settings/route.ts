import { NextResponse } from "next/server";
import { readStoreSettings } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const settings = await readStoreSettings();
  return NextResponse.json({ silentBoxPackagingFee: settings.silentBoxPackagingFee });
}