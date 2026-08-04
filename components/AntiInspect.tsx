"use client";

import { useEffect } from "react";

/**
 * Dificultador contra tentativa de abrir o inspecionar elemento pra baixar
 * as artes "na força":
 *  - bloqueia o menu de contexto (clique direito) em toda a página, não só
 *    nas imagens — essa é a forma mais comum de chegar em "Inspecionar";
 *  - bloqueia os atalhos de teclado mais comuns (F12, Ctrl/Cmd+Shift+I/J/C,
 *    Ctrl/Cmd+U).
 *
 * Não tenta mais "detectar" o DevTools aberto e travar a tela com um
 * overlay: tentamos isso antes (diferença de tamanho de janela + timing de
 * "debugger" + truque de console), mas deu falso positivo tanto no mobile
 * quanto — pelo relato de um cliente real — no desktop, deixando a página
 * inteira travada e nenhum botão clicável. Como isso custa vendas de
 * verdade, preferimos uma proteção mais simples e 100% confiável (sem
 * heurística, sem chance de bloquear gente de verdade) a uma mais "forte"
 * só na teoria.
 *
 * Importante: nenhuma proteção client-side é 100% infalível — um usuário
 * decidido sempre consegue contornar isso. Isso apenas eleva o esforço
 * necessário e barra a grande maioria das tentativas casuais.
 */
export default function AntiInspect() {
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

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      window.removeEventListener("keydown", blockShortcuts, true);
    };
  }, []);

  return null;
}
