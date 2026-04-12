export default function Skeleton({ className = "h-20 w-full" }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-elevated dark:bg-elevated/60 ${className}`}>
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-surface/50 to-transparent dark:via-white/[0.07]" />
    </div>
  );
}
