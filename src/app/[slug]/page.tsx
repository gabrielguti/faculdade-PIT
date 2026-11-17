import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ContactButton } from "@/components/ContactButton";
import { ServiceList } from "@/components/ServiceList";
import { loadBusinesses } from "@/lib/businesses";
import { ClockIcon, PinIcon } from "@/components/Icons";
import { CATEGORY_THEMES } from "@/lib/category";
import { buildJsonLd } from "@/lib/jsonld";
import { businessUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export const generateStaticParams = () => loadBusinesses().map((b) => ({ slug: b.slug }));

const find = async (params: Props["params"]) => {
  const { slug } = await params;
  return loadBusinesses().find((b) => b.slug === slug);
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = await find(params);
  if (!b) return {};
  const title = `${b.name} - ${b.neighborhood}`;
  const description = b.description ?? `${b.name} em ${b.neighborhood}. Serviços, horários e contato direto pelo WhatsApp.`;
  return {
    title,
    description,
    alternates: { canonical: businessUrl(b.slug) },
    openGraph: {
      title,
      description,
      url: businessUrl(b.slug),
      type: "website",
      ...(b.photo ? { images: [b.photo] } : {}),
    },
  };
}

const card = "rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200";
const chip = "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800";

export default async function BusinessPage({ params }: Props) {
  const b = await find(params);
  if (!b) notFound();
  const theme = CATEGORY_THEMES[b.category];

  return (
    <main className="pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(b)).replace(/</g, "\\u003c") }} />

      {b.photo ? (
        <Image src={b.photo} alt={`Foto de ${b.name}`} width={640} height={320} priority className="h-48 w-full object-cover sm:h-64" />
      ) : (
        <div aria-hidden="true" className={`relative h-36 overflow-hidden bg-gradient-to-br sm:h-48 ${theme.gradient}`}>
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-10 w-full fill-[color:var(--sand)]">
            <path d="M0 30c150-40 300 40 450 0s300 40 450 0 225-20 300 0v30H0Z" />
          </svg>
        </div>
      )}

      <div className="relative mx-auto -mt-10 max-w-2xl space-y-4 px-4">
        <section className={card}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-sm font-bold ${theme.tint}`}>{b.category}</span>
            {b.delivery && <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-bold text-teal-900">Faz entregas</span>}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight">{b.name}</h1>
          {b.description && <p className="mt-2 text-lg text-slate-800">{b.description}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={chip}>
              <ClockIcon />
              {b.hours}
            </span>
            <span className={chip}>
              <PinIcon />
              {[b.neighborhood, b.address].filter(Boolean).join(" · ")}
            </span>
          </div>
        </section>

        <section className={card} aria-label="Ações">
          <ContactButton business={b} />
        </section>

        <section className={card} aria-labelledby="services">
          <h2 id="services" className="text-xl font-extrabold">Serviços e preços</h2>
          <div className="mt-2">
            <ServiceList services={b.services} />
          </div>
        </section>

        {b.payments?.length ? (
          <section className={card} aria-labelledby="payments">
            <h2 id="payments" className="text-xl font-extrabold">Formas de pagamento</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {b.payments.map((p) => (
                <li key={p} className={chip}>
                  {p}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}
