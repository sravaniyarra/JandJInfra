import { FolderOpen } from "lucide-react";

export default function EmptyState({ title, message }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-elevated/50 p-10 text-center dark:bg-elevated/30">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-surface shadow-soft">
        <FolderOpen className="h-7 w-7 text-subtle" />
      </div>
      <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-subtle">{message}</p>
    </div>
  );
}
