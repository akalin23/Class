export default function OptionCard({ label, description, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full text-left rounded-xl border px-4 py-3.5 transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 focus-visible:outline-offset-2 ${
        selected
          ? 'border-amber-500 bg-amber-500/10 text-white'
          : 'border-zinc-700 bg-zinc-800/60 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-medium">{label}</div>
          {description && <div className="text-sm text-zinc-400 mt-0.5">{description}</div>}
        </div>
        <div
          className={`shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
            selected ? 'border-amber-500 bg-amber-500' : 'border-zinc-600'
          }`}
        >
          {selected && (
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-zinc-950">
              <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0L3.3 9.5a1 1 0 111.4-1.4l3.9 3.9 6.7-6.7a1 1 0 011.4 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
