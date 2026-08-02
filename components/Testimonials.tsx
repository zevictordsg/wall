"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { testimonials } from "@/lib/data";
import type { CarouselImage } from "@/lib/wallpapers.server";
import { Accent, Eyebrow, noContextMenu, PrimaryButton, Reveal, SectionHeading } from "./ui";

function ChatBubble({
  from,
  text,
  time,
}: {
  from: "them" | "me";
  text: string;
  time: string;
}) {
  const mine = from === "me";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-1.5 text-[12px] leading-snug ${
          mine ? "bg-[#1f2c22] text-white" : "bg-[#1c1c1c] text-white"
        }`}
      >
        {text}
        <span className="ml-2 align-bottom text-[9px] text-white/40">{time}</span>
      </div>
    </div>
  );
}

// Estado inicial (sem prints de prova real ainda): uma simulação de
// conversa de WhatsApp com uma miniatura ilustrativa.
function WhatsAppCard({ t, thumb }: { t: (typeof testimonials)[number]; thumb?: CarouselImage }) {
  return (
    <div className="w-full max-w-[260px] mx-auto overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-2xl">
      <div className="flex items-center gap-2 bg-[#161616] px-3 py-2.5">
        <div className="h-7 w-7 rounded-full bg-aura-gradient" />
        <div>
          <p className="text-xs font-medium">{t.name}</p>
          <p className="text-[10px] text-white/40">online</p>
        </div>
      </div>
      <div
        className="flex flex-col gap-1.5 px-3 py-3"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      >
        {t.messages.map((m, i) => (
          <ChatBubble key={i} from={m.from} text={m.text} time={m.time} />
        ))}
        {thumb && (
          <div className="relative mt-1 h-24 w-24 self-end overflow-hidden rounded-lg border border-white/10">
            <Image
              src={thumb.src}
              alt=""
              fill
              sizes="100px"
              className="object-cover"
              draggable={false}
              onContextMenu={noContextMenu}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Com prints de prova real (arquivos "prova-*"): o print inteiro É o
// depoimento, sem nenhuma estrutura de conversa simulada por cima.
function ProofCard({ img, delay }: { img: CarouselImage; delay: number }) {
  return (
    <Reveal delay={delay}>
      <div
        className="relative mx-auto w-full max-w-[260px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
        style={{ aspectRatio: `${img.width} / ${img.height}` }}
      >
        <Image
          src={img.src}
          alt="Print de conversa real de cliente da AuraPapers"
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
          draggable={false}
          onContextMenu={noContextMenu}
        />
      </div>
    </Reveal>
  );
}

export default function Testimonials({
  thumbs,
  hasProvaProof,
}: {
  thumbs: CarouselImage[];
  hasProvaProof: boolean;
}) {
  return (
    <section className="border-t border-white/5 bg-gradient-to-b from-ink-950 to-ink-900 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <Eyebrow>Prova social</Eyebrow>
          <SectionHeading>
            Quem baixou, <Accent>amou</Accent>
          </SectionHeading>
          <div className="mt-4 flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} className="fill-aura-500 text-aura-500" />
            ))}
          </div>
          <p className="mx-auto mt-4 max-w-xl text-balance text-white/50">
            Mensagens reais de clientes no WhatsApp, logo depois de baixar a
            coleção.
          </p>
        </Reveal>

        {hasProvaProof ? (
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {thumbs.map((img, i) => (
              <ProofCard key={img.src} img={img} delay={i * 0.1} />
            ))}
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <WhatsAppCard t={t} thumb={thumbs[i % thumbs.length]} />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={0.2} className="mt-14 text-center">
          <PrimaryButton href="#pricing">QUERO A MINHA COLEÇÃO</PrimaryButton>
        </Reveal>
      </div>
    </section>
  );
}
