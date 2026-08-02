import type { Metadata } from "next";
import Script from "next/script";

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
        {/* Meta Pixel — "lazyOnload" pra não competir por rede/CPU com o
            carregamento da página em si (imagens da hero, fontes etc.),
            que é o que mais pesa no LCP. O PageView dispara só um pouco
            mais tarde, sem prejuízo pro tracking. */}
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1569448671247092');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1569448671247092&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <AntiInspect />
        {children}
      </body>
    </html>
  );
}
