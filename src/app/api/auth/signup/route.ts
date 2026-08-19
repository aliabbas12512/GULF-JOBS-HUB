import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/lib/utils/validation";
import { createUser } from "@/lib/db/auth";
import { setSessionCookie } from "@/lib/auth/session";
import { checkRateLimit, getClientIp } from "@/lib/utils/rateLimit";

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(`signup:${getClientIp(request)}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many signup attempts. Please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Please check the form and try again.";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const result = await createUser(parsed.data.name, parsed.data.email, parsed.data.password);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  await setSessionCookie(result);
  return NextResponse.json({ ok: true });
}
