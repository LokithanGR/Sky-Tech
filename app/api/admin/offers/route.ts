import { NextResponse } from "next/server";
import crypto from "crypto";

function sign(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function isAuthed(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.split(";").map(s=>s.trim()).find(s=>s.startsWith("skytech_admin="));
  if (!match) return false;

  const token = decodeURIComponent(match.split("=")[1] || "");
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) return false;

  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  return sign(payload, sessionSecret) === sig && payload.startsWith("admin:");
}

async function callScript(body: any) {
  const url = process.env.OFFERS_API_URL;
  const secret = process.env.OFFERS_API_SECRET;
  if (!url || !secret) return { ok: false, message: "Missing OFFERS_API_URL / OFFERS_API_SECRET" };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...body, secret }),
  });

  const data = await res.json().catch(()=>({ ok:false, message:"Invalid response from offers API" }));
  return data;
}

export async function POST(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ ok:false, message:"Unauthorized" }, { status: 401 });

  const body = await req.json();
  const out = await callScript(body);
  return NextResponse.json(out);
}
