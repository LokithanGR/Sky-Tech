import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const dynamic = "force-dynamic";

async function getGallery() {
  // ✅ Server-side fetch should use absolute external URL (Apps Script)
  const url = process.env.NEXT_PUBLIC_GALLERY_API_URL;
  if (!url) return [];

  try {
    const res = await fetch(url, { cache: "no-store" });
    const txt = await res.text();

    // Sometimes upstream returns HTML (auth/redirect/error)
    if (txt.trim().startsWith("<")) return [];

    const data = JSON.parse(txt);
    const items = Array.isArray(data?.items) ? data.items : [];

    // show only active items (supports boolean or TRUE/FALSE)
    return items.filter((x: any) => String(x?.active ?? "TRUE").toUpperCase() === "TRUE");
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const shop = process.env.NEXT_PUBLIC_SHOP_NAME || "Sky Tech";
  const phone = process.env.NEXT_PUBLIC_PHONE || "8678997127";
  const items = await getGallery();

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <Navbar shop={shop} phone={phone} />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div>
          <div className="text-xs text-gray-500">Worked Photos</div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <div className="text-sm text-gray-600 mt-2">Our recent works — neat finishing ✅</div>
        </div>

        <div className="mt-8">
          {items.length === 0 ? (
            <div className="rounded-[2rem] border p-8 bg-gray-50 text-sm text-gray-700">
              No photos yet 🙈
              {!process.env.NEXT_PUBLIC_GALLERY_API_URL ? (
                <div className="mt-2 text-xs text-gray-500">
                  Missing NEXT_PUBLIC_GALLERY_API_URL in .env.local
                </div>
              ) : null}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((it: any) => (
                <div key={String(it.id)} className="rounded-[2rem] border overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.imageUrl}
                      alt={it.title || "Work Photo"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <div className="font-semibold">{it.title || "Work Photo"}</div>
                    <div className="text-sm text-gray-600 mt-1">{it.category || "Others"}</div>
                    {it.uploadedAt ? (
                      <div className="text-xs text-gray-500 mt-2">{String(it.uploadedAt)}</div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer shop={shop} phone={phone} />
    </main>
  );
}