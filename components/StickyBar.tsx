"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PrimaryButton } from "./ui";

export default function StickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.9);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-950/90 backdrop-blur"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
            <div>
              <p className="text-sm font-semibold sm:text-base">+100 wallpapers em 4K</p>
              <p className="text-xs text-white/50">a partir de R$ 9,90</p>
            </div>
            <PrimaryButton href="#pricing" className="!px-6 !py-3 text-xs sm:text-sm">
              QUERO A COLEÇÃO
            </PrimaryButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
