"use client";

import Image from "next/image";
import { features } from "@/lib/data";
import { Accent, Eyebrow, noContextMenu, Reveal, SectionHeading } from "./ui";

export default function Collection({ heroImage }: { heroImage: string }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <Reveal className="text-center">
        <Eyebrow>A coleção</Eyebrow>
        <SectionHeading>
          Tudo que você <Accent>recebe</Accent>
        </SectionHeading>
      </Reveal>

      <Reveal delay={0.15} className="mt-12">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-white/10">
          <Image
            src={heroImage}
            alt="Visão geral da coleção AuraPapers"
            fill
            sizes="1200px"
            className="object-cover"
            draggable={false}
            onContextMenu={noContextMenu}
          />
        </div>
      </Reveal>

      <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-10">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.08}>
            <h3 className="font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-white/50">{f.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
