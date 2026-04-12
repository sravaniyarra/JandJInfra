export default function Select({ label, children, ...props }) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>}
      <select
        className="w-full rounded-2xl border border-sky-100 bg-[#f8fdff] px-3.5 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
