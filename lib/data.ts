// As imagens da galeria e do carrossel do hero agora são descobertas
// automaticamente a partir dos arquivos em /public/wallpapers — veja
// lib/wallpapers.server.ts. Não é mais necessário listar os nomes aqui.

export const features = [
  {
    title: "Mais de 100 pinturas",
    description:
      "Curadoria exclusiva em estilo impasto, que você não encontra em nenhum banco de imagens.",
  },
  {
    title: "4K para notebook",
    description:
      "Resolução 3840×2160, nítida no MacBook, no notebook Windows e no monitor externo.",
  },
  {
    title: "Versões para celular",
    description:
      "Cada arte recortada para a tela do iPhone e do Android, sem perder a composição.",
  },
  {
    title: "Download imediato",
    description: "Pagou, baixou. Arquivos organizados por dispositivo, prontos para usar.",
  },
];

export type Testimonial = {
  name: string;
  time: string;
  messages: { from: "them" | "me"; text: string; time: string }[];
};

// As miniaturas de cada depoimento (a foto que aparece dentro do print do
// WhatsApp) vêm de lib/wallpapers.server.ts, distribuídas automaticamente
// a partir das artes reais — não ficam fixas aqui.
export const testimonials: Testimonial[] = [
  {
    name: "Rafael",
    time: "Hoje",
    messages: [
      { from: "me", text: "Bom dia! Tudo certo?", time: "12:04" },
      { from: "me", text: "Vi que comprou a coleção da AuraPapers, chegou certinho?", time: "12:04" },
      { from: "them", text: "opa bom dia", time: "12:05" },
      { from: "them", text: "chegou sim!!", time: "12:05" },
      { from: "them", text: "mto lindo, amei a textura", time: "12:06" },
      { from: "me", text: "Fico feliz que tenha gostado, em breve tem arte nova 🔥", time: "12:06" },
    ],
  },
  {
    name: "Marina",
    time: "Ontem",
    messages: [
      { from: "me", text: "Olá Marina, tudo bem?", time: "12:12" },
      { from: "me", text: "Vi que comprou o produto da AuraPapers, chegou certinho pra você?", time: "12:13" },
      { from: "them", text: "Oii, estou bem e você?", time: "12:34" },
      { from: "them", text: "Chegou sim! Amei os wallpapers", time: "12:34" },
      { from: "me", text: "Muito obrigado pelo feedback! Estou à disposição ❤️", time: "12:34" },
    ],
  },
  {
    name: "Bia",
    time: "Boa tarde",
    messages: [
      { from: "them", text: "Boa tarde", time: "14:56" },
      { from: "them", text: "Tudo sim", time: "14:56" },
      { from: "me", text: "Vi que comprou o produto da AuraPapers, chegou tudo certinho pra você?", time: "14:56" },
      { from: "them", text: "Já ta tudo funcionando por aq kkk", time: "14:57" },
      { from: "me", text: "Perfeito, fico feliz que tenha gostado", time: "15:07" },
    ],
  },
  {
    name: "Thiago",
    time: "Ontem",
    messages: [
      { from: "me", text: "Olá Thiago, tudo bem?", time: "12:21" },
      { from: "me", text: "Vi que comprou o produto da AuraPapers, chegou tudo certinho pra você?", time: "12:21" },
      { from: "them", text: "Chegou sim! Já estou usando, inclusive kkkk", time: "12:22" },
      { from: "them", text: "Muito obrigado! Fico feliz que tenha ficado bom", time: "12:22" },
      { from: "them", text: "Ainda hoje estarei adicionando mais artes novas", time: "12:23" },
      { from: "me", text: "Show, valeu demais!", time: "12:24" },
    ],
  },
];

export type PricingPlan = {
  id: string;
  name: string;
  subtitle?: string;
  price: string;
  featured?: boolean;
  badge?: string;
  perks: string[];
  cta: string;
  note?: string;
  /** link de checkout (Wiapy) desse plano específico */
  checkoutUrl: string;
};

// Usado tanto no texto dos planos quanto no selo "+200" da tira de imagens.
export const COLLECTION_SIZE = 200;

export const pricingPlans: PricingPlan[] = [
  {
    id: "essencial",
    name: "Coleção Essencial",
    price: "R$ 9,90",
    perks: [
      "Mais de 100 wallpapers em 4K + versões para celular",
      "Compatível com Mac, Windows, iPhone e Android",
      "Download imediato e acesso vitalício",
      "Garantia de 7 dias",
    ],
    cta: "Quero só a Essencial",
    checkoutUrl: "https://pay.wiapy.com/mdmeAy8wUzZs",
  },
  {
    id: "completa",
    name: "Coleção Completa",
    subtitle: "O acervo completo, em todos os formatos.",
    price: "R$ 19,90",
    featured: true,
    badge: "MAIS VENDIDO",
    perks: [
      "Mais de 200 wallpapers em 4K: cada pintura em versão original, dourada e mais formatos",
      "Compatível com Mac, Windows, iPhone e Android",
      "Versões ultrawide 21:9, iPad e tela de bloqueio",
      "Guia bônus: wallpaper novo todo dia, no automático",
      "Atualizações futuras com acesso antecipado",
      "Garantia estendida de 30 dias",
    ],
    cta: "Quero a Coleção Completa",
    note: "Menos de 10 centavos por wallpaper.",
    checkoutUrl: "https://pay.wiapy.com/oHLpIxkg4cBD",
  },
];

// CTA da hero, que já cita o preço da Essencial diretamente.
export const HERO_CHECKOUT_URL = pricingPlans[0].checkoutUrl;
