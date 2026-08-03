"use client";

import Image from "next/image";
import { useMemo } from "react";
import type { GalleryItem } from "@/lib/wallpapers.server";
import { Accent, noContextMenu, PrimaryButton, Reveal, SectionHeading } from "./ui";

function Tile({
  item,
  delay,
  className,
}: {
  item: GalleryItem;
  delay: number;
  className: string;
}) {
  return (
    <Reveal delay={delay}>
      <div className={`group relative block w-full overflow-hidden rounded-xl border border-white/5 md:rounded-2xl ${className}`}>
        <Image
          src={item.src}
          alt={item.alt}
          fill
          quality={50}
          sizes="(min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          draggable={false}
          onContextMenu={noContextMenu}
        />
        {/* marca d'água sutil repetida, pra dificultar o reuso da imagem "crua" */}
        <div className="watermark-text pointer-events-none absolute inset-0" />
        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-[10px] font-medium tracking-wider text-white/80 backdrop-blur">
          {item.label}
        </span>
      </div>
    </Reveal>
  );
}

export default function Gallery({
  items,
  totalCount,
}: {
  items: GalleryItem[];
  totalCount: number;
}) {
  const remaining = Math.max(0, totalCount - items.length);

  // Celular primeiro, depois notebook — cada grupo tem sua própria
  // proporção, então nunca sobra "espaço preto" de linhas com alturas
  // diferentes misturadas no mesmo grid.
  const orderedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        if (a.label === b.label) return 0;
        return a.label === "CELULAR" ? -1 : 1;
      }),
    [items]
  );
  const celularItems = orderedItems.filter((it) => it.label === "CELULAR");
  const notebookItems = orderedItems.filter((it) => it.label === "NOTEBOOK");

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionHeading>
          Cada tela, uma <Accent>pintura</Accent>.
        </SectionHeading>
        <p className="mt-5 text-balance text-white/60">
          Uma amostra das artes da coleção. Pinceladas espessas, relevo e cor
          que você quase consegue tocar, aqui em prévia comprimida; na
          coleção, em resolução máxima.
        </p>
      </Reveal>

      {/* grid-cols em auto-fit: colunas sem item colapsam pra 0, então nunca
          sobra espaço preto "faltando" quando há poucos itens numa fileira,
          em nenhum tamanho de tela */}
      {celularItems.length > 0 && (
        <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 sm:gap-4">
          {celularItems.map((item, i) => (
            <Tile key={item.src} item={item} delay={(i % 8) * 0.05} className="aspect-[3/4.5]" />
          ))}
        </div>
      )}

      {notebookItems.length > 0 && (
        <div
          className={`grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3 sm:gap-4 ${
            celularItems.length > 0 ? "mt-3 sm:mt-4" : "mt-14"
          }`}
        >
          {notebookItems.map((item, i) => (
            <Tile key={item.src} item={item} delay={(i % 6) * 0.05} className="aspect-[4/2.6]" />
          ))}
        </div>
      )}

      <Reveal className="mt-14 text-center">
        <p className="text-white/50">
          {remaining > 0
            ? `...e mais ${remaining} artes esperando por você dentro da coleção.`
            : "...e ainda mais artes exclusivas te esperando dentro da coleção completa."}
        </p>
        <div className="mt-6">
          <PrimaryButton href="#pricing">QUERO TODAS AS ARTES</PrimaryButton>
        </div>
      </Reveal>
    </section>
  );
}
