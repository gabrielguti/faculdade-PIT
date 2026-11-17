import type { Metadata } from "next";
import { RegistrationForm } from "@/components/RegistrationForm";

export const metadata: Metadata = {
  title: "Cadastre seu negócio",
  description: "Preencha o formulário para gerar o cadastro da sua vitrine digital.",
};

export default function RegistrationPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Cadastre seu negócio</h1>
      <p className="mt-2 text-lg text-slate-800">Preencha o essencial. Leva poucos minutos.</p>
      <details className="mb-6 mt-4 rounded-xl bg-teal-50 p-4 text-teal-950 ring-1 ring-teal-200">
        <summary className="min-h-11 cursor-pointer font-semibold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
          Por que o cadastro gera um arquivo para baixar?
        </summary>
        <p className="mt-2">
          Esta plataforma não tem servidor nem banco de dados, e é por isso que ela é gratuita. O formulário monta o cadastro do
          seu negócio em um arquivo (.json) e não envia nada sozinho. Ao final, você toca em um botão para mandar o cadastro ao
          administrador pelo WhatsApp. Ele confere, publica o site e então a sua página e o QR Code ficam no ar. O cadastro também
          guarda a sua autorização de publicação (LGPD).
        </p>
      </details>
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <RegistrationForm />
      </div>
    </main>
  );
}
