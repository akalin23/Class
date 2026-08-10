import { explainCar } from '../quiz/scoring.js';

function formatPrice(car, condition) {
  if (condition === 'used') return `~$${car.priceUsedTypical.toLocaleString()} used`;
  if (condition === 'new' && car.priceNewMin) {
    return car.priceNewMax && car.priceNewMax !== car.priceNewMin
      ? `$${car.priceNewMin.toLocaleString()}–$${car.priceNewMax.toLocaleString()} new`
      : `$${car.priceNewMin.toLocaleString()} new`;
  }
  if (car.priceNewMin) return `$${car.priceNewMin.toLocaleString()} new · ~$${car.priceUsedTypical.toLocaleString()} used`;
  return `~$${car.priceUsedTypical.toLocaleString()} used`;
}

export default function CarCard({ result, answers, rank, onToggleCompare, isComparing, compareDisabled }) {
  const { car, matchScore } = result;
  const { reasons, tradeoffs } = explainCar(car, answers);

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-800/50 overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-zinc-500 font-semibold mb-1">Rank #{rank}</div>
            <h3 className="text-xl font-bold text-white">
              {car.make} {car.model}
            </h3>
            <div className="text-zinc-400 text-sm">{car.trim}</div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-3xl font-bold text-amber-400 leading-none">{matchScore}%</div>
            <div className="text-xs text-zinc-500 mt-1">match</div>
          </div>
        </div>

        <p className="text-zinc-300 text-sm mb-4">{car.blurb}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-400 mb-4">
          <span>{formatPrice(car, answers.budget.condition)}</span>
          <span>{car.horsepower} hp</span>
          <span>{car.zeroToSixtySec}s 0–60</span>
          <span>{car.mpgCombined} {car.fuelType === 'ev' ? 'MPGe' : 'mpg'}</span>
          <span>{car.drivetrain}</span>
        </div>

        {reasons.length > 0 && (
          <div className="mb-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-500 mb-1.5">Why this matched you</div>
            <ul className="text-sm text-zinc-300 space-y-1">
              {reasons.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-emerald-500 shrink-0">✓</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tradeoffs.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-amber-500 mb-1.5">Heads-up / trade-offs</div>
            <ul className="text-sm text-zinc-400 space-y-1">
              {tradeoffs.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-amber-500 shrink-0">!</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={isComparing}
            disabled={compareDisabled && !isComparing}
            onChange={() => onToggleCompare(car.id)}
            className="h-4 w-4 accent-amber-500"
          />
          Add to compare
        </label>
      </div>
    </div>
  );
}
