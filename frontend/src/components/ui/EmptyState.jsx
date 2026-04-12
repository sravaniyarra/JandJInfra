import { FolderOpen } from "lucide-react";

export default function EmptyState({ title, message }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <FolderOpen className="mx-auto mb-3 h-8 w-8 text-slate-400" />
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
  );
}
