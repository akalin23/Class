import { FEATURE_OPTIONS, SEATS_DOORS_OPTIONS } from './questions.js';

const INSURANCE_TIER_VALUE = { low: 0, medium: 0.35, high: 0.7, 'very-high': 1 };
const DEPRECIATION_TIER_VALUE = { slow: 0, average: 0.5, fast: 1 };

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

function normalize(value, min, max) {
  if (max === min) return 0.5;
  return clamp01((value - min) / (max - min));
}

function extent(cars, fn) {
  const values = cars.map(fn).filter((v) => v !== null && v !== undefined && !Number.isNaN(v));
  if (values.length === 0) return [0, 1];
  return [Math.min(...values), Math.max(...values)];
}

function carPriceForBudget(car, condition) {
  if (condition === 'new') return car.priceNewMin;
  if (condition === 'used') return car.priceUsedTypical;
  // 'either': cheapest legitimate way to acquire it
  const candidates = [car.priceUsedTypical, car.priceNewMin].filter((v) => v !== null && v !== undefined);
  return candidates.length ? Math.min(...candidates) : null;
}

function hasManual(car) {
  return car.transmission === 'manual' || car.transmission === 'manual+auto';
}

function meetsDrivetrain(car, pref) {
  if (pref === 'no-pref') return true;
  if (car.drivetrain === pref) return true;
  if (pref === 'AWD' && car.awdAvailable) return true;
  return false;
}

// ---------------------------------------------------------------------
// Hard filter definitions, ordered from "safe to relax first" to "relax last"
// ---------------------------------------------------------------------

function buildFilters(answers) {
  const seatsDoorsOpt = SEATS_DOORS_OPTIONS.find((o) => o.value === answers.seatsDoors) || SEATS_DOORS_OPTIONS[0];

  return [
    {
      id: 'mustHaveFeatures',
      active: () => answers.mustHaveFeatures.length > 0,
      passes: (car, ctx) => (ctx.mustHaveFeatures ?? answers.mustHaveFeatures).every((f) => car.features[f]),
      relaxable: true,
    },
    {
      id: 'excludeBrands',
      active: () => answers.brands.excludeMakes.length > 0 || answers.brands.excludeOrigins.length > 0,
      passes: (car) =>
        !answers.brands.excludeMakes.includes(car.make) && !answers.brands.excludeOrigins.includes(car.brandOrigin),
      relaxable: true,
    },
    {
      id: 'budget',
      active: () => true,
      passes: (car, ctx) => {
        const price = carPriceForBudget(car, answers.budget.condition);
        if (price === null) return false;
        return price <= (ctx.budgetMax ?? answers.budget.max);
      },
      relaxable: true,
    },
    {
      id: 'transmissionRequired',
      active: () => answers.transmission === 'manual-required',
      passes: (car) => hasManual(car),
      relaxable: true,
    },
    {
      id: 'drivetrainRequired',
      active: () => answers.drivetrain.required && answers.drivetrain.pref !== 'no-pref',
      passes: (car) => meetsDrivetrain(car, answers.drivetrain.pref),
      relaxable: true,
    },
    {
      id: 'fuelType',
      active: () => answers.fuelType.length > 0,
      passes: (car) => answers.fuelType.includes(car.fuelType),
      relaxable: true,
    },
    {
      id: 'bodyStyle',
      active: () => answers.bodyStyle.length > 0,
      passes: (car) => answers.bodyStyle.includes(car.bodyStyle),
      relaxable: true,
    },
    {
      id: 'sizeClass',
      active: () => answers.sizeClass.length > 0,
      passes: (car) => answers.sizeClass.includes(car.sizeClass),
      relaxable: true,
    },
    {
      id: 'seatsDoors',
      active: () => seatsDoorsOpt.minSeats > 0 || seatsDoorsOpt.minDoors > 0,
      passes: (car) => car.seats >= seatsDoorsOpt.minSeats && car.doors >= seatsDoorsOpt.minDoors,
      relaxable: false, // a real physical need — don't silently drop it
    },
  ];
}

function runFilters(cars, filters, disabled, ctx) {
  return cars.filter((car) =>
    filters.every((f) => disabled.has(f.id) || !f.active() || f.passes(car, ctx))
  );
}

function featureLabel(key) {
  return FEATURE_OPTIONS.find((f) => f.value === key)?.label ?? key;
}

/**
 * Applies hard filters, relaxing them one step at a time (softest first) until
 * at least `minResults` cars survive or there's nothing left to relax.
 * Returns { survivors, relaxedNotes }.
 */
