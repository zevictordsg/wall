import fs from "fs";
import path from "path";
import { imageSize } from "image-size";

/**
 * Descoberta automática das imagens em /public/wallpapers.
 *
 * Em vez de listar cada arquivo manualmente no código, este módulo lê a
 * pasta em tempo de build/render (só roda no servidor) e monta todos os
 * "slots" de imagem da página a partir de um único conjunto de arquivos:
 *
 *  - `C1.png`, `C2.png`, ... `C16.png`  -> carrossel do Hero (ordem numérica)
 *  - qualquer arquivo começando com `prova-` -> miniaturas dos depoimentos
 *    (prova social), na ordem em que aparecem
 *  - `padrao.png` -> imagem "antes" do comparador; `depois.png` -> "depois"
 *  - qualquer outro arquivo com "-lock" no nome -> galeria "CELULAR"
 *  - qualquer outro arquivo "solto" -> galeria "NOTEBOOK"
 *
 * A galeria ("Cada tela, uma pintura") mostra só ~40% desse conjunto, como
 * amostra/teaser — o restante (60%) é reaproveitado automaticamente para
 * preencher o banner da seção "Tudo que você recebe", o fundo da seção de
 * preços, a imagem de revelação e as imagens flutuantes da seção de citação,
 * para nenhum desses lugares ficar com a imagem placeholder vermelho/preto
 * enquanto houver arte real disponível.
 *
 * Os nomes de arquivo são sempre URL-encodados ao virar `src` — sem isso,
 * arquivos com espaço, acento ou parênteses no nome (comuns quando se baixa
 * imagem por imagem) quebram e não carregam no navegador.
 */

const WALLPAPERS_DIR = path.join(process.cwd(), "public", "wallpapers");

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

// Arquivos "de sistema": só usados como último recurso, se a pasta ainda
// não tiver nenhuma arte real (estado inicial do projeto).
const SYSTEM_FILES = new Set(["before.jpg", "after.jpg", "collection-hero.jpg", "spotlight.jpg"]);
const TESTIMONIAL_RE = /^testimonial-\d+\.(jpe?g|png|webp|avif)$/i;
const HERO_RE = /^hero-\d+\.(jpe?g|png|webp|avif)$/i;
// Placeholders originais de exemplo (gallery-01.jpg, gallery-04-lock.jpg...).
// Ficam de fora do pool assim que existir arte real, pra nunca mais
// aparecerem misturados com as artes de verdade.
const GALLERY_FALLBACK_RE = /^gallery-\d+(-lock)?\.(jpe?g|png|webp|avif)$/i;
const CAROUSEL_RE = /^c(\d+)\.(jpe?g|png|webp|avif)$/i;
const LOCK_RE = /-?lock/i;

// Arquivos reservados por convenção de nome (definidos junto com você):
const PROVA_RE = /^prova-/i;
const BEFORE_OVERRIDE_FILE = "padrao.png";
const AFTER_OVERRIDE_FILE = "depois.png";
// Imagem específica escolhida para o banner de "Tudo que você recebe".
const COLLECTION_HERO_OVERRIDE_FILE = "7b0e529f-19ed-44b7-af73-9bf1fcdb42d1.png";

// Fração da coleção real mostrada na galeria pública (o resto fica "trancado"
// dentro do produto, e ainda é reaproveitado em outras seções da página).
const GALLERY_PREVIEW_RATIO = 0.4;

export type GalleryItem = {
  src: string;
  label: "NOTEBOOK" | "CELULAR";
  alt: string;
};

/** Imagem com a proporção real, pra não cortar nada ao exibir. */
export type CarouselImage = {
  src: string;
  width: number;
  height: number;
};

