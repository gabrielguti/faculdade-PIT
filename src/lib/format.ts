import { CATEGORY_ACTIONS } from "./category";
import type { Business } from "./schema";

export const formatPrice = (value: number): string =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

type Contact = Pick<Business, "whatsapp" | "name" | "category">;

const chatLink = (number: string, text: string): string => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

export const contactLink = (business: Contact): string =>
  chatLink(business.whatsapp, CATEGORY_ACTIONS[business.category].message(business.name));

export const slugify = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export const normalize = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  const area = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (!rest) return `(${area}`;
  if (rest.length <= 4) return `(${area}) ${rest}`;
  const split = digits.length > 10 ? 5 : 4;
  return `(${area}) ${rest.slice(0, split)}-${rest.slice(split)}`;
};

export const normalizeWhatsapp = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11 ? `55${digits}` : digits;
};

export const WEEK_DAYS = [
  { value: 1, label: "Seg" },
  { value: 2, label: "Ter" },
  { value: 3, label: "Qua" },
  { value: 4, label: "Qui" },
  { value: 5, label: "Sex" },
  { value: 6, label: "Sáb" },
  { value: 0, label: "Dom" },
] as const;

export const formatTime = (time: string): string => {
  const [hours = "0", minutes = "00"] = time.split(":");
  return minutes === "00" ? `${Number(hours)}h` : `${Number(hours)}h${minutes}`;
};

export const formatDays = (days: number[]): string => {
  const positions = WEEK_DAYS.flatMap((d, index) => (days.includes(d.value) ? [index] : []));
  if (positions.length === WEEK_DAYS.length) return "Todos os dias";
  const runs: number[][] = [];
  for (const position of positions) {
    const last = runs[runs.length - 1];
    if (last && position === last[last.length - 1]! + 1) last.push(position);
    else runs.push([position]);
  }
  return runs
    .map((run) =>
      run.length >= 3
        ? `${WEEK_DAYS[run[0]!]!.label} a ${WEEK_DAYS[run[run.length - 1]!]!.label}`
        : run.map((p) => WEEK_DAYS[p]!.label).join(", "),
    )
    .join(", ");
};

export const formatHours = (days: number[], open: string, close: string): string =>
  `${formatDays(days)}, ${formatTime(open)} às ${formatTime(close)}`;