function applyHardFiltersWithRelaxation(cars, answers, minResults = 3) {
  const filters = buildFilters(answers);
  const disabled = new Set();
  const relaxedNotes = [];
  const ctx = { mustHaveFeatures: [...answers.mustHaveFeatures], budgetMax: answers.budget.max };

  let survivors = runFilters(cars, filters, disabled, ctx);
  if (survivors.length >= minResults) return { survivors, relaxedNotes };

  // Step 1: drop must-have features one at a time, dropping the one that
  // currently eliminates the most cars first.
  while (ctx.mustHaveFeatures.length > 0 && survivors.length < minResults) {
    const baseline = runFilters(
      cars,
      filters.filter((f) => f.id !== 'mustHaveFeatures'),
      disabled,
      ctx
    );
    let worstFeature = null;
    let worstCount = -1;
    for (const feature of ctx.mustHaveFeatures) {
      const failCount = baseline.filter((c) => !c.features[feature]).length;
      if (failCount > worstCount) {
        worstCount = failCount;
        worstFeature = feature;
      }
    }
    if (worstFeature === null) break;
    ctx.mustHaveFeatures = ctx.mustHaveFeatures.filter((f) => f !== worstFeature);
    relaxedNotes.push(`No cars had every must-have, so we dropped "${featureLabel(worstFeature)}" from the requirement.`);
    survivors = runFilters(cars, filters, disabled, ctx);
  }
  if (survivors.length >= minResults) return { survivors, relaxedNotes };

  // Step 2: widen budget by 10%, then 20%, then 30%.
  for (const bump of [0.1, 0.2, 0.3]) {
    if (survivors.length >= minResults) break;
    ctx.budgetMax = Math.round(answers.budget.max * (1 + bump));
    relaxedNotes.push(`Widened your budget by ${Math.round(bump * 100)}% (up to $${ctx.budgetMax.toLocaleString()}) to find more matches.`);
    survivors = runFilters(cars, filters, disabled, ctx);
  }
  if (survivors.length >= minResults) return { survivors, relaxedNotes };

  // Step 3+: drop remaining relaxable filters one at a time, softest-ordered.
  const relaxOrder = ['transmissionRequired', 'drivetrainRequired', 'fuelType', 'sizeClass', 'bodyStyle', 'excludeBrands'];
  const labels = {
    transmissionRequired: 'the "manual required" requirement (now just preferred)',
    drivetrainRequired: 'the required drivetrain (now just preferred)',
    fuelType: 'the powertrain/fuel-type filter',
    sizeClass: 'the size-class filter',
    bodyStyle: 'the body-style filter',
    excludeBrands: 'the excluded brands/origins filter',
  };
  for (const id of relaxOrder) {
    if (survivors.length >= minResults) break;
    const filter = filters.find((f) => f.id === id);
    if (!filter || !filter.active()) continue;
    disabled.add(id);
    relaxedNotes.push(`Relaxed ${labels[id]} to show more matches.`);
    survivors = runFilters(cars, filters, disabled, ctx);
  }

  return { survivors, relaxedNotes };
}

// ---------------------------------------------------------------------
// Soft scoring
// ---------------------------------------------------------------------

function computeCostIndex(car) {
  const fuelGradeCost = car.fuelGrade === 'premium' ? 1 : car.fuelGrade === 'diesel' ? 0.6 : 0;
  const insuranceCost = INSURANCE_TIER_VALUE[car.insuranceTier] ?? 0.5;
  // Lower mpg = worse. EVs report MPGe on a different scale, so cap contribution fairly.
  const mpgCost = 1 - normalize(Math.min(car.mpgCombined, 60), 15, 60);
  const maintenanceCost = normalize(car.estAnnualMaintenance, 350, 2200);
  return fuelGradeCost * 0.2 + insuranceCost * 0.3 + mpgCost * 0.25 + maintenanceCost * 0.25;
}

function stylingOverlap(car, selected) {
  if (selected.length === 0) return null;
  const overlap = car.stylingTags.filter((t) => selected.includes(t)).length;
  return clamp01(overlap / selected.length);
}

function niceToHaveScore(car, selected) {
  if (selected.length === 0) return null;
  const have = selected.filter((f) => car.features[f]).length;
  return clamp01(have / selected.length);
}

