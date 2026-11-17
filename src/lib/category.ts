import type { Business } from "./schema";

type Category = Business["category"];

export type CategoryTheme = { gradient: string; tint: string; dot: string };

export const CATEGORY_THEMES: Record<Category, CategoryTheme> = {
  "Alimentação": { gradient: "from-orange-600 to-amber-500", tint: "bg-orange-100 text-orange-900", dot: "bg-orange-600" },
  "Automotivo": { gradient: "from-slate-700 to-slate-500", tint: "bg-slate-200 text-slate-900", dot: "bg-slate-600" },
  "Beleza": { gradient: "from-pink-600 to-rose-500", tint: "bg-pink-100 text-pink-900", dot: "bg-pink-600" },
  "Casa e Construção": { gradient: "from-yellow-700 to-amber-600", tint: "bg-yellow-100 text-yellow-900", dot: "bg-yellow-700" },
  "Educação": { gradient: "from-indigo-700 to-blue-500", tint: "bg-indigo-100 text-indigo-900", dot: "bg-indigo-600" },
  "Eventos e Festas": { gradient: "from-fuchsia-700 to-purple-500", tint: "bg-fuchsia-100 text-fuchsia-900", dot: "bg-fuchsia-600" },
  "Moda": { gradient: "from-violet-700 to-purple-500", tint: "bg-violet-100 text-violet-900", dot: "bg-violet-600" },
  "Pet": { gradient: "from-lime-700 to-emerald-600", tint: "bg-lime-100 text-lime-900", dot: "bg-lime-700" },
  "Reparos e Manutenção": { gradient: "from-red-700 to-orange-600", tint: "bg-red-100 text-red-900", dot: "bg-red-600" },
  "Saúde": { gradient: "from-teal-700 to-cyan-600", tint: "bg-teal-100 text-teal-900", dot: "bg-teal-600" },
  "Serviços": { gradient: "from-sky-700 to-cyan-600", tint: "bg-sky-100 text-sky-900", dot: "bg-sky-600" },
  "Varejo": { gradient: "from-emerald-700 to-green-600", tint: "bg-emerald-100 text-emerald-900", dot: "bg-emerald-600" },
};

export type CategoryAction = { label: string; message: (name: string) => string };

const order: CategoryAction = { label: "Fazer pedido no WhatsApp", message: (name) => `Olá, ${name}! Quero fazer um pedido.` };
const purchase: CategoryAction = { label: "Finalizar compra no WhatsApp", message: (name) => `Olá, ${name}! Quero finalizar uma compra.` };
const quote: CategoryAction = { label: "Pedir orçamento no WhatsApp", message: (name) => `Olá, ${name}! Gostaria de pedir um orçamento.` };
const booking: CategoryAction = { label: "Agendar horário no WhatsApp", message: (name) => `Olá, ${name}! Gostaria de agendar um horário.` };
const lesson: CategoryAction = { label: "Agendar aula no WhatsApp", message: (name) => `Olá, ${name}! Gostaria de agendar uma aula.` };
const petCare: CategoryAction = { label: "Agendar ou pedir no WhatsApp", message: (name) => `Olá, ${name}! Gostaria de agendar um serviço ou fazer um pedido.` };

export const CATEGORY_ACTIONS: Record<Category, CategoryAction> = {
  "Alimentação": order,
  "Automotivo": quote,
  "Beleza": booking,
  "Casa e Construção": quote,
  "Educação": lesson,
  "Eventos e Festas": quote,
  "Moda": order,
  "Pet": petCare,
  "Reparos e Manutenção": quote,
  "Saúde": booking,
  "Serviços": quote,
  "Varejo": purchase,
};
