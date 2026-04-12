export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/55 p-4 backdrop-blur-md dark:bg-ink/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div className="max-h-[min(90vh,720px)] w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-surface shadow-lift dark:shadow-glow">
        <div className="flex items-center justify-between border-b border-line bg-elevated/40 px-6 py-4 dark:bg-elevated/30">
          <h2 id="modal-title" className="font-display text-lg font-semibold tracking-tight text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm font-medium text-subtle transition hover:bg-accent-muted hover:text-ink"
          >
            Close
          </button>
        </div>
        <div className="max-h-[calc(min(90vh,720px)-4.5rem)] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
