import clsx from "clsx";

export default function Input({ label, className, ...props }) {
  return (
    <label className="block space-y-1.5">
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wider text-subtle">{label}</span>
      )}
      <input
        className={clsx(
          "w-full rounded-xl border border-line bg-elevated/80 px-3.5 py-3 text-sm text-ink shadow-inner outline-none transition placeholder:text-subtle focus:border-accent/50 focus:ring-2 focus:ring-accent/20 dark:bg-elevated/50",
          className
        )}
        {...props}
      />
    </label>
  );
}
