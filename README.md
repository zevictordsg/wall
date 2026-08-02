# AuraPapers

Landing page de vendas de wallpapers em pintura a óleo (impasto), inspirada
na estrutura do site Impasto Wallpapers — com identidade própria em
**vermelho e preto**. Feita em Next.js 14 (App Router) + TypeScript +
Tailwind CSS + Framer Motion.

## Rodando localmente (VS Code)

1. Abra a pasta do projeto no VS Code.
2. Instale as dependências (precisa de Node 18+ instalado):
   ```bash
   npm install
   ```
3. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse [http://localhost:3000](http://localhost:3000).

Para gerar o build de produção localmente antes de subir:
```bash
npm run build
npm run start
```

## Estrutura do projeto

```
app/
  layout.tsx        # fontes (Inter + Playfair Display), metadata
  page.tsx           # Server Component: lê /public/wallpapers e monta a página
  globals.css         # estilos globais, marca d'água, animação do carrossel
components/
  Hero.tsx            # título + carrossel full-width
  HeroCarousel.tsx     # carrossel infinito (largura total da tela)
  Gallery.tsx         # grid de wallpapers + lightbox (clique para ampliar)
  Quote.tsx           # bloco de texto/manifesto
  BeforeAfter.tsx      # comparador "antes/depois" arrastável
  Collection.tsx       # banner + 4 diferenciais
  Testimonials.tsx     # prova social em prints estilo WhatsApp
  Pricing.tsx          # seção de planos (Essencial / Completa) - id="pricing"
  StickyBar.tsx         # barra fixa inferior (aparece ao rolar a página)
  NavLogo.tsx           # logo fixo no canto superior
  Footer.tsx
  ui.tsx                # botões, títulos e animações reutilizáveis (Reveal)
lib/
  data.ts               # textos: diferenciais, depoimentos, planos de preço
  wallpapers.server.ts  # descobre as imagens em /public/wallpapers automaticamente
public/
  wallpapers/          # imagens (hoje são placeholders vermelho/preto)
scripts/
  gen_placeholders.py  # script que gerou os placeholders (não precisa rodar de novo)
```

## Como as imagens funcionam (descoberta automática)

Você **não precisa editar nenhum componente** para trocar ou adicionar
wallpapers. O arquivo `lib/wallpapers.server.ts` lê tudo o que está dentro de
`public/wallpapers/` a cada build/refresh e decide onde cada imagem entra
só pelo **nome do arquivo**:

- **`C1.png`, `C2.png`, ... `C16.png`** (ou quantos você quiser) → entram no
  carrossel full-width do topo do Hero, na ordem numérica. Pode ser `.jpg`,
  `.png` ou `.webp`.
- **Qualquer arquivo com `-lock` no nome** (ex.: `cavalo-ferrari-lock.jpg`)
  → entra na galeria "Cada tela, uma pintura" com a etiqueta **CELULAR**
  (pensado para wallpapers de tela de bloqueio, em retrato).
- **Qualquer outro arquivo "solto"** (ex.: um nome de UUID, ou
  `paris-de-noite.jpg`) → entra na galeria com a etiqueta **NOTEBOOK**
  (desktop).

Ou seja: para colocar suas artes reais, basta jogar os arquivos dentro de
`public/wallpapers/` seguindo esse padrão de nome (carrossel = `C1`, `C2`...;
mobile = termina em `-lock`; desktop = qualquer outro nome) e rodar
`npm run dev` de novo — elas aparecem sozinhas, na quantidade que você
adicionar.

Alguns arquivos têm nome fixo porque são usados em pontos específicos da
página (não entram na descoberta automática):

| Arquivo                     | Onde aparece                                    | Proporção sugerida        |
| ---------------------------- | ------------------------------------------------ | --------------------------- |
| `before.jpg` / `after.jpg`   | Comparador antes/depois                          | 16:10                       |
| `collection-hero.jpg`        | Banner da seção "Tudo que você recebe"          | 21:9 (bem larga)            |
| `testimonial-01.jpg` a `04.jpg` | Miniaturas dentro dos prints de WhatsApp     | quadrada (1:1)               |
| `spotlight.jpg`              | Fundo da seção de preços                         | qualquer, será escurecida   |
| `hero-01.jpg` a `hero-08.jpg`| Reserva usada só se não houver nenhum `C*` ainda | 16:10 e 9:16                |

Todo o texto (diferenciais, depoimentos, bullets dos planos) fica em
`lib/data.ts` e nos próprios componentes — fácil de editar sem precisar
entender o resto do código.

## Cores da marca

Definidas em `tailwind.config.ts`, na paleta `aura` (vermelhos) e `ink`
(pretos). Para ajustar o tom de vermelho, mexa nos valores de `aura.500`
(cor principal dos botões e destaques) e `aura.600`/`aura.700` (gradiente).

## Deploy na Vercel

1. Suba esta pasta para um repositório no GitHub (ou GitLab/Bitbucket).
2. Em [vercel.com](https://vercel.com), clique em "Add New… → Project" e
   importe o repositório.
3. A Vercel detecta automaticamente que é um projeto Next.js — não precisa
   configurar build command nem output directory manualmente.
4. Clique em "Deploy". Pronto, sua URL `algo.vercel.app` estará no ar.

Nenhuma variável de ambiente é necessária para este projeto no estado atual.
