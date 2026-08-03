"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { CarouselImage } from "@/lib/wallpapers.server";
import { noContextMenu, Reveal } from "./ui";

// Nota: as imagens flutuantes decorativas foram removidas por serem pesadas
// demais (arquivos grandes derrubando a performance de scroll). O suporte a
// elas continua em lib/wallpapers.server.ts (campo `floatingImages`) e pode
// voltar facilmente aqui assim que as versões leves em .webp forem inseridas.

export default function Quote({ image }: { image: CarouselImage }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "start 0.25"],
  });

  // o texto "se completa" ganhando opacidade conforme a seção entra na tela
  const textOpacity = useTransform(scrollYProgress, [0, 1], [0.15, 1]);

  return (
    <section ref={sectionRef} className="relative mx-auto max-w-4xl overflow-visible px-6 py-20 md:py-28">
      <Reveal className="relative mx-auto mb-10 w-full max-w-xl md:max-w-2xl">
        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
          style={{ aspectRatio: `${image.width} / ${image.height}` }}
        >
          <Image
            src={image.src}
            alt="Wallpaper AuraPapers em detalhe"
            fill
            quality={72}
            sizes="(min-width: 768px) 700px, 90vw"
            className="object-cover"
            draggable={false}
            onContextMenu={noContextMenu}
          />
        </div>
      </Reveal>

      <motion.div style={{ opacity: textOpacity }} className="relative text-center">
        <p className="text-2xl sm:text-3xl md:text-4xl font-medium leading-snug text-balance">
          Cada wallpaper nasce como uma pintura de verdade, com camadas
          espessas de tinta, relevo e luz que dão à sua tela a presença de um
          quadro original.
        </p>
        <p className="mx-auto mt-8 max-w-2xl text-balance text-white/50">
          Nada de gradientes genéricos ou padrões repetidos: arte com
          textura, feita para quem passa o dia inteiro olhando para uma tela.
        </p>
      </motion.div>
    </section>
  );
}
