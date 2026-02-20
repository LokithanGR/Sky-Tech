import Navbar from "../../components/Navbar";
import WhatsAppFloat from "../../components/WhatsAppFloat";
import Footer from "../../components/Footer";
import { telLink, waLink } from "../../components/utils";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const shop = process.env.NEXT_PUBLIC_SHOP_NAME || "Sky Tech";
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || "8678997127";

  return (
    <main className="min-h-screen">
      <Navbar shop={shop} phone={phone} />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-4xl font-extrabold">Contact Us</h1>
        <p className="mt-3 text-gray-600">
          Need installation or service? Call or WhatsApp — we’ll respond quickly.
        </p>

        <div className="mt-8 rounded-[2rem] border bg-gray-50 p-8">
          <div className="text-sm text-gray-600">Phone / WhatsApp</div>
          <div className="mt-2 text-2xl font-bold">{phone}</div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={telLink(phone)} className="px-5 py-3 rounded-2xl bg-black text-white font-semibold">
              Call Now
            </a>
            <a
              href={waLink(phone, `Hi ${shop}, I need service / installation`)}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-2xl border font-semibold hover:bg-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer shop={shop} />
      <WhatsAppFloat shop={shop} phone={phone} />
    </main>
  );
}
