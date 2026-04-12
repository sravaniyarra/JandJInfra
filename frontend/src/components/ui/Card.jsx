import clsx from "clsx";

export default function Card({ className, children }) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-line bg-surface/90 p-5 shadow-soft backdrop-blur-sm dark:bg-surface/95",
        className
      )}
    >
      {children}
    </div>
  );
}
