import clsx from "clsx";

const styles = {
  primary: "bg-accent text-accent-fg shadow-soft hover:brightness-110 active:scale-[0.98]",
  ghost:
    "border border-line bg-surface text-ink hover:bg-elevated hover:border-accent/25 dark:bg-surface/80",
  outline: "border-2 border-accent/40 bg-transparent text-accent hover:bg-accent-muted"
};

export default function Button({ variant = "primary", className, ...props }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-45",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
