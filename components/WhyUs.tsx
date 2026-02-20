"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const items = [
  { title: "Clean & Professional Work", desc: "Neat wiring, proper routing and clean drilling — no messy finish." },
  { title: "Genuine Parts & Warranty", desc: "Quality parts with correct warranty guidance for peace of mind." },
  { title: "Fast Response Support", desc: "Quick scheduling and clear updates — we respect your time." },
  { title: "Trusted Since 2021", desc: "Local customers trust us for transparent pricing and reliable service." }
];

export default function WhyUs() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14">
      <h2 className="text-3xl font-bold">Why Us?</h2>
      <p className="mt-2 text-gray-600">
        Quality work, honest guidance, and quick support — that’s our promise.
      </p>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {items.map((it) => (
          <motion.div
            key={it.title}
            className="rounded-3xl border bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
          >
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-2xl border grid place-items-center">
                <CheckCircle2 />
              </div>
              <div>
                <div className="font-semibold text-lg">{it.title}</div>
                <div className="text-sm text-gray-600 mt-1">{it.desc}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
