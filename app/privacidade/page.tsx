import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade | AuraPapers",
  description: "Como a AuraPapers coleta, usa e protege os seus dados.",
};

export default function PrivacidadePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 md:py-28">
      <Link href="/" className="text-sm text-aura-400 hover:text-aura-300">
        ← Voltar para a AuraPapers
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
        Política de Privacidade
      </h1>
      <p className="mt-2 text-sm text-white/40">Última atualização: agosto de 2026.</p>

      <div className="mt-10 space-y-8 text-white/70">
        <section>
          <h2 className="text-lg font-semibold text-white">1. Quem somos</h2>
          <p className="mt-2">
            A AuraPapers é um produto digital que vende coleções de
            wallpapers em estilo pintura a óleo (impasto) para computador e
            celular. Este documento explica quais dados coletamos ao longo
            da sua visita e da sua compra, e como usamos essas informações.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">2. Dados que coletamos</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              Dados de navegação (páginas visitadas, dispositivo, origem do
              acesso) coletados automaticamente por ferramentas de análise e
              publicidade, como Meta Pixel e Utmify, para medir o
              desempenho de campanhas e melhorar a experiência do site.
            </li>
            <li>
              Dados de pagamento e contato (nome, e-mail, dados do cartão ou
              método de pagamento escolhido) são coletados e processados
              diretamente pela nossa plataforma de pagamentos (Wiapy) no
              momento da compra — a AuraPapers não armazena dados
              financeiros em seus próprios servidores.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">3. Como usamos os dados</h2>
          <p className="mt-2">
            Usamos os dados coletados para processar sua compra, entregar os
            arquivos adquiridos, dar suporte quando necessário, e para
            entender quais canais de divulgação funcionam melhor (por meio
            de pixels de rastreamento de conversão). Não vendemos seus
            dados pessoais a terceiros.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">4. Cookies e pixels</h2>
          <p className="mt-2">
            Este site utiliza cookies e pixels de rastreamento (Meta Pixel e
            Utmify) para medir a origem de visitas e o resultado de
            campanhas de anúncios. Você pode bloquear cookies e scripts de
            rastreamento diretamente nas configurações do seu navegador.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">5. Seus direitos</h2>
          <p className="mt-2">
            Você pode solicitar a qualquer momento a exclusão dos seus
            dados de contato do nosso sistema, entrando em contato pelo
            canal de suporte informado no e-mail de confirmação da compra.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">6. Contato</h2>
          <p className="mt-2">
            Dúvidas sobre esta política podem ser enviadas para o mesmo
            canal de suporte usado no atendimento pós-venda.
          </p>
        </section>
      </div>
    </main>
  );
}
