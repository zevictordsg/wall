import Link from "next/link";
import { Reveal } from "./ui";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-8">
      <Reveal className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-white/40 sm:flex-row">
        <p>© {new Date().getFullYear()} AuraPapers. Todos os direitos reservados.</p>
        <div className="flex gap-6">
          <Link href="/privacidade" className="hover:text-white/70">
            Privacidade
          </Link>
          <Link href="/termos" className="hover:text-white/70">
            Termos
          </Link>
        </div>
      </Reveal>
    </footer>
  );
}
