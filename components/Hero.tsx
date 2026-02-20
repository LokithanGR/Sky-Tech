"use client";

import { motion } from "framer-motion";
import { PhoneCall, Star, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { telLink, waLink } from "./utils";

export default function Hero({ shop, phone }: { shop: string; phone: string }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gray-100 blur-2xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gray-100 blur-2xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20 relative">
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs text-gray-700 bg-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Star size={14} />
          Trusted local service • Since 2021
        </motion.div>

        <motion.h1
          className="mt-4 text-4xl sm:text-6xl font-extrabold leading-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          Security, Backup Power <br />
          & Pure Water — <span className="underline">Done Right</span>.
        </motion.h1>

        <motion.p
          className="mt-5 text-gray-600 text-base sm:text-lg max-w-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          {shop} handles professional sales, installation and service for CCTV, Inverters and Water Purifiers — neat finishing,
          genuine parts and fast support.
        </motion.p>

        <motion.div
          className="mt-7 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.14 }}
        >
          <a
            href={waLink(phone, `Hi ${shop}, I need details`)}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-2xl bg-black text-white font-semibold"
          >
            Chat on WhatsApp
          </a>
          <a href={telLink(phone)} className="px-5 py-3 rounded-2xl border font-semibold hover:bg-gray-50">
            <span className="inline-flex items-center gap-2">
              <PhoneCall size={18} /> Call Now
            </span>
          </a>
          <Link href="/offers" className="px-5 py-3 rounded-2xl border font-semibold hover:bg-gray-50">
            View Offers
          </Link>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          {["Fast Installation", "Warranty Support", "Clean & Professional Work"].map((t) => (
            <span key={t} className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border bg-white text-gray-700">
              <CheckCircle2 size={16} /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
