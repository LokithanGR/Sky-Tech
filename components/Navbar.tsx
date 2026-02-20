"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, PhoneCall } from "lucide-react";
import { useState } from "react";
import { telLink, waLink } from "./utils";

export default function Navbar({ shop, phone }: { shop: string; phone: string }) {
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/offers", label: "Offers" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-white/75 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl border grid place-items-center font-black">
            ST
          </div>
          <div className="leading-tight">
            <div className="font-bold text-lg">{shop}</div>
            <div className="text-[11px] text-gray-500">Since 2021</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navItems.map((it) => (
            <Link key={it.href} href={it.href} className="text-gray-700 hover:text-black">
              {it.label}
            </Link>
          ))}

          <motion.a
            whileTap={{ scale: 0.98 }}
            href={waLink(phone, `Hi ${shop}, I need details`)}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-2xl bg-black text-white"
            aria-label="WhatsApp"
          >
            WhatsApp
          </motion.a>

          <a href={telLink(phone)} className="px-4 py-2 rounded-2xl border hover:bg-gray-50">
            <span className="inline-flex items-center gap-2">
              <PhoneCall size={16} /> Call
            </span>
          </a>
        </nav>

        <button
          className="md:hidden p-2 rounded-xl border"
          onClick={() => setOpen((v) => !v)}
          aria-label="menu"
        >
          <Menu size={18} />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-3 grid gap-2">
            {navItems.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-50 text-sm"
              >
                {it.label}
              </Link>
            ))}
            <a
              href={waLink(phone, `Hi ${shop}, I need details`)}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl bg-black text-white text-center"
            >
              WhatsApp
            </a>
            <a href={telLink(phone)} className="p-3 rounded-2xl border text-center">
              Call Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
