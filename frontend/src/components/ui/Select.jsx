import clsx from "clsx";

export default function Select({ label, children, className, ...props }) {
  return (
    <label className="block space-y-1.5">
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wider text-subtle">{label}</span>
      )}
      <select
        className={clsx(
          "w-full rounded-xl border border-line bg-elevated/80 px-3.5 py-3 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20 dark:bg-elevated/50",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
