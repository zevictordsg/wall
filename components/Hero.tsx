"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import HeroCarousel from "./HeroCarousel";
import type { CarouselImage } from "@/lib/wallpapers.server";
import { HERO_CHECKOUT_URL } from "@/lib/data";
import { Accent, noContextMenu, PrimaryButton } from "./ui";

// Pequeno detalhe decorativo visto na referência: duas fotos inclinadas
// "espiando" nos cantos superiores da hero, parcialmente cortadas pela
// borda da seção.
function CornerImage({ img, side }: { img: CarouselImage; side: "left" | "right" }) {
  const rotate = side === "left" ? -9 : 7;
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className={`pointer-events-none absolute top-4 z-10 w-16 overflow-hidden rounded-lg shadow-2xl sm:top-6 sm:w-24 md:w-28 ${
        side === "left" ? "-left-4 sm:-left-3" : "-right-4 sm:-right-3"
      }`}
      style={{ aspectRatio: `${img.width} / ${img.height}`, rotate }}
    >
      <Image
        src={img.src}
        alt=""
        fill
        quality={45}
        sizes="120px"
        className="object-cover"
        draggable={false}
        onContextMenu={noContextMenu}
      />
    </motion.div>
  );
}

export default function Hero({
  carouselImages,
  cornerImages,
}: {
  carouselImages: CarouselImage[];
  cornerImages: CarouselImage[];
}) {
  return (
    <section className="relative overflow-hidden bg-radial-glow pt-28 pb-20 md:pt-36 md:pb-28">
      {cornerImages[0] && <CornerImage img={cornerImages[0]} side="left" />}
      {cornerImages[1] && <CornerImage img={cornerImages[1]} side="right" />}

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight text-balance"
        >
          Transforme sua tela
          <br />
          em uma <Accent>obra de arte</Accent>
        </motion.h1>
      </div>

      <div className="mt-14">
        <HeroCarousel images={carouselImages} />
      </div>

      <div className="relative mx-auto mt-14 flex max-w-xl flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl text-balance text-white/70"
        >
          Mais de 100 wallpapers exclusivos em pintura a óleo impasto, feitos
          para notebook e celular. Textura espessa, cores profundas e luz de
          galeria em todas as suas telas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8"
        >
          <PrimaryButton href={HERO_CHECKOUT_URL} target="_blank">
            QUERO A COLEÇÃO POR R$ 9,90
          </PrimaryButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 text-xs sm:text-sm text-white/40"
        >
          Download imediato · Mac, Windows, iPhone e Android · Pagamento único
        </motion.p>
      </div>
    </section>
  );
}
