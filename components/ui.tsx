"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

// Usado nas imagens de wallpaper para bloquear o menu "Salvar imagem como".
export function noContextMenu(e: React.MouseEvent) {
  e.preventDefault();
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs md:text-sm tracking-[0.14em] uppercase text-aura-400/90 font-medium mb-3">
      {children}
    </p>
  );
}

export function SectionHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance ${className}`}
    >
      {children}
    </h2>
  );
}

export function Accent({ children }: { children: ReactNode }) {
  return <span className="italic-serif">{children}</span>;
}

export function PrimaryButton({
  href,
  children,
  className = "",
  target,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  /** use "_blank" para links externos (ex.: checkout), sem sair da página */
  target?: string;
}) {
  return (
    <Link
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center justify-center rounded-full bg-aura-gradient px-8 py-4 text-sm md:text-base font-semibold tracking-wide text-white shadow-aura transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] ${className}`}
    >
      {children}
    </Link>
  );
}

export function GhostButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full border border-white/20 bg-white text-ink-950 px-8 py-4 text-sm md:text-base font-semibold tracking-wide transition-transform duration-200 hover:scale-[1.03] hover:bg-white/90 active:scale-[0.98] ${className}`}
    >
      {children}
    </Link>
  );
}

export function OutlineButton({
  href,
  children,
  className = "",
  target,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  /** use "_blank" para links externos (ex.: checkout), sem sair da página */
  target?: string;
}) {
  return (
    <Link
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center justify-center rounded-full border border-aura-500/60 px-8 py-4 text-sm md:text-base font-semibold tracking-wide text-white transition-colors duration-200 hover:bg-aura-500/10 ${className}`}
    >
      {children}
    </Link>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
