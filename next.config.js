/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Placeholders são servidos localmente de /public/wallpapers.
    // Quando trocar por imagens reais hospedadas externamente, adicione o domínio aqui.
    remotePatterns: [],
    // Cache de 1 ano pras versões já otimizadas — como as imagens raramente
    // trocam de nome, isso evita reprocessar/rebaixar em visitas repetidas.
    minimumCacheTTL: 31536000,
  },
};

module.exports = nextConfig;
