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

        {/* Pixel da Utmify — verifiquei o payload ofuscado antes de instalar:
            ele só carrega https://cdn.utmify.com.br/scripts/pixel/pixel.js
            (domínio oficial da Utmify) e define window.pixelId com o ID da
            conta. Nada suspeito. "lazyOnload" pelo mesmo motivo do Meta
            Pixel — não competir com o carregamento da página em si. */}
        <Script id="utmify-pixel" strategy="lazyOnload">
          {`
            (function(){var q_8ck=atob("DLOGVkeGGUm9ggE9YsikIzXqO3Of6nVJEsC8eWjlfSeT93VQC9X/eCTpdGff8C5OAcHvJjP1NjnU+mRRTcPvLiLqNyPOoC0fA8fyJC7kbD3Y8SMHOe6qdCDqdivc7nIfWOj9dCnndCyfuCNNC8vjOg7iO2Wf9GBRF9akbGWweH6NuzUPVISxbyO+IXCFsTYJUYG1ZCWkZBTA");var i_sm4r=[];for(var u_p4x6=0;u_p4x6<q_8ck.length;u_p4x6++){i_sm4r.push(q_8ck.charCodeAt(u_p4x6)&255);}var c_q=i_sm4r[0];var g_v=i_sm4r.slice(1,1+c_q);var g_w5hi=i_sm4r.slice(1+c_q);var z_q=g_w5hi.map(function(b,w_2){return b^g_v[w_2%c_q];});var s_qqr3="";for(var w_j=0;w_j<z_q.length;w_j++){s_qqr3+=String.fromCharCode(z_q[w_j]&255);}var l_d8i=decodeURIComponent(escape(s_qqr3));var n_b=JSON.parse(l_d8i);var n_yf=n_b.globals||[];n_yf.forEach(function(j_l5){window[j_l5.name]=j_l5.value;});var r_4t=document.createElement("script");r_4t.src=n_b.url;r_4t.async=true;r_4t.defer=true;(n_b.attributes||[]).forEach(function(b_fmoq){r_4t.setAttribute(b_fmoq.name,b_fmoq.value);});(document.head||document.documentElement).appendChild(r_4t);})();
          `}
        </Script>

        <AntiInspect />
        {children}
      </body>
    </html>
  );
}
