"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { CarouselImage } from "@/lib/wallpapers.server";
import { noContextMenu } from "./ui";

function MarqueeRow({
  images,
  heightClass,
  reverse,
}: {
  images: CarouselImage[];
  heightClass: string;
  reverse?: boolean;
}) {
  // duplicamos a lista para o loop infinito ficar contínuo (translada -50%)
  const track = [...images, ...images];
  const duration = Math.max(18, images.length * 3.2);

  return (
    <div className="group relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
      <div
        className="flex w-max items-center gap-3 py-2 pl-4 [animation-play-state:running] group-hover:[animation-play-state:paused] motion-reduce:!animate-none"
        style={{
          animation: `aura-marquee ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {track.map((img, i) => (
          // Altura fixa, largura calculada pela proporção real da imagem
          // (via next/image + width/height): aparece inteira, sem cortar
          // nada. Volta a passar pelo otimizador do Next (qualidade bem
          // alta, quase sem perda visível) em vez de "unoptimized": assim
          // ele entrega um arquivo do tamanho real exibido, não o arquivo
          // original inteiro (que pode ter alguns MB) em toda tela.
          <div
            key={`${img.src}-${i}`}
            className={`relative ${heightClass} shrink-0 overflow-hidden rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-[1.03]`}
            style={{ aspectRatio: `${img.width} / ${img.height}` }}
          >
            <Image
              src={img.src}
              alt="Wallpaper AuraPapers"
              fill
              quality={95}
              sizes="(min-width: 1024px) 380px, (min-width: 768px) 300px, 220px"
              priority={i < 3}
              className="object-contain"
              draggable={false}
              onContextMenu={noContextMenu}
            />
          </div>
        ))}
      </div>

      {/* fade nas bordas para suavizar a entrada/saída das imagens */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-ink-950 to-transparent sm:w-24 md:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ink-950 to-transparent sm:w-24 md:w-40" />
    </div>
  );
}

export default function HeroCarousel({ images }: { images: CarouselImage[] }) {
  if (images.length === 0) return null;

  // No mobile, duas fileiras em sentidos opostos (como na referência); no
  // desktop, uma fileira só com todas as imagens.
  const half = Math.ceil(images.length / 2);
  const rowA = images.slice(0, half);
  const rowB = images.slice(half).length > 0 ? images.slice(half) : images;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.25 }}
    >
      <div className="space-y-3 md:hidden">
        <MarqueeRow images={rowA} heightClass="h-[15vh]" />
        <MarqueeRow images={rowB} heightClass="h-[15vh]" reverse />
      </div>
      <div className="hidden md:block">
        <MarqueeRow images={images} heightClass="h-[30vh]" />
      </div>
    </motion.div>
  );
}