function brandBoostScore(car, brands) {
  const wantsInclude = brands.includeMakes.length > 0 || brands.includeOrigins.length > 0;
  if (!wantsInclude) return null;
  const matches = brands.includeMakes.includes(car.make) || brands.includeOrigins.includes(car.brandOrigin);
  return matches ? 1 : 0.3;
}

function drivetrainScore(car, drivetrainAnswer) {
  if (drivetrainAnswer.pref === 'no-pref') return null;
  if (car.drivetrain === drivetrainAnswer.pref) return 1;
  if (drivetrainAnswer.pref === 'AWD' && car.awdAvailable) return 0.6;
  return 0;
}

function transmissionScore(car, transmissionAnswer) {
  if (transmissionAnswer !== 'manual-preferred') return null;
  return hasManual(car) ? 1 : 0;
}

/**
 * Pure scoring function. Returns { results, relaxedNotes, totalConsidered }.
 * results is an array of { car, matchScore, subscores } sorted descending by matchScore.
 */
export function scoreCars(allCars, answers, options = {}) {
  const minResults = options.minResults ?? 3;
  const { survivors, relaxedNotes } = applyHardFiltersWithRelaxation(allCars, answers, minResults);

  const [hpMin, hpMax] = extent(allCars, (c) => c.horsepower);
  const [zeroSixtyMin, zeroSixtyMax] = extent(allCars, (c) => c.zeroToSixtySec);
  const [mpgMin, mpgMax] = extent(allCars, (c) => c.mpgCombined);
  const [cargoMin, cargoMax] = extent(allCars, (c) => c.cargoCuFt);
  const [seatsMin, seatsMax] = extent(allCars, (c) => c.seats);

  const results = survivors.map((car) => {
    const dims = [];

    const perfHp = normalize(car.horsepower, hpMin, hpMax);
    const perfZero = 1 - normalize(car.zeroToSixtySec, zeroSixtyMin, zeroSixtyMax);
    dims.push({
      key: 'performance',
      subscore: perfHp * 0.5 + perfZero * 0.5,
      weight: 3 * (answers.performancePriority / 4),
    });

    dims.push({
      key: 'runningCost',
      subscore: 1 - computeCostIndex(car),
      weight: 3 * (answers.runningCostSensitivity / 4),
    });

    dims.push({
      key: 'reliability',
      subscore: normalize(car.reliabilityScore, 1, 5),
      weight: 2.5 * (answers.reliabilityImportance / 4),
    });

    dims.push({
      key: 'fuelEconomy',
      subscore: normalize(car.mpgCombined, mpgMin, mpgMax),
      weight: 2 * (answers.fuelEconomyPriority / 4),
    });

    const cargoBlend = normalize(car.cargoCuFt, cargoMin, cargoMax) * 0.7 + normalize(car.seats, seatsMin, seatsMax) * 0.3;
    dims.push({
      key: 'cargoPracticality',
      subscore: cargoBlend,
      weight: 2 * (answers.cargoPracticality / 4),
    });

    const drivetrain = drivetrainScore(car, answers.drivetrain);
    if (drivetrain !== null) dims.push({ key: 'drivetrain', subscore: drivetrain, weight: 2 });

    const transmission = transmissionScore(car, answers.transmission);
    if (transmission !== null) dims.push({ key: 'transmission', subscore: transmission, weight: 2 });

    const styling = stylingOverlap(car, answers.stylingDirection);
    if (styling !== null) dims.push({ key: 'styling', subscore: styling, weight: 1.5 });

    const niceToHave = niceToHaveScore(car, answers.niceToHaveFeatures);
    if (niceToHave !== null) dims.push({ key: 'niceToHaveFeatures', subscore: niceToHave, weight: 1.5 });

    const brandBoost = brandBoostScore(car, answers.brands);
    if (brandBoost !== null) dims.push({ key: 'brandBoost', subscore: brandBoost, weight: 1 });

    const totalWeight = dims.reduce((sum, d) => sum + d.weight, 0);
    const matchScore =
      totalWeight === 0
        ? 100
        : Math.round(clamp01(dims.reduce((sum, d) => sum + d.weight * d.subscore, 0) / totalWeight) * 100);

    const subscores = Object.fromEntries(dims.map((d) => [d.key, d.subscore]));

    return { car, matchScore, subscores };
  });

  results.sort((a, b) => b.matchScore - a.matchScore);

  return { results, relaxedNotes, totalConsidered: allCars.length };
}

/**
 * Counts how many cars survive the CURRENT hard filters only (no relaxation) —
 * used for the live "N cars still match" counter during the quiz.
 */
