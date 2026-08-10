const CONDITIONS = [
  { value: 'either', label: 'Either' },
  { value: 'new', label: 'New only' },
  { value: 'used', label: 'Used only' },
];

export default function BudgetSlider({ value, onChange, min, max, step }) {
  return (
    <div>
      <div className="text-center mb-6">
        <span className="text-3xl font-bold text-white">${value.max.toLocaleString()}</span>
        <span className="text-zinc-400"> max</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value.max}
        onChange={(e) => onChange({ ...value, max: Number(e.target.value) })}
        aria-label={`Maximum budget, currently $${value.max.toLocaleString()}`}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-zinc-400 mt-2 mb-6">
        <span>${min.toLocaleString()}</span>
        <span>${max.toLocaleString()}+</span>
      </div>
      <div className="flex justify-center gap-2" role="group" aria-label="New or used">
        {CONDITIONS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onChange({ ...value, condition: c.value })}
            aria-pressed={value.condition === c.value}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 focus-visible:outline-offset-2 ${
              value.condition === c.value
                ? 'border-amber-500 bg-amber-500 text-zinc-950'
                : 'border-zinc-700 bg-zinc-800/60 text-zinc-200 hover:border-zinc-500'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