export type WallpaperAssets = {
  carousel: CarouselImage[];
  galleryPreview: GalleryItem[];
  /** total de artes reais disponíveis (não só as mostradas na prévia) */
  galleryTotalCount: number;
  collectionHero: string;
  beforeImage: string;
  afterImage: string;
  /** fundo da seção de preços: paisagem no desktop, retrato no mobile —
   *  evita o "zoom" exagerado de esticar uma imagem paisagem numa tela
   *  estreita e alta (ou vice-versa). */
  spotlightImageDesktop: string;
  spotlightImageMobile: string;
  /** miniaturas dos depoimentos, já com a proporção real (pra não cortar) */
  testimonialThumbs: CarouselImage[];
  /** true quando são prints reais de prova social (arquivos "prova-*") —
   *  nesse caso o print substitui todo o card, em vez de aparecer dentro
   *  de uma conversa de WhatsApp simulada */
  hasProvaProof: boolean;
  /** imagem que "se completa" conforme o scroll, acima da citação */
  quoteImage: CarouselImage;
  /** imagens flutuantes decorativas da seção de citação (atualmente não exibidas) */
  floatingImages: CarouselImage[];
  /** tira de miniaturas empilhadas no plano em destaque da seção de preços */
  pricingPreviewImages: CarouselImage[];
};

const FALLBACK_GALLERY: GalleryItem[] = [
  { src: "/wallpapers/gallery-01.jpg", label: "NOTEBOOK", alt: "Wallpaper AuraPapers para notebook" },
  { src: "/wallpapers/gallery-02.jpg", label: "NOTEBOOK", alt: "Wallpaper AuraPapers para notebook" },
  { src: "/wallpapers/gallery-03.jpg", label: "NOTEBOOK", alt: "Wallpaper AuraPapers para notebook" },
  { src: "/wallpapers/gallery-04-lock.jpg", label: "CELULAR", alt: "Wallpaper AuraPapers para celular" },
  { src: "/wallpapers/gallery-05-lock.jpg", label: "CELULAR", alt: "Wallpaper AuraPapers para celular" },
  { src: "/wallpapers/gallery-06-lock.jpg", label: "CELULAR", alt: "Wallpaper AuraPapers para celular" },
  { src: "/wallpapers/gallery-07.jpg", label: "NOTEBOOK", alt: "Wallpaper AuraPapers para notebook" },
  { src: "/wallpapers/gallery-08.jpg", label: "NOTEBOOK", alt: "Wallpaper AuraPapers para notebook" },
  { src: "/wallpapers/gallery-09.jpg", label: "NOTEBOOK", alt: "Wallpaper AuraPapers para notebook" },
  { src: "/wallpapers/gallery-10.jpg", label: "NOTEBOOK", alt: "Wallpaper AuraPapers para notebook" },
  { src: "/wallpapers/gallery-11.jpg", label: "NOTEBOOK", alt: "Wallpaper AuraPapers para notebook" },
  { src: "/wallpapers/gallery-12.jpg", label: "NOTEBOOK", alt: "Wallpaper AuraPapers para notebook" },
  { src: "/wallpapers/gallery-13-lock.jpg", label: "CELULAR", alt: "Wallpaper AuraPapers para celular" },
  { src: "/wallpapers/gallery-14-lock.jpg", label: "CELULAR", alt: "Wallpaper AuraPapers para celular" },
  { src: "/wallpapers/gallery-15-lock.jpg", label: "CELULAR", alt: "Wallpaper AuraPapers para celular" },
];

const FALLBACK_CAROUSEL_FILES = [
  "hero-01.jpg",
  "hero-02.jpg",
  "hero-03.jpg",
  "hero-04.jpg",
  "hero-05.jpg",
  "hero-06.jpg",
  "hero-07.jpg",
  "hero-08.jpg",
];

const FALLBACK_TESTIMONIAL_THUMBS = [
  "testimonial-01.jpg",
  "testimonial-02.jpg",
  "testimonial-03.jpg",
  "testimonial-04.jpg",
];

function listImageFiles(): string[] {
  try {
    return fs.readdirSync(WALLPAPERS_DIR).filter((f) => IMAGE_EXT.test(f));
  } catch {
    return [];
  }
}

function fileExists(file: string): boolean {
  try {
    return fs.existsSync(path.join(WALLPAPERS_DIR, file));
  } catch {
    return false;
  }
}

/** Caminho público seguro: escapa espaço, acento, parênteses etc.
 *  Obs.: o servidor de estáticos do Next não resolve "%26" de volta para
 *  "&" ao procurar o arquivo em /public, então mantemos o "&" literal
 *  (que funciona) em vez de codificado (que dá 404). */
function publicPath(file: string): string {
  return `/wallpapers/${encodeURIComponent(file).replace(/%26/g, "&")}`;
}

