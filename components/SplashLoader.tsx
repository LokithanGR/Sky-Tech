"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashLoader() {
  const [show, setShow] = useState(false);
  const [p, setP] = useState(0);

  useEffect(() => {
    // Show once per browser session
    const key = "skytech_splash_done";
    const done = typeof window !== "undefined" ? sessionStorage.getItem(key) : "1";
    if (done) return;

    setShow(true);
    let cur = 0;

    const t = setInterval(() => {
      cur += Math.floor(Math.random() * 5) + 2; // 2..6
      if (cur >= 100) {
        cur = 100;
        setP(cur);
        clearInterval(t);
        setTimeout(() => {
          sessionStorage.setItem(key, "1");
          setShow(false);
        }, 450);
      } else {
        setP(cur);
      }
    }, 55);

    return () => clearInterval(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[60] bg-white grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center px-6">
            <div className="font-extrabold text-3xl tracking-tight">Sky Tech</div>
            <div className="mt-2 text-sm text-gray-600">Since 2021 • Sales • Service • Installation</div>

            <div className="mt-6 flex items-center justify-center">
              <div className="relative h-16 w-16 rounded-full border grid place-items-center">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-black"
                  style={{ clipPath: `inset(${100 - p}% 0 0 0)` }}
                />
                <div className="text-sm font-bold">{p}%</div>
              </div>
            </div>

            <div className="mt-5 text-xs text-gray-500">Loading...</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
