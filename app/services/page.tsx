import Navbar from "../../components/Navbar";
import WhatsAppFloat from "../../components/WhatsAppFloat";
import Footer from "../../components/Footer";
import { ShieldCheck, Zap, Droplets } from "lucide-react";

export const dynamic = "force-dynamic";

function Card({
  title,
  icon,
  points
}: {
  title: string;
  icon: React.ReactNode;
  points: string[];
}) {
  return (
    <div className="rounded-3xl border bg-white p-7 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl border grid place-items-center">{icon}</div>
        <div className="font-semibold text-xl">{title}</div>
      </div>

      <ul className="mt-4 list-disc pl-5 text-sm text-gray-700 space-y-2">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ServicesPage() {
  const shop = process.env.NEXT_PUBLIC_SHOP_NAME || "Sky Tech";
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || "8678997127";

  return (
    <main className="min-h-screen">
      <Navbar shop={shop} phone={phone} />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-4xl font-extrabold">Services</h1>
        <p className="mt-3 text-gray-600">
          Sales • Installation • Service — professional finishing & reliable support.
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card
            title="CCTV"
            icon={<ShieldCheck />}
            points={[
              "Site inspection & right camera recommendation",
              "Neat cable routing & clean installation",
              "DVR/NVR setup + mobile view configuration",
              "After-service support & maintenance"
            ]}
          />
          <Card
            title="Inverter"
            icon={<Zap />}
            points={[
              "Inverter + battery selection for your load",
              "Proper wiring with safety checks",
              "Backup optimization & usage guidance",
              "Service support & battery replacement"
            ]}
          />
          <Card
            title="Water Purifier"
            icon={<Droplets />}
            points={[
              "RO/UV purifier installation & setup",
              "Filter/service schedule guidance",
              "Fast service + filter replacement",
              "Water quality support & checkups"
            ]}
          />
        </div>
      </section>

      <Footer shop={shop} />
      <WhatsAppFloat shop={shop} phone={phone} />
    </main>
  );
}
