import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/utils/validation";
import { authenticateAdmin } from "@/lib/db/auth";
import { setSessionCookie } from "@/lib/auth/session";
import { checkRateLimit, getClientIp } from "@/lib/utils/rateLimit";

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(`admin-login:${getClientIp(request)}`, {
    limit: 10,
    windowMs: 10 * 60 * 1000,
  });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email and password." }, { status: 400 });
  }

  const admin = await authenticateAdmin(parsed.data.email, parsed.data.password);
  if (!admin) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await setSessionCookie(admin);
  return NextResponse.json({ ok: true });
}
