import Link from "next/link";
import { BusinessSearch } from "@/components/BusinessSearch";
import { CheckIcon, PinIcon } from "@/components/Icons";
import { loadBusinesses } from "@/lib/businesses";
import { qrSvg } from "@/lib/qr";
import { toSummary } from "@/lib/search";
import { businessUrl, REGION } from "@/lib/site";

const steps = [
  { title: "Cadastre", text: "O dono preenche um formulário curto, em poucos minutos, e gera o arquivo do negócio." },
  { title: "Publique", text: "O arquivo é publicado e a página do negócio entra no ar, sem custo." },
  { title: "Divulgue", text: "O dono imprime o QR Code e cola na porta, no balcão ou na embalagem." },
];

const qrReasons = [
  "O cliente aponta a câmera do celular e chega direto à página, sem digitar endereço.",
  "Funciona onde já existe movimento: vitrine, balcão, sacola, cartão de visita e ponto de ônibus.",
  "Quem passa em frente com a loja fechada vê horário e serviços e já chama no WhatsApp.",
  "O QR Code não muda: se preço ou horário mudarem, a página é atualizada e o cartaz impresso continua valendo.",
];

const button = "inline-flex min-h-12 items-center justify-center rounded-xl px-6 text-base font-bold focus-visible:outline-3 focus-visible:outline-offset-2";

export default async function HomePage() {
  const businesses = loadBusinesses();
  const items = businesses.map(toSummary);
  const sample = businesses[0];
  const sampleQr = sample ? await qrSvg(businessUrl(sample.slug)) : null;

  return (
    <main>
      <section className="bg-[color:var(--sea-950)] text-white">
        <div className="mx-auto max-w-5xl px-4 pb-14 pt-12 sm:pt-16">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">
            <PinIcon />
            {REGION}
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl">
            O seu negócio do bairro, a um QR Code de distância.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-200">
            Uma vitrine digital gratuita para os negócios do Ribeirão da Ilha: serviços, preços, horários, formas de pagamento e WhatsApp em uma
            página que o cliente abre com a câmera do celular.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#negocios" className={`${button} bg-white text-[color:var(--sea-950)] hover:bg-slate-100 focus-visible:outline-white`}>
              Ver negócios
            </a>
            <Link href="/cadastro/" className={`${button} border-2 border-white text-white hover:bg-white/10 focus-visible:outline-white`}>
              Cadastrar meu negócio
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-5xl px-4" aria-labelledby="about">
        <h2 id="about" className="text-2xl font-extrabold">O que é a plataforma</h2>
        <p className="mt-3 max-w-3xl text-lg text-slate-800">
          A Vitrine Digital do Bairro é uma plataforma gratuita e de código aberto que dá a cada pequeno negócio do Ribeirão da
          Ilha uma página própria na internet, com serviços, preços, horário, localização e WhatsApp, e permite pedir, agendar ou pedir orçamento pela conversa. Não há site para pagar,
          aplicativo para instalar nem conhecimento técnico necessário.
        </p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-teal-700 font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-slate-700">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <div id="negocios" className="mx-auto mt-16 max-w-5xl scroll-mt-20 px-4">
        <BusinessSearch items={items} />
      </div>

      <section className="mx-auto mt-16 max-w-5xl px-4" aria-labelledby="why-qr">
        <div className="grid gap-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 id="why-qr" className="text-2xl font-extrabold">Por que usar o QR Code</h2>
            <ul className="mt-4 space-y-3">
              {qrReasons.map((r) => (
                <li key={r} className="flex gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-teal-700 text-white">
                    <CheckIcon className="size-4" />
                  </span>
                  {r}
                </li>
              ))}
            </ul>
            <Link href="/cadastro/" className={`${button} mt-8 bg-teal-700 text-white hover:bg-teal-800 focus-visible:outline-teal-900`}>
              Cadastre seu negócio
            </Link>
          </div>
          {sample && sampleQr && (
            <figure className="mx-auto w-52 text-center">
              <div role="img" aria-label={`QR Code de exemplo para ${sample.name}`} className="rounded-2xl border-4 border-[color:var(--sea-950)] bg-white p-2" dangerouslySetInnerHTML={{ __html: sampleQr }} />
              <figcaption className="mt-3 text-sm text-slate-700">QR Code de exemplo: {sample.name}</figcaption>
            </figure>
          )}
        </div>
      </section>
    </main>
  );
}
