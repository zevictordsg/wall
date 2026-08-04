import HeroCarousel from "./HeroCarousel";
import type { CarouselImage } from "@/lib/wallpapers.server";

// Faixa do carrossel, logo abaixo do vídeo da hero (antes ficava dentro da
// própria seção da hero, mas com o vídeo como elemento principal agora ela
// vira uma seção própria).
export default function HeroCarouselStrip({ images }: { images: CarouselImage[] }) {
  return (
    <section className="py-8 md:py-12">
      <HeroCarousel images={images} />
    </section>
  );
}
