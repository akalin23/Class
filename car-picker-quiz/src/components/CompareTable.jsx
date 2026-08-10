const ROWS = [
  { label: 'Match score', get: (r) => `${r.matchScore}%` },
  { label: 'Price (new)', get: (r) => (r.car.priceNewMin ? `$${r.car.priceNewMin.toLocaleString()}–$${r.car.priceNewMax.toLocaleString()}` : '—') },
  { label: 'Price (used, typical)', get: (r) => `$${r.car.priceUsedTypical.toLocaleString()}` },
  { label: 'Body style', get: (r) => r.car.bodyStyle },
  { label: 'Size class', get: (r) => r.car.sizeClass },
  { label: 'Seats / doors', get: (r) => `${r.car.seats} / ${r.car.doors}` },
  { label: 'Cargo (cu ft)', get: (r) => r.car.cargoCuFt },
  { label: 'Drivetrain', get: (r) => r.car.drivetrain },
  { label: 'Transmission', get: (r) => r.car.transmission },
  { label: 'Fuel type', get: (r) => r.car.fuelType },
  { label: 'Horsepower', get: (r) => r.car.horsepower },
  { label: '0–60 mph', get: (r) => `${r.car.zeroToSixtySec}s` },
  { label: 'MPG / MPGe combined', get: (r) => r.car.mpgCombined },
  { label: 'Reliability (1–5)', get: (r) => r.car.reliabilityScore },
  { label: 'Est. annual maintenance', get: (r) => `$${r.car.estAnnualMaintenance.toLocaleString()}` },
  { label: 'Insurance tier', get: (r) => r.car.insuranceTier },
  { label: 'Depreciation', get: (r) => r.car.depreciationTier },
];

export default function CompareTable({ results, onClose }) {
  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-800/50 p-5 sm:p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Compare</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-zinc-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 rounded"
        >
          Close
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="text-left py-2 pr-4 text-zinc-500 font-medium">Spec</th>
              {results.map((r) => (
                <th key={r.car.id} className="text-left py-2 pr-4 text-white font-semibold whitespace-nowrap">
                  {r.car.make} {r.car.model}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-b border-zinc-800">
                <td className="py-2 pr-4 text-zinc-500 whitespace-nowrap">{row.label}</td>
                {results.map((r) => (
                  <td key={r.car.id} className="py-2 pr-4 text-zinc-200 whitespace-nowrap">
                    {row.get(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
