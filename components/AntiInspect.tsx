"use client";

import { useEffect, useState } from "react";

/**
 * Camada extra de dificultador contra tentativa de abrir o inspecionar
 * elemento pra baixar as artes "na força":
 *  - bloqueia o menu de contexto (clique direito) em toda a página, não só
 *    nas imagens — essa é a forma mais comum de chegar em "Inspecionar";
 *  - bloqueia os atalhos de teclado mais comuns (F12, Ctrl/Cmd+Shift+I/J/C,
 *    Ctrl/Cmd+U);
 *  - detecta o DevTools aberto por três sinais combinados: diferença de
 *    tamanho entre janela e viewport (funciona com painel ancorado),
 *    tempo de execução de um "debugger" (pausa quando o painel Sources
 *    está aberto, mesmo destacado em outra janela) e um truque de
 *    getter no console.log (dispara quando o painel Console está
 *    renderizando o valor). Quando qualquer um aciona, cobre a tela com
 *    um blur.
 *
 * Importante: nenhuma proteção client-side é 100% infalível — um usuário
 * decidido sempre consegue contornar isso. Isso apenas eleva bastante o
 * esforço necessário e barra a grande maioria das tentativas casuais.
 */
export default function AntiInspect() {
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    function blockContextMenu(e: MouseEvent) {
      e.preventDefault();
    }

    function blockShortcuts(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      const isDevtoolsCombo =
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) ||
        (e.metaKey && e.altKey && ["i", "j", "c"].includes(key)) ||
        (e.ctrlKey && key === "u") ||
        (e.metaKey && key === "u");

      if (isDevtoolsCombo) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    const GAP_THRESHOLD = 160;
    function sizeHeuristic() {
      const widthGap = window.outerWidth - window.innerWidth;
      const heightGap = window.outerHeight - window.innerHeight;
      return widthGap > GAP_THRESHOLD || heightGap > GAP_THRESHOLD;
    }

    // Se o painel "Sources" do DevTools estiver aberto, um "debugger"
    // pausa a execução até alguém retomar — o que faz esse trecho levar
    // muito mais que o normal pra rodar. Com o DevTools fechado, é
    // instantâneo.
    function timingHeuristic() {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      return performance.now() - start > 100;
    }

    // Getter só é acessado quando o painel "Console" está aberto e
    // efetivamente renderizando o valor logado.
    function consoleHeuristic(): Promise<boolean> {
      return new Promise((resolve) => {
        let triggered = false;
        const probe = {
          get id() {
            triggered = true;
            return "";
          },
        };
        // eslint-disable-next-line no-console
        console.log("%c", probe);
        setTimeout(() => resolve(triggered), 50);
      });
    }

    let cancelled = false;
    async function check() {
      if (sizeHeuristic() || timingHeuristic()) {
        if (!cancelled) setLocked(true);
        return;
      }
      const consoleOpen = await consoleHeuristic();
      if (!cancelled) setLocked(consoleOpen);
    }

    document.addEventListener("contextmenu", blockContextMenu);
    window.addEventListener("keydown", blockShortcuts, true);
    window.addEventListener("resize", check);
    const interval = setInterval(check, 1200);
    check();

    return () => {
      cancelled = true;
      document.removeEventListener("contextmenu", blockContextMenu);
      window.removeEventListener("keydown", blockShortcuts, true);
      window.removeEventListener("resize", check);
      clearInterval(interval);
    };
  }, []);

  if (!locked) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-ink-950/90 px-6 text-center backdrop-blur-2xl">
      <p className="max-w-sm text-sm text-white/70">
        Feche as ferramentas de desenvolvedor para continuar navegando.
      </p>
    </div>
  );
}