export function countMatches(allCars, answers) {
  const filters = buildFilters(answers);
  const ctx = { mustHaveFeatures: answers.mustHaveFeatures, budgetMax: answers.budget.max };
  return runFilters(allCars, filters, new Set(), ctx).length;
}

// ---------------------------------------------------------------------
// Honest explanations for the results screen
// ---------------------------------------------------------------------

export function explainCar(car, answers) {
  const reasons = [];
  const tradeoffs = [];

  if (answers.bodyStyle.length > 0 && answers.bodyStyle.includes(car.bodyStyle)) {
    reasons.push(`${car.bodyStyle[0].toUpperCase()}${car.bodyStyle.slice(1)} body style ✓`);
  }
  if (answers.sizeClass.length > 0 && answers.sizeClass.includes(car.sizeClass)) {
    reasons.push(`${car.sizeClass} size class ✓`);
  }
  if (answers.mustHaveFeatures.length > 0) {
    const have = answers.mustHaveFeatures.filter((f) => car.features[f]);
    if (have.length > 0) reasons.push(`Has your must-haves: ${have.map(featureLabel).join(', ')} ✓`);
  }
  if (answers.drivetrain.pref !== 'no-pref' && (car.drivetrain === answers.drivetrain.pref || (answers.drivetrain.pref === 'AWD' && car.awdAvailable))) {
    reasons.push(`${car.drivetrain} ✓ matches your drivetrain preference`);
  }
  if (answers.transmission !== 'auto-fine' && hasManual(car)) {
    reasons.push('Offers a manual transmission');
  }
  if (answers.performancePriority >= 3) {
    reasons.push(`${car.horsepower} hp / ${car.zeroToSixtySec}s 0–60 fits your high performance priority`);
  }
  if (answers.runningCostSensitivity >= 3 && (car.insuranceTier === 'low' || car.fuelGrade === 'regular')) {
    reasons.push('Low running costs — regular fuel and/or affordable insurance');
  }
  if (answers.reliabilityImportance >= 3 && car.reliabilityScore >= 4) {
    reasons.push(`Strong reliability reputation (${car.reliabilityScore}/5)`);
  }
  if (answers.fuelEconomyPriority >= 3 && car.mpgCombined >= 35) {
    reasons.push(`${car.mpgCombined} mpg fits your fuel-economy priority`);
  }
  if (answers.stylingDirection.length > 0) {
    const overlap = car.stylingTags.filter((t) => answers.stylingDirection.includes(t));
    if (overlap.length > 0) reasons.push(`Styling: ${overlap.join(', ')}`);
  }
  if (answers.niceToHaveFeatures.length > 0) {
    const have = answers.niceToHaveFeatures.filter((f) => car.features[f]);
    if (have.length > 0) reasons.push(`Bonus features: ${have.map(featureLabel).join(', ')}`);
  }

  // Trade-offs — derived honestly from the car's own specs.
  if (car.insuranceTier === 'high' || car.insuranceTier === 'very-high') {
    tradeoffs.push(`Insurance runs ${car.insuranceTier === 'very-high' ? 'very high' : 'high'} for this class.`);
  }
  if (car.fuelGrade === 'premium') {
    tradeoffs.push('Requires premium fuel.');
  }
  if (car.depreciationTier === 'fast') {
    tradeoffs.push('Depreciates faster than average — expect a bigger value drop over 5 years.');
  }
  if (car.reliabilityScore <= 2) {
    tradeoffs.push('Below-average reliability reputation for the segment.');
  }
  if (car.estAnnualMaintenance >= 1200) {
    tradeoffs.push(`Maintenance runs high (~$${car.estAnnualMaintenance.toLocaleString()}/yr estimated).`);
  }
  if (car.mpgCombined < 22 && car.fuelType === 'gas') {
    tradeoffs.push(`Thirsty — only ${car.mpgCombined} mpg combined.`);
  }
  if (answers.mustHaveFeatures.length > 0) {
    const missing = answers.mustHaveFeatures.filter((f) => !car.features[f]);
    if (missing.length > 0) {
      tradeoffs.push(`Missing must-have(s) you asked for (included via relaxed matching): ${missing.map(featureLabel).join(', ')}.`);
    }
  }
  if (answers.transmission === 'manual-required' && !hasManual(car)) {
    tradeoffs.push('No manual transmission available, despite your preference.');
  }

  return { reasons, tradeoffs };
}
