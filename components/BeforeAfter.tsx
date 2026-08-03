"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { Accent, Eyebrow, noContextMenu, PrimaryButton, Reveal, SectionHeading } from "./ui";

export default function BeforeAfter({
  beforeImage,
  afterImage,
}: {
  beforeImage: string;
  afterImage: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.min(100, Math.max(0, pct)));
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true;
    updateFromClientX(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  }
  function onPointerUp() {
    dragging.current = false;
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <Reveal className="text-center">
        <Eyebrow>Antes e depois</Eyebrow>
        <SectionHeading>
          A diferença que a <Accent>arte</Accent> faz
        </SectionHeading>
        <p className="mx-auto mt-5 max-w-xl text-balance text-white/60">
          Arraste e compare: o mesmo setup com o wallpaper de fábrica e com
          uma pintura impasto da coleção.
        </p>
      </Reveal>

      <Reveal delay={0.15} className="mt-12">
        <div
          ref={containerRef}
          className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {/* depois (base layer, full width) */}
          <Image
            src={afterImage}
            alt="Setup com wallpaper AuraPapers"
            fill
            quality={70}
            sizes="(min-width: 1024px) 900px, 100vw"
            className="object-cover"
            draggable={false}
            onContextMenu={noContextMenu}
          />
          <span className="absolute right-4 top-4 rounded-full bg-black/60 px-4 py-1.5 text-xs font-semibold tracking-wide text-white">
            DEPOIS
          </span>

          {/* antes (clipped layer, on top) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
          >
            <Image
              src={beforeImage}
              alt="Setup com wallpaper de fábrica"
              fill
              quality={70}
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-cover"
              draggable={false}
              onContextMenu={noContextMenu}
            />
            <span className="absolute left-4 top-4 rounded-full bg-black/60 px-4 py-1.5 text-xs font-semibold tracking-wide text-white">
              ANTES
            </span>
          </div>

          {/* divider */}
          <div
            className="absolute inset-y-0 z-10 w-0.5 bg-white/80"
            style={{ left: `${percent}%` }}
          >
            <button
              onPointerDown={onPointerDown}
              className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-ink-950 shadow-aura"
              aria-label="Arrastar comparação"
            >
              <MoveHorizontal size={18} />
            </button>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.25} className="mt-10 text-center">
        <PrimaryButton href="#pricing">QUERO TRANSFORMAR MINHAS TELAS</PrimaryButton>
      </Reveal>
    </section>
  );
}
