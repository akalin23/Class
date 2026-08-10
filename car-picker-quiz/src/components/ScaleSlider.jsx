import { SCALE_LABELS } from '../quiz/questions.js';

export default function ScaleSlider({ value, onChange, lowLabel, highLabel }) {
  return (
    <div>
      <input
        type="range"
        min={0}
        max={4}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`Scale from ${lowLabel} to ${highLabel}, currently ${SCALE_LABELS[value]}`}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-zinc-400 mt-3">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
      <div className="text-center mt-4 text-lg font-semibold text-amber-400">{SCALE_LABELS[value]}</div>
    </div>
  );
}
