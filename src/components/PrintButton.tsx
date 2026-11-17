"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="min-h-12 rounded-xl bg-teal-700 px-6 text-base font-bold text-white hover:bg-teal-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal-900 print:hidden"
    >
      Imprimir cartaz (A6)
    </button>
  );
}
