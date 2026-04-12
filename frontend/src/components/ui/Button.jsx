import clsx from "clsx";

const styles = {
  primary: "bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white hover:brightness-95",
  ghost: "bg-white text-slate-700 hover:bg-sky-50 border border-sky-100"
};

export default function Button({ variant = "primary", className, ...props }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ink/20 disabled:cursor-not-allowed disabled:opacity-50",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
