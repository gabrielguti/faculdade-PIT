"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { formatHours, formatPhone, normalizeWhatsapp, slugify, WEEK_DAYS } from "@/lib/format";
import { businessSchema, CATEGORIES, PAYMENT_METHODS } from "@/lib/schema";
import { ADMIN_WHATSAPP, REGION_NEIGHBORHOOD } from "@/lib/site";
import { submissionLink } from "@/lib/submission";

type ServiceRow = { id: number; name: string; price: string; description: string };

const FIELD_LABELS: Record<string, string> = {
  name: "Nome do negócio",
  category: "Categoria",
  whatsapp: "WhatsApp",
  services: "Serviços",
  hours: "Horário",
  neighborhood: "Bairro",
  description: "Descrição",
  address: "Endereço",
  photo: "URL da foto",
  payments: "Formas de pagamento",
  publicationConsent: "Autorização",
};

const field = "mt-1 min-h-12 w-full rounded-xl border border-slate-400 bg-white px-4 text-base focus-visible:outline-3 focus-visible:outline-teal-700";
const label = "block text-base font-semibold";
const focusRing = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal-700";

const optional = (value: string): string | undefined => (value.trim() ? value.trim() : undefined);

function Label({ htmlFor, required, children }: { htmlFor?: string; required?: boolean; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className={label}>
      {children}
      {required && (
        <span aria-hidden="true" className="text-red-700">
          {" "}
          *
        </span>
      )}
    </label>
  );
}

