export default function MultiSelectChips({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2" role="group">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            aria-pressed={isSelected}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 focus-visible:outline-offset-2 ${
              isSelected
                ? 'border-amber-500 bg-amber-500 text-zinc-950'
                : 'border-zinc-700 bg-zinc-800/60 text-zinc-200 hover:border-zinc-500'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
