import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_GALLERY_API_URL;

  if (!url) {
    return NextResponse.json(
      { ok: false, message: "Missing NEXT_PUBLIC_GALLERY_API_URL" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();

    if (text.trim().startsWith("<")) {
      return NextResponse.json(
        { ok: false, message: "Upstream returned HTML (Apps Script issue)" },
        { status: 502 }
      );
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message || "Gallery proxy failed" },
      { status: 500 }
    );
  }
}