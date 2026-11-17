import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/PrintButton";
import { loadBusinesses } from "@/lib/businesses";
import { qrSvg } from "@/lib/qr";
import { businessUrl, REGION } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export const generateStaticParams = () => loadBusinesses().map((b) => ({ slug: b.slug }));

export const metadata: Metadata = { title: "QR Code para impressão", robots: { index: false } };

export default async function QrPage({ params }: Props) {
  const { slug } = await params;
  const b = loadBusinesses().find((x) => x.slug === slug);
  if (!b) notFound();
  const url = businessUrl(b.slug);
  const svg = await qrSvg(url);

  return (
    <main className="mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-10 print:m-0 print:h-[148mm] print:w-[105mm] print:max-w-none print:justify-center print:gap-4 print:p-[8mm]">
      <div className="flex w-full flex-col items-center gap-4 rounded-3xl border-4 border-[color:var(--sea-950)] bg-white p-6 text-center shadow-lg print:border-2 print:shadow-none">
        <p className="text-sm font-bold uppercase tracking-widest text-teal-800">{REGION}</p>
        <h1 className="text-3xl font-extrabold leading-tight">{b.name}</h1>
        <p className="text-lg font-semibold">Aponte a câmera e veja nossa vitrine</p>
        <div role="img" aria-label={`QR Code para ${url}`} data-testid="qr-code" className="aspect-square w-full max-w-72 print:max-w-[70mm]" dangerouslySetInnerHTML={{ __html: svg }} />
        <p className="break-all font-mono text-sm text-slate-700">{url}</p>
      </div>
      <PrintButton />
    </main>
  );
}
