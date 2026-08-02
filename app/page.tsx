import BeforeAfter from "@/components/BeforeAfter";
import Collection from "@/components/Collection";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import NavLogo from "@/components/NavLogo";
import Pricing from "@/components/Pricing";
import Quote from "@/components/Quote";
import StickyBar from "@/components/StickyBar";
import Testimonials from "@/components/Testimonials";
import { getWallpaperAssets } from "@/lib/wallpapers.server";

// Server Component: lê /public/wallpapers no servidor (build/render) para
// descobrir automaticamente as imagens do carrossel, da prévia da galeria
// (~40% do total) e distribuir o restante pelas outras seções da página.
export default function Home() {
  const assets = getWallpaperAssets();

  return (
    <main className="relative">
      <NavLogo />
      <Hero carouselImages={assets.carousel} cornerImages={assets.floatingImages.slice(0, 2)} />
      <Gallery items={assets.galleryPreview} totalCount={assets.galleryTotalCount} />
      <Quote image={assets.quoteImage} />
      <BeforeAfter beforeImage={assets.beforeImage} afterImage={assets.afterImage} />
      <Collection heroImage={assets.collectionHero} />
      <Testimonials thumbs={assets.testimonialThumbs} hasProvaProof={assets.hasProvaProof} />
      <Pricing
        spotlightImageDesktop={assets.spotlightImageDesktop}
        spotlightImageMobile={assets.spotlightImageMobile}
        previewImages={assets.pricingPreviewImages}
      />
      <Footer />
      <StickyBar />
    </main>
  );
}
