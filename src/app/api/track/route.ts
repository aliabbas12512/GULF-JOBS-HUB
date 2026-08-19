import { NextRequest, NextResponse } from "next/server";
import { logJobEvent } from "@/lib/db/analytics";
import { checkRateLimit, getClientIp } from "@/lib/utils/rateLimit";

const ALLOWED_EVENTS = new Set(["apply_click", "whatsapp_click", "email_click", "call_click"]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(`track:${getClientIp(request)}`, { limit: 60, windowMs: 60 * 1000 });
  if (!rate.allowed) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { jobId, eventType } = body ?? {};
    if (
      typeof jobId !== "string" ||
      !UUID_RE.test(jobId) ||
      typeof eventType !== "string" ||
      !ALLOWED_EVENTS.has(eventType)
    ) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await logJobEvent(jobId, eventType as "apply_click" | "whatsapp_click" | "email_click" | "call_click");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
