export function Table({ children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft dark:bg-surface/90">{children}</div>
  );
}

export function THead({ children }) {
  return <thead className="bg-elevated/80 dark:bg-elevated/40">{children}</thead>;
}

export function TH({ children }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-subtle">{children}</th>
  );
}

export function TD({ children }) {
  return <td className="px-4 py-3 text-sm text-ink">{children}</td>;
}
