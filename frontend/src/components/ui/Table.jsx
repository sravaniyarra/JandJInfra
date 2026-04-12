export function Table({ children }) {
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">{children}</div>;
}

export function THead({ children }) {
  return <thead className="bg-slate-50">{children}</thead>;
}

export function TH({ children }) {
  return <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{children}</th>;
}

export function TD({ children }) {
  return <td className="px-4 py-3 text-sm text-slate-700">{children}</td>;
}
