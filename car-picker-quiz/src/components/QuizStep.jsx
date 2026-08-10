import OptionCard from './OptionCard.jsx';
import MultiSelectChips from './MultiSelectChips.jsx';
import ScaleSlider from './ScaleSlider.jsx';
import BudgetSlider from './BudgetSlider.jsx';
import MatchCounter from './MatchCounter.jsx';
import { countMatches } from '../quiz/scoring.js';

function toggleInArray(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function QuizStep({ question, answers, onAnswer, allCars }) {
  const answer = answers[question.key];
  const set = (value) => onAnswer(question.key, value);
  const showCounter = question.hardFilter === true || question.hardFilter === 'conditional';
  const liveCount = showCounter ? countMatches(allCars, answers) : null;

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">{question.title}</h2>
      {question.subtitle && <p className="text-zinc-400 mb-6">{question.subtitle}</p>}

      <div className="mb-6">
        {question.type === 'budget' && (
          <BudgetSlider value={answer} onChange={set} min={question.min} max={question.max} step={question.step} />
        )}

        {question.type === 'multiSelect' && (
          <MultiSelectChips options={question.options} selected={answer} onToggle={(v) => set(toggleInArray(answer, v))} />
        )}

        {question.type === 'featureChecklist' && (
          <MultiSelectChips options={question.options} selected={answer} onToggle={(v) => set(toggleInArray(answer, v))} />
        )}

        {question.type === 'singleSelect' && (
          <div className="grid gap-2.5">
            {question.options.map((opt) => (
              <OptionCard
                key={opt.value}
                label={opt.label}
                description={opt.description}
                selected={answer === opt.value}
                onClick={() => set(opt.value)}
              />
            ))}
          </div>
        )}

        {question.type === 'scale' && (
          <ScaleSlider value={answer} onChange={set} lowLabel={question.lowLabel} highLabel={question.highLabel} />
        )}

        {question.type === 'drivetrainSelect' && (
          <div>
            <div className="grid gap-2.5 mb-4">
              {question.options.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  selected={answer.pref === opt.value}
                  onClick={() => set({ pref: opt.value, required: opt.value === 'no-pref' ? false : answer.required })}
                />
              ))}
            </div>
            {answer.pref !== 'no-pref' && (
              <label className="flex items-center gap-3 text-sm text-zinc-300 bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={answer.required}
                  onChange={(e) => set({ ...answer, required: e.target.checked })}
                  className="h-4 w-4 accent-amber-500"
                />
                Require {answer.pref} — eliminate cars that don't offer it, instead of just favoring it
              </label>
            )}
          </div>
        )}

        {question.type === 'brandFilter' && (
          <BrandFilterInput answer={answer} onChange={set} allCars={allCars} originOptions={question.originOptions} />
        )}
      </div>

      {showCounter && liveCount !== null && (
        <div className="mt-2">
          <MatchCounter count={liveCount} total={allCars.length} />
        </div>
      )}
    </div>
  );
}

function BrandFilterInput({ answer, onChange, allCars, originOptions }) {
  const makes = [...new Set(allCars.map((c) => c.make))].sort();

  const toggle = (field, value) => onChange({ ...answer, [field]: toggleInArray(answer[field], value) });

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-semibold text-zinc-300 mb-2">Include (boosts score) — origins</div>
        <MultiSelectChips options={originOptions} selected={answer.includeOrigins} onToggle={(v) => toggle('includeOrigins', v)} />
      </div>
      <div>
        <div className="text-sm font-semibold text-zinc-300 mb-2">Exclude (removes entirely) — origins</div>
        <MultiSelectChips options={originOptions} selected={answer.excludeOrigins} onToggle={(v) => toggle('excludeOrigins', v)} />
      </div>
      <div>
        <div className="text-sm font-semibold text-zinc-300 mb-2">Exclude (removes entirely) — specific makes</div>
        <div className="max-h-48 overflow-y-auto pr-1">
          <MultiSelectChips
            options={makes.map((m) => ({ value: m, label: m }))}
            selected={answer.excludeMakes}
            onToggle={(v) => toggle('excludeMakes', v)}
          />
        </div>
      </div>
    </div>
  );
}
