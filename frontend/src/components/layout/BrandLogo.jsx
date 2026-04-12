export default function BrandLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-sky-100 bg-white">
        <img src="/brand-logo.jpg" alt="J&J Infra logo" className="h-full w-full object-cover" />
      </div>
      {!compact ? (
        <div>
          <p className="text-xl font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-500">
            J&J INFRA
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            We Design Your Home
          </p>
        </div>
      ) : null}
    </div>
  );
}
