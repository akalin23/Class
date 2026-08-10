import { useState } from 'react';
import CarCard from './CarCard.jsx';
import CompareTable from './CompareTable.jsx';

const MAX_COMPARE = 3;
const TOP_N = 5;

export default function Results({ scoreResult, answers, onRestart, onTweak }) {
  const [compareIds, setCompareIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const top = scoreResult.results.slice(0, TOP_N);

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  };

  const compareResults = top.filter((r) => compareIds.includes(r.car.id));

  if (top.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center px-6 py-16">
        <h2 className="text-2xl font-bold text-white mb-4">No cars matched, even after relaxing filters.</h2>
        <p className="text-zinc-400 mb-8">Try loosening your budget or must-have features.</p>
        <button
          type="button"
          onClick={onTweak}
          className="rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-6 py-3 transition-colors motion-reduce:transition-none"
        >
          Tweak answers
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Your top matches</h2>
        <p className="text-zinc-400">
          Ranked from {scoreResult.totalConsidered} cars based on your answers.
        </p>
      </div>

      {scoreResult.relaxedNotes.length > 0 && (
        <div className="rounded-xl border border-amber-700/50 bg-amber-500/10 px-4 py-3 mb-8 text-sm text-amber-200">
          <div className="font-semibold mb-1">Heads up — we relaxed some filters to find matches:</div>
          <ul className="space-y-0.5 list-disc list-inside">
            {scoreResult.relaxedNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {top.map((result, i) => (
          <CarCard
            key={result.car.id}
            result={result}
            answers={answers}
            rank={i + 1}
            isComparing={compareIds.includes(result.car.id)}
            compareDisabled={compareIds.length >= MAX_COMPARE}
            onToggleCompare={toggleCompare}
          />
        ))}
      </div>

      {compareResults.length >= 2 && !showCompare && (
        <div className="text-center mb-8">
          <button
            type="button"
            onClick={() => setShowCompare(true)}
            className="rounded-full border border-zinc-600 hover:border-amber-500 text-white px-6 py-2.5 text-sm font-medium transition-colors motion-reduce:transition-none"
          >
            Compare {compareResults.length} selected
          </button>
        </div>
      )}

      {showCompare && compareResults.length >= 2 && (
        <CompareTable results={compareResults} onClose={() => setShowCompare(false)} />
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onTweak}
          className="rounded-full border border-zinc-600 hover:border-amber-500 text-white px-6 py-2.5 text-sm font-medium transition-colors motion-reduce:transition-none"
        >
          Tweak answers &amp; re-run
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full border border-zinc-600 hover:border-amber-500 text-white px-6 py-2.5 text-sm font-medium transition-colors motion-reduce:transition-none"
        >
          Restart quiz
        </button>
      </div>
    </div>
  );
}
