import { NextResponse } from "next/server";
import crypto from "crypto";

function sign(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export async function POST(req: Request) {
  const { password } = await req.json();

  const adminPass = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.SESSION_SECRET;

  if (!adminPass || !sessionSecret) {
    return NextResponse.json({ ok: false, message: "Missing env vars" }, { status: 500 });
  }

  if (password !== adminPass) {
    return NextResponse.json({ ok: false, message: "Wrong password" }, { status: 401 });
  }

  const payload = `admin:${Date.now()}`;
  const sig = sign(payload, sessionSecret);
  const token = `${payload}.${sig}`;

  const res = NextResponse.json({ ok: true });
  res.cookies.set("skytech_admin", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 12
  });
  return res;
}
