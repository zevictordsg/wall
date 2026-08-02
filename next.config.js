/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Placeholders são servidos localmente de /public/wallpapers.
    // Quando trocar por imagens reais hospedadas externamente, adicione o domínio aqui.
    remotePatterns: [],
  },
};

module.exports = nextConfig;
