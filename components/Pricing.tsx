"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { COLLECTION_SIZE, pricingPlans } from "@/lib/data";
import type { CarouselImage } from "@/lib/wallpapers.server";
import {
  Accent,
  Eyebrow,
  noContextMenu,
  OutlineButton,
  PrimaryButton,
  Reveal,
  SectionHeading,
} from "./ui";

export default function Pricing({
  spotlightImageDesktop,
  spotlightImageMobile,
  previewImages,
}: {
  spotlightImageDesktop: string;
  spotlightImageMobile: string;
  previewImages: CarouselImage[];
}) {
  return (
    <section id="pricing" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 -z-10">
        {/* imagem retrato no mobile, paisagem no desktop — evita esticar a
            imagem errada e dar aquele efeito de "zoom" exagerado */}
        <Image
          src={spotlightImageMobile}
          alt=""
          fill
          quality={60}
          sizes="100vw"
          className="object-cover md:hidden"
          draggable={false}
          onContextMenu={noContextMenu}
        />
        <Image
          src={spotlightImageDesktop}
          alt=""
          fill
          quality={60}
          sizes="100vw"
          className="hidden object-cover md:block"
          draggable={false}
          onContextMenu={noContextMenu}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/55 to-ink-950" />
      </div>

      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="text-center">
          <Eyebrow>Oferta</Eyebrow>
          <SectionHeading>
            Leve a <Accent>galeria</Accent> com você
          </SectionHeading>
          <p className="mx-auto mt-5 max-w-xl text-balance text-white/60">
            Escolha o seu acervo. Pagamento único nos dois planos, sem
            assinatura e sem mensalidade.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-stretch">
          {pricingPlans.map((plan, i) => (
            <Reveal
              key={plan.id}
              delay={i * 0.1}
              className={plan.featured ? "md:col-span-7" : "md:col-span-5"}
            >
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-8 backdrop-blur-xl md:p-10 ${
                  plan.featured
                    ? "border-aura-500/60 bg-black/35 shadow-aura"
                    : "border-white/10 bg-black/25"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-aura-gradient px-4 py-1 text-[11px] font-bold tracking-wide text-white shadow-aura">
                    {plan.badge}
                  </span>
                )}

                <div
                  className={
                    plan.featured
                      ? "flex flex-1 flex-col gap-8 md:flex-row md:items-center md:justify-between"
                      : "flex flex-1 flex-col"
                  }
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    {plan.subtitle && (
                      <p className="mt-1 text-sm text-white/60">{plan.subtitle}</p>
                    )}

                    {!plan.featured && (
                      <>
                        <p className="mt-4 text-xs uppercase tracking-wide text-white/40">
                          Pagamento único
                        </p>
                        <p className="mt-2 text-4xl font-bold">{plan.price}</p>
                      </>
                    )}

                    {plan.featured && previewImages.length > 0 && (
                      <div className="mt-5 flex -space-x-4">
                        {previewImages.map((img, idx) => {
                          const isLast = idx === previewImages.length - 1;
                          return (
                            <div
                              key={img.src}
                              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-ink-950 shadow-lg"
                            >
                              <Image
                                src={img.src}
                                alt=""
                                fill
                                sizes="64px"
                                className="object-cover"
                                draggable={false}
                                onContextMenu={noContextMenu}
                              />
                              {isLast && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-bold text-white">
                                  +{COLLECTION_SIZE}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <ul className="mt-6 space-y-3">
                      {plan.perks.map((perk) => (
                        <li key={perk} className="flex gap-3 text-sm text-white/70">
                          <Check size={18} className="mt-0.5 shrink-0 text-aura-500" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.featured && (
                    <div className="text-center md:w-56 md:shrink-0 md:border-l md:border-white/10 md:pl-8 md:text-left">
                      <p className="text-xs uppercase tracking-wide text-white/40">
                        Pagamento único
                      </p>
                      <p className="mt-2 text-4xl font-bold md:text-5xl">{plan.price}</p>
                      {plan.note && (
                        <p className="mt-2 text-sm text-white/50">{plan.note}</p>
                      )}
                      <div className="mt-6">
                        <PrimaryButton href={plan.checkoutUrl} target="_blank" className="w-full">
                          {plan.cta.toUpperCase()}
                        </PrimaryButton>
                      </div>
                      <p className="mt-3 text-xs text-white/40">
                        Compra segura · Download imediato
                      </p>
                    </div>
                  )}
                </div>

                {!plan.featured && (
                  <div className="mt-8">
                    <OutlineButton href={plan.checkoutUrl} target="_blank" className="w-full">
                      {plan.cta.toUpperCase()}
                    </OutlineButton>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.25} className="mt-10 text-center">
          <p className="text-sm text-white/50">
            Garantia de devolução: se não amar, devolvemos seu dinheiro.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
