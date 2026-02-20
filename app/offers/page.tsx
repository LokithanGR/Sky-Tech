import Navbar from "../../components/Navbar";
import WhatsAppFloat from "../../components/WhatsAppFloat";
import Footer from "../../components/Footer";
import { waLink } from "../../components/utils";

export const dynamic = "force-dynamic";

async function getOffers() {
  const url = process.env.OFFERS_API_URL || process.env.NEXT_PUBLIC_OFFERS_API_URL;
  if (!url) return [];

  try {
    const res = await fetch(url, { cache: "no-store" });
    const txt = await res.text();
    if (txt.trim().startsWith("<")) return [];
    const data = JSON.parse(txt);
    return Array.isArray(data?.offers) ? data.offers : [];
  } catch {
    return [];
  }
}

export default async function OffersPage() {
  const shop = process.env.NEXT_PUBLIC_SHOP_NAME || "Sky Tech";
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || "8678997127";
  const offers = await getOffers();

  return (
    <main className="min-h-screen">
      <Navbar shop={shop} phone={phone} />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-4xl font-extrabold">Offers</h1>
        <p className="mt-3 text-gray-600">Latest deals updated live by admin.</p>

        {offers.length === 0 ? (
          <div className="mt-8 rounded-3xl border p-8 text-gray-600 bg-white">
            No offers right now. Ping us on WhatsApp — we’ll share the best deal 🙂
          </div>
        ) : (
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {offers.map((o: any) => (
              <div key={String(o.id)} className="rounded-3xl border bg-white p-7 shadow-sm relative overflow-hidden">
                <div className="absolute -inset-x-10 -top-10 h-24 opacity-30 pointer-events-none">
                  <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-gray-200 to-transparent animate-shimmer" />
                </div>

                <div className="font-semibold text-xl">{o.title || "Offer"}</div>
                <div className="mt-2 text-sm text-gray-600">{o.description || ""}</div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="font-bold text-lg">{o.price ? `₹${o.price}` : ""}</div>
                  <div className="text-xs text-gray-500">{o.validTill ? `Valid till: ${o.validTill}` : ""}</div>
                </div>

                <a
                  className="mt-5 inline-flex font-semibold underline"
                  href={waLink(phone, `Hi ${shop}, I want offer: ${o.title || ""}`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get this offer on WhatsApp →
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10">
          <a
            href={waLink(phone, `Hi ${shop}, I want to know today's offers`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex px-5 py-3 rounded-2xl bg-black text-white font-semibold"
          >
            Ask today’s offer on WhatsApp
          </a>
        </div>
      </section>

      <Footer shop={shop} />
      <WhatsAppFloat shop={shop} phone={phone} />
    </main>
  );
}
