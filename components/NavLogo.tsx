"use client";

import { motion } from "framer-motion";

export default function NavLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="pointer-events-none fixed left-6 top-6 z-30 select-none"
    >
      <span className="text-sm font-bold tracking-[0.08em] text-white/80">
        AURA<span className="text-aura-500">PAPERS</span>
      </span>
    </motion.div>
  );
}
