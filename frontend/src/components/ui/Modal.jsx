export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#031121]/50 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-lg rounded-3xl border border-sky-100 bg-[#f7fcff] p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between border-b border-sky-100 pb-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-800">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
