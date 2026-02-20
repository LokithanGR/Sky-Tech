"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { waLink } from "./utils";

export default function WhatsAppFloat({ phone, shop }: { phone: string; shop: string }) {
  return (
    <motion.a
      href={waLink(phone, `Hi ${shop}, I need details`)}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 shadow-lg border bg-white rounded-2xl px-4 py-3 flex items-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      aria-label="WhatsApp"
    >
      <MessageCircle size={18} />
      <span className="text-sm font-semibold">WhatsApp</span>
    </motion.a>
  );
}
