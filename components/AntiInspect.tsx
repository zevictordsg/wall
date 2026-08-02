"use client";

import { useEffect, useState } from "react";

/**
 * Camada extra de dificultador contra tentativa de abrir o inspecionar
 * elemento pra baixar as artes "na força":
 *  - bloqueia o menu de contexto (clique direito) em toda a página, não só
 *    nas imagens — essa é a forma mais comum de chegar em "Inspecionar";
 *  - bloqueia os atalhos de teclado mais comuns (F12, Ctrl/Cmd+Shift+I/J/C,
 *    Ctrl/Cmd+U);
 *  - no desktop, detecta o DevTools aberto (diferença de tamanho entre
 *    janela e viewport + um truque de getter no console.log) e cobre a
 *    tela com um blur.
 *
 * Em celular a detecção de DevTools fica DESLIGADA: abrir o DevTools de
 * verdade num celular exige cabo USB + computador, então o risco é baixo
 * — e as heurísticas de timing tendem a disparar "falso positivo" com
 * qualquer engasgo normal do navegador (carregamento de imagem, animação,
 * garbage collector), o que bloquearia gente de verdade sem motivo. Já
 * aconteceu isso em produção, por isso a checagem de "debugger" (a mais
 * sensível a esse tipo de engasgo) foi removida por completo.
 *
 * Importante: nenhuma proteção client-side é 100% infalível — um usuário
 * decidido sempre consegue contornar isso. Isso apenas eleva o esforço
 * necessário e barra a grande maioria das tentativas casuais, sem
 * atrapalhar clientes de verdade.
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

    document.addEventListener("contextmenu", blockContextMenu);
    window.addEventListener("keydown", blockShortcuts, true);

    // Celular/tablet (ponteiro "grosso", sem hover): pula a detecção de
    // DevTools inteira, só fica o bloqueio de atalho/menu acima.
    const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isTouchDevice) {
      return () => {
        document.removeEventListener("contextmenu", blockContextMenu);
        window.removeEventListener("keydown", blockShortcuts, true);
      };
    }

    const GAP_THRESHOLD = 160;
    function sizeHeuristic() {
      const widthGap = window.outerWidth - window.innerWidth;
      const heightGap = window.outerHeight - window.innerHeight;
      return widthGap > GAP_THRESHOLD || heightGap > GAP_THRESHOLD;
    }

    // Getter só é acessado quando o painel "Console" está aberto e
    // efetivamente renderizando o valor logado (não depende de timing,
    // então não sofre com engasgo do navegador).
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

    // Só tranca depois de dois sinais positivos seguidos, pra não reagir a
    // um resize passageiro ou qualquer outra oscilação momentânea.
    let strikes = 0;
    let cancelled = false;
    async function check() {
      const suspicious = sizeHeuristic() || (await consoleHeuristic());
      if (cancelled) return;
      strikes = suspicious ? strikes + 1 : 0;
      setLocked(strikes >= 2);
    }

    window.addEventListener("resize", check);
    const interval = setInterval(check, 1500);
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
