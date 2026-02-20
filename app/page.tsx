import Navbar from "../components/Navbar";
import WhatsAppFloat from "../components/WhatsAppFloat";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import WhyUs from "../components/WhyUs";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const shop = process.env.NEXT_PUBLIC_SHOP_NAME || "Sky Tech";
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || "8678997127";

  return (
    <main>
      <Navbar shop={shop} phone={phone} />
      <Hero shop={shop} phone={phone} />
      <WhyUs />
      <Footer shop={shop} />
      <WhatsAppFloat shop={shop} phone={phone} />
    </main>
  );
}
