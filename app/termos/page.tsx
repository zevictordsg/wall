import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso | AuraPapers",
  description: "Condições de uso e compra dos produtos da AuraPapers.",
};

export default function TermosPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 md:py-28">
      <Link href="/" className="text-sm text-aura-400 hover:text-aura-300">
        ← Voltar para a AuraPapers
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
        Termos de Uso
      </h1>
      <p className="mt-2 text-sm text-white/40">Última atualização: agosto de 2026.</p>

      <div className="mt-10 space-y-8 text-white/70">
        <section>
          <h2 className="text-lg font-semibold text-white">1. O produto</h2>
          <p className="mt-2">
            A AuraPapers vende coleções digitais de wallpapers originais em
            estilo pintura a óleo (impasto), em versões para notebook e
            celular. O acesso aos arquivos é liberado após a confirmação do
            pagamento, processado pela plataforma Wiapy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">2. Licença de uso</h2>
          <p className="mt-2">
            Ao comprar uma coleção, você recebe uma licença de uso pessoal
            das imagens como papel de parede em seus próprios dispositivos.
            Não é permitido revender, redistribuir ou publicar os arquivos
            (originais ou editados) como se fossem seus, nem disponibilizá-los
            publicamente em bancos de imagens ou redes sociais para
            download por terceiros.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">3. Pagamento</h2>
          <p className="mt-2">
            O pagamento é único (sem assinatura ou cobrança recorrente) e
            processado por um parceiro de pagamentos externo. A AuraPapers
            não armazena dados de cartão ou de pagamento em seus próprios
            servidores.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">4. Garantia</h2>
          <p className="mt-2">
            Cada plano tem o prazo de garantia informado na própria página
            de preços (7 ou 30 dias, conforme o plano escolhido). Dentro
            desse prazo, se você não ficar satisfeito, entre em contato pelo
            canal informado no e-mail de confirmação da compra para
            solicitar o reembolso.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">5. Alterações</h2>
          <p className="mt-2">
            Estes termos podem ser atualizados periodicamente. A versão em
            vigor é sempre a publicada nesta página.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">6. Contato</h2>
          <p className="mt-2">
            Dúvidas sobre estes termos podem ser enviadas pelo mesmo canal
            de suporte usado no atendimento pós-venda.
          </p>
        </section>
      </div>
    </main>
  );
}
