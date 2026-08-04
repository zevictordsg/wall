"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play } from "lucide-react";
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

// Tempo, em segundos, que o vídeo precisa tocar antes do botão "atrasado"
// aparecer — o clássico gatilho de VSL: mostrar o pitch antes da oferta.
const DELAYED_CTA_SECONDS = 30;

function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showDelayedCta, setShowDelayedCta] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setShowDelayedCta(true), DELAYED_CTA_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [playing]);

  function handlePlay() {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.play().catch(() => {
      // autoplay com som pode ser bloqueado em alguns navegadores; se
      // falhar, tenta de novo mudo (melhor tocar mudo do que não tocar).
      el.muted = true;
      el.play();
    });
  }

  return (
    <div className="relative mx-auto mt-10 w-full max-w-4xl px-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl" style={{ aspectRatio: "16 / 9" }}>
        <video
          ref={videoRef}
          src="/vsl2.mp4"
          poster="/thumb.jpg"
          className="h-full w-full object-cover"
          playsInline
          preload="metadata"
          controls={playing}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onContextMenu={noContextMenu}
        />

        {!playing && (
          <button
            onClick={handlePlay}
            aria-label="Assistir ao vídeo"
            className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
          >
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-aura-gradient shadow-aura sm:h-20 sm:w-20"
            >
              <Play size={28} className="ml-1 fill-white text-white" />
            </motion.span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDelayedCta && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5 }}
            className="mt-6 text-center"
          >
            <PrimaryButton href="#pricing">QUERO GARANTIR A MINHA COLEÇÃO</PrimaryButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Hero({ cornerImages }: { cornerImages: CarouselImage[] }) {
  return (
    <section className="relative overflow-hidden bg-radial-glow pt-28 pb-16 md:pt-36 md:pb-20">
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

      <VideoPlayer />

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