export function RegistrationForm() {
  const nextId = useRef(1);
  const [phone, setPhone] = useState("");
  const [rows, setRows] = useState<ServiceRow[]>([{ id: 0, name: "", price: "", description: "" }]);
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [open, setOpen] = useState("09:00");
  const [close, setClose] = useState("18:00");
  const [errors, setErrors] = useState<string[]>([]);
  const [sent, setSent] = useState<{ fileName: string; href: string | null } | null>(null);

  const hoursValid = days.length > 0 && Boolean(open) && Boolean(close) && open < close;
  const hoursPreview = hoursValid ? formatHours(days, open, close) : "preencha os dias e os horários";

  const updateRow = (id: number, patch: Partial<ServiceRow>) =>
    setRows((current) => current.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const addRow = () => setRows((current) => [...current, { id: nextId.current++, name: "", price: "", description: "" }]);
  const removeRow = (id: number) => setRows((current) => current.filter((r) => r.id !== id));
  const toggleDay = (day: number) => setDays((current) => (current.includes(day) ? current.filter((d) => d !== day) : [...current, day]));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "");
    const problems: string[] = [];

    const services = rows
      .filter((r) => r.name.trim() || r.price.trim() || r.description.trim())
      .map((r) => {
        const price = r.price.trim() ? Number(r.price.replace(",", ".")) : undefined;
        const validPrice = price !== undefined && Number.isFinite(price);
        if (price !== undefined && !validPrice) problems.push(`Serviços: preço inválido em "${r.name || "serviço sem nome"}"`);
        return { name: r.name, ...(validPrice ? { price } : {}), ...(r.description.trim() ? { description: r.description.trim() } : {}) };
      });

    if (!hoursValid) problems.push("Horário: escolha ao menos um dia e use um horário de abertura anterior ao de fechamento");

    const name = get("name");
    const result = businessSchema.safeParse({
      slug: slugify(name),
      name,
      category: get("category"),
      description: optional(get("description")),
      services,
      hours: hoursValid ? formatHours(days, open, close) : "",
      neighborhood: get("neighborhood"),
      address: optional(get("address")),
      photo: optional(get("photo")),
      whatsapp: normalizeWhatsapp(phone),
      payments: data.getAll("payments").map(String),
      delivery: data.get("delivery") === "on" ? true : undefined,
      publicationConsent: data.get("consent") === "on",
    });

    if (!result.success) {
      for (const issue of result.error.issues) {
        if (!hoursValid && issue.path[0] === "hours") continue;
        problems.push(`${FIELD_LABELS[String(issue.path[0])] ?? "Formulário"}: ${issue.message}`);
      }
    }

    if (problems.length > 0 || !result.success) {
      setSent(null);
      setErrors(problems);
      return;
    }

    setErrors([]);
    const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${result.data.slug}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setSent({ fileName: link.download, href: ADMIN_WHATSAPP ? submissionLink(result.data, ADMIN_WHATSAPP) : null });
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <p className="text-sm text-slate-700">
        Campos com <span className="font-bold text-red-700">*</span> são obrigatórios.
      </p>

      <div>
        <Label htmlFor="name" required>Nome do negócio</Label>
        <input id="name" name="name" aria-required="true" autoComplete="organization" className={field} />
      </div>

      <div>
        <Label htmlFor="category" required>Categoria</Label>
        <select id="category" name="category" aria-required="true" className={field}>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="whatsapp" required>WhatsApp</Label>
        <input
          id="whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          aria-required="true"
          aria-describedby="whatsapp-help"
          maxLength={15}
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          placeholder="(48) 99999-0000"
          className={field}
        />
        <p id="whatsapp-help" className="mt-1 text-sm text-slate-700">Número que receberá as mensagens dos clientes.</p>
      </div>

      <fieldset className="space-y-3">
        <legend className={label}>
          Serviços ou produtos <span aria-hidden="true" className="text-red-700">*</span>
        </legend>
        <p className="text-sm text-slate-700">Preço e observação são opcionais. Sem preço, a página mostra &ldquo;Sob consulta&rdquo;.</p>
        {rows.map((r, i) => (
          <div key={r.id} className="space-y-3 rounded-xl border border-slate-300 bg-slate-50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">Item {i + 1}</span>
              {rows.length > 1 && (
                <button type="button" onClick={() => removeRow(r.id)} className={`min-h-11 rounded-lg px-2 text-sm font-semibold text-red-800 underline ${focusRing}`}>
                  Remover
                </button>
              )}
            </div>
            <div>
              <label htmlFor={`service-name-${r.id}`} className="block text-sm font-semibold">Nome do serviço</label>
              <input id={`service-name-${r.id}`} value={r.name} onChange={(e) => updateRow(r.id, { name: e.target.value })} placeholder="Corte de cabelo" className={field} />
            </div>
            <div className="grid gap-3 sm:grid-cols-[9rem_1fr]">
              <div>
                <label htmlFor={`service-price-${r.id}`} className="block text-sm font-semibold">Preço (R$)</label>
                <input
                  id={`service-price-${r.id}`}
                  inputMode="decimal"
                  value={r.price}
                  onChange={(e) => updateRow(r.id, { price: e.target.value.replace(/[^\d,]/g, "") })}
                  placeholder="50,00"
                  className={field}
                />
              </div>
              <div>
                <label htmlFor={`service-note-${r.id}`} className="block text-sm font-semibold">Observação</label>
                <input id={`service-note-${r.id}`} value={r.description} onChange={(e) => updateRow(r.id, { description: e.target.value })} placeholder="Ex.: inclui lavagem" className={field} />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={addRow} className={`min-h-11 w-full rounded-xl border-2 border-dashed border-teal-700 px-4 font-semibold text-teal-900 hover:bg-teal-50 ${focusRing}`}>
          Adicionar outro item
        </button>
      </fieldset>

      <fieldset>
        <legend className={label}>
          Dias de atendimento <span aria-hidden="true" className="text-red-700">*</span>
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {WEEK_DAYS.map((d) => (
            <label key={d.value} className="relative">
              <input type="checkbox" className="peer sr-only" checked={days.includes(d.value)} onChange={() => toggleDay(d.value)} />
              <span className="grid min-h-11 min-w-14 cursor-pointer place-items-center rounded-xl border-2 border-slate-300 bg-white px-3 font-semibold peer-checked:border-teal-700 peer-checked:bg-teal-700 peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-teal-700">
                {d.label}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="open" required>Abre às</Label>
            <input id="open" type="time" value={open} onChange={(e) => setOpen(e.target.value)} className={field} />
          </div>
          <div>
            <Label htmlFor="close" required>Fecha às</Label>
            <input id="close" type="time" value={close} onChange={(e) => setClose(e.target.value)} className={field} />
          </div>
        </div>
        <p aria-live="polite" className="mt-3 text-sm text-slate-700">
          Aparecerá na página como: <strong className="text-slate-900">{hoursPreview}</strong>
        </p>
      </fieldset>

      <div>
        <Label htmlFor="neighborhood" required>Bairro</Label>
        <input id="neighborhood" name="neighborhood" aria-required="true" defaultValue={REGION_NEIGHBORHOOD} className={field} />
      </div>

      <details className="rounded-xl border border-slate-300 bg-white p-4">
        <summary className={`min-h-11 cursor-pointer text-base font-semibold ${focusRing}`}>Mais opções (opcional)</summary>
        <div className="mt-4 space-y-5">
          <div>
            <Label htmlFor="description">Descrição curta</Label>
            <textarea id="description" name="description" rows={2} className={field} />
          </div>
          <div>
            <Label htmlFor="address">Endereço</Label>
            <input id="address" name="address" autoComplete="street-address" className={field} />
          </div>
          <div>
            <Label htmlFor="photo">URL da foto</Label>
            <input id="photo" name="photo" className={field} />
          </div>
          <fieldset>
            <legend className={label}>Formas de pagamento aceitas</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {PAYMENT_METHODS.map((method) => (
                <label key={method} className="flex min-h-11 items-center gap-3 text-base">
                  <input type="checkbox" name="payments" value={method} className="size-6 accent-teal-700" />
                  {method}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="flex min-h-11 items-center gap-3 text-base">
            <input type="checkbox" name="delivery" className="size-6 accent-teal-700" />
            Faço entregas
          </label>
        </div>
      </details>

      <div className="flex items-start gap-3">
        <input id="consent" name="consent" type="checkbox" aria-required="true" className="mt-1 size-6 accent-teal-700" />
        <label htmlFor="consent" className="text-base">
          Autorizo a publicação pública destas informações na internet (LGPD).{" "}
          <span aria-hidden="true" className="text-red-700">*</span>
        </label>
      </div>

      {errors.length > 0 && (
        <div role="alert" data-testid="form-errors" className="rounded-xl bg-red-50 p-4 text-red-900 ring-1 ring-red-300">
          <p className="font-bold">Revise os campos abaixo:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        className={`min-h-12 w-full rounded-xl bg-teal-700 px-6 text-base font-bold text-white hover:bg-teal-800 ${focusRing}`}
      >
        Gerar cadastro do negócio
      </button>

      {sent && (
        <div role="status" data-testid="form-success" className="space-y-3 rounded-xl bg-teal-50 p-4 text-teal-950 ring-1 ring-teal-300">
          <p className="font-bold">Cadastro gerado: {sent.fileName}</p>
          {sent.href ? (
            <>
              <p>Falta só um passo: envie o cadastro para o administrador, que confere e publica a sua página.</p>
              <a
                href={sent.href}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="send-whatsapp"
                className={`flex min-h-12 items-center justify-center rounded-xl bg-emerald-700 px-6 text-center text-base font-bold text-white hover:bg-emerald-800 ${focusRing}`}
              >
                Enviar para o administrador pelo WhatsApp
              </a>
              <p className="text-sm">O arquivo também foi salvo no seu aparelho, caso queira guardar uma cópia.</p>
            </>
          ) : (
            <p>
              Envie o arquivo baixado para quem administra a vitrine, que o adiciona em <code>content/businesses/</code> e publica o site.
            </p>
          )}
        </div>
      )}
    </form>
  );
}