function humanizeFileName(file: string): string {
  const base = file.replace(IMAGE_EXT, "").replace(/-?lock$/i, "");
  const isUuidLike = /^[0-9a-f]{6,}[-a-f0-9]{10,}$/i.test(base) || /^[0-9a-f-]{20,}$/i.test(base);
  if (isUuidLike || base.length < 2) return "Wallpaper AuraPapers";
  return base
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Lê a largura/altura reais do arquivo (pra não cortar nada ao exibir). */
function getDimensions(file: string): { width: number; height: number } {
  try {
    const buffer = fs.readFileSync(path.join(WALLPAPERS_DIR, file));
    const { width, height } = imageSize(buffer);
    if (width && height) return { width, height };
  } catch {
    // ignora e cai no fallback abaixo
  }
  return { width: 9, height: 16 };
}

function toImageWithDims(file: string): CarouselImage {
  return { src: publicPath(file), ...getDimensions(file) };
}

function toCarouselImages(files: string[]): CarouselImage[] {
  return files.map(toImageWithDims);
}

/** Pega `count` itens de `arr` ciclando (dá a volta) a partir de `offset`. */
function cyclePick<T>(arr: T[], count: number, offset: number): T[] {
  if (arr.length === 0) return [];
  return Array.from({ length: count }, (_, i) => arr[(offset + i) % arr.length]);
}

export function getWallpaperAssets(): WallpaperAssets {
  const files = listImageFiles();

  const carouselFiles = files
    .filter((f) => CAROUSEL_RE.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(CAROUSEL_RE)?.[1] ?? "0", 10);
      const nb = parseInt(b.match(CAROUSEL_RE)?.[1] ?? "0", 10);
      return na - nb;
    });

  const carousel: CarouselImage[] =
    carouselFiles.length > 0 ? toCarouselImages(carouselFiles) : toCarouselImages(FALLBACK_CAROUSEL_FILES);

  // Miniaturas dos depoimentos: qualquer arquivo "prova-*", na ordem em que
  // aparece na pasta.
  const provaFiles = files.filter((f) => PROVA_RE.test(f)).sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));

  const hasBeforeOverride = fileExists(BEFORE_OVERRIDE_FILE);
  const hasAfterOverride = fileExists(AFTER_OVERRIDE_FILE);
  const hasCollectionOverride = fileExists(COLLECTION_HERO_OVERRIDE_FILE);

  // O "pool" é toda arte real disponível para a galeria e para as outras
  // seções — tudo que não seja arquivo de sistema, depoimento, hero de
  // fallback, imagem do carrossel ou um dos arquivos reservados acima.
  const rawPool = files.filter((f) => {
    if (SYSTEM_FILES.has(f.toLowerCase())) return false;
    if (TESTIMONIAL_RE.test(f)) return false;
    if (HERO_RE.test(f)) return false;
    if (CAROUSEL_RE.test(f)) return false;
    if (PROVA_RE.test(f)) return false;
    if (f === BEFORE_OVERRIDE_FILE || f === AFTER_OVERRIDE_FILE) return false;
    if (f === COLLECTION_HERO_OVERRIDE_FILE) return false;
    return true;
  });

  // Se ainda não existe NENHUMA arte real (só os placeholders de exemplo
  // como gallery-01.jpg), usa o conjunto de fallback curado inteiro. Assim
  // que houver qualquer arquivo real, os placeholders somem do pool e
  // nunca mais aparecem em lugar nenhum da página.
  const hasRealArt = rawPool.some((f) => !GALLERY_FALLBACK_RE.test(f)) || provaFiles.length > 0 || hasBeforeOverride || hasAfterOverride;

  if (!hasRealArt) {
    const fallbackQuote = toImageWithDims("collection-hero.jpg");
    return {
      carousel,
      galleryPreview: FALLBACK_GALLERY,
      galleryTotalCount: FALLBACK_GALLERY.length,
      collectionHero: "/wallpapers/collection-hero.jpg",
      beforeImage: "/wallpapers/before.jpg",
      afterImage: "/wallpapers/after.jpg",
      spotlightImageDesktop: "/wallpapers/spotlight.jpg",
      spotlightImageMobile: "/wallpapers/spotlight.jpg",
      testimonialThumbs: toCarouselImages(FALLBACK_TESTIMONIAL_THUMBS),
      hasProvaProof: false,
      quoteImage: fallbackQuote,
      floatingImages: toCarouselImages(FALLBACK_CAROUSEL_FILES.slice(0, 4)),
      pricingPreviewImages: toCarouselImages(FALLBACK_CAROUSEL_FILES.slice(0, 3)),
    };
  }

  const pool = rawPool.filter((f) => !GALLERY_FALLBACK_RE.test(f));

  const notebookFiles = pool.filter((f) => !LOCK_RE.test(f)).sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));
  const celularFiles = pool.filter((f) => LOCK_RE.test(f)).sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));

  // Intercala NOTEBOOK/CELULAR só pra decidir QUAIS entram na prévia (a
  // ordem de exibição na tela é decidida pelo próprio componente da
  // galeria, que agrupa celular primeiro e depois notebook).
  const interleaved: string[] = [];
  const maxLen = Math.max(notebookFiles.length, celularFiles.length);
  for (let i = 0; i < maxLen; i++) {
    if (notebookFiles[i]) interleaved.push(notebookFiles[i]);
    if (celularFiles[i]) interleaved.push(celularFiles[i]);
  }

  const previewCount = Math.min(interleaved.length, Math.max(1, Math.round(interleaved.length * GALLERY_PREVIEW_RATIO)));
  const previewFiles = interleaved.slice(0, previewCount);
  const leftoverFiles = interleaved.slice(previewCount);

  // Reaproveita o restante (60%) para as outras seções. Se sobrar pouco (ou
  // nada), cicla de volta pelo pool inteiro em vez de usar placeholder.
  const rotationSource = leftoverFiles.length > 0 ? leftoverFiles : interleaved;

  const galleryPreview: GalleryItem[] = previewFiles.map((file) => ({
    src: publicPath(file),
    label: LOCK_RE.test(file) ? "CELULAR" : "NOTEBOOK",
    alt: humanizeFileName(file),
  }));

  let cursor = 0;
  function take(count: number): string[] {
    const picked = cyclePick(rotationSource, count, cursor);
    cursor += count;
    return picked;
  }

  const collectionHero = hasCollectionOverride ? publicPath(COLLECTION_HERO_OVERRIDE_FILE) : publicPath(take(1)[0]);

  const afterImage = hasAfterOverride ? publicPath(AFTER_OVERRIDE_FILE) : publicPath(take(1)[0]);
  const beforeImage = hasBeforeOverride ? publicPath(BEFORE_OVERRIDE_FILE) : "/wallpapers/before.jpg";

  // Fundo da seção de preços: pega uma imagem "paisagem" (notebook) pro
  // desktop e uma "retrato" (celular) pro mobile, em vez de esticar a
  // mesma imagem nos dois formatos.
  const rotationNotebook = rotationSource.filter((f) => !LOCK_RE.test(f));
  const rotationCelular = rotationSource.filter((f) => LOCK_RE.test(f));
  const spotlightImageDesktop = publicPath(
    rotationNotebook[0] ?? notebookFiles[0] ?? rotationSource[0]
  );
  const spotlightImageMobile = publicPath(
    rotationCelular[0] ?? celularFiles[0] ?? rotationSource[0]
  );

  const hasProvaProof = provaFiles.length > 0;
  const testimonialThumbs = hasProvaProof
    ? cyclePick(provaFiles, 4, 0).map(toImageWithDims)
    : take(4).map(toImageWithDims);

  // A imagem da seção de citação usa sempre uma versão "desktop"
  // (paisagem/notebook), nunca a de celular.
  const quoteImage = toImageWithDims(
    rotationNotebook[1] ?? rotationNotebook[0] ?? notebookFiles[0] ?? rotationSource[0]
  );
  const floatingImages = toCarouselImages(take(4));
  const pricingPreviewImages = toCarouselImages(take(3));

  return {
    carousel,
    galleryPreview,
    galleryTotalCount: interleaved.length,
    collectionHero,
    beforeImage,
    afterImage,
    spotlightImageDesktop,
    spotlightImageMobile,
    testimonialThumbs,
    hasProvaProof,
    quoteImage,
    floatingImages,
    pricingPreviewImages,
  };
}
