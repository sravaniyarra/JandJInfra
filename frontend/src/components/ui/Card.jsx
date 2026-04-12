import clsx from "clsx";

export default function Card({ className, children }) {
  return (
    <div className={clsx("rounded-3xl border border-sky-100 bg-card p-5 shadow-soft", className)}>
      {children}
    </div>
  );
}
