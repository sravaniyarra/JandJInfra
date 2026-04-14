import clsx from "clsx";

export default function BrandLogo({ compact = false, variant = "default" }) {
  const isSidebar = variant === "sidebar";
  const logoSrc = `${import.meta.env.BASE_URL}brand-logo.jpg`;

  return (
    <div className="flex items-center gap-3">
      <div
        className={clsx(
          "relative overflow-hidden rounded-xl border shadow-soft",
          isSidebar ? "h-11 w-11 border-white/15 bg-white/10" : "h-10 w-10 border-line bg-surface"
        )}
      >
        <img src={logoSrc} alt="J&J Infra logo" className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent" />
      </div>
      {!compact ? (
        <div>
          <p
            className={clsx(
              "font-display text-xl font-bold leading-none tracking-tight",
              isSidebar ? "text-on-sidebar" : "text-gradient-accent"
            )}
          >
            J&amp;J INFRA
          </p>
          <p
            className={clsx(
              "mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]",
              isSidebar ? "text-on-sidebar-muted" : "text-subtle"
            )}
          >
            We Design Your Home
          </p>
        </div>
      ) : null}
    </div>
  );
}
