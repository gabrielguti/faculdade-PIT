import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { StoreIcon } from "@/components/Icons";
import { REGION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} - ${REGION}`, template: `%s | ${SITE_NAME}` },
  description: "Vitrine digital gratuita para os negócios do Ribeirão da Ilha, em Florianópolis (SC): serviços, horários, WhatsApp e QR Code.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#072f3a" };

const link = "inline-flex min-h-11 items-center whitespace-nowrap rounded-lg px-3 font-semibold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal-700";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-dvh flex-col antialiased">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur print:hidden">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-1.5" aria-label="Principal">
            <Link href="/" className={`${link} gap-2 text-lg font-extrabold text-[color:var(--sea-950)]`}>
              <span className="grid size-8 place-items-center rounded-lg bg-teal-700 text-white">
                <StoreIcon />
              </span>
              Vitrine Digital
            </Link>
            <Link href="/cadastro/" className={`${link} bg-teal-700 text-white hover:bg-teal-800`}>
              <span className="sm:hidden">Cadastrar</span>
              <span className="hidden sm:inline">Cadastrar negócio</span>
            </Link>
          </nav>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="mt-16 bg-[color:var(--sea-950)] text-slate-200 print:hidden">
          <div className="mx-auto max-w-5xl px-4 py-8 text-sm">
            <p className="font-semibold text-white">Vitrine Digital do Bairro · {REGION}</p>
            <p className="mt-1">Projeto de código aberto (MIT) alinhado ao ODS 8, meta 8.3: apoio a micro e pequenos negócios.</p>
            <p className="mt-1 text-slate-300">Projeto acadêmico: os negócios exibidos são fictícios e foram criados para demonstração.</p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
