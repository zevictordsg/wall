import type { Metadata } from "next";

import AntiInspect from "@/components/AntiInspect";

// Fontes auto-hospedadas (sem chamadas para Google Fonts em runtime).
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/playfair-display/500-italic.css";
import "@fontsource/playfair-display/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "AuraPapers | Wallpapers Exclusivos em Pintura a Óleo",
  description:
    "Coleção de wallpapers exclusivos em pintura a óleo impasto, para notebook e celular. 4K, download imediato, pagamento único.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-ink-950 text-white antialiased">
        <AntiInspect />
        {children}
      </body>
    </html>
  );
}
