// Data-driven quiz configuration.
// Every question maps to a concrete field in src/data/cars.js — no vibes,
// no lifestyle questions. Adding/removing a question here is the only
// change needed; the QuizStep renderer and scoring engine read this config.

export const FEATURE_OPTIONS = [
  { value: 'ventilatedSeats', label: 'Ventilated seats' },
  { value: 'heatedSeats', label: 'Heated seats' },
  { value: 'heatedSteeringWheel', label: 'Heated steering wheel' },
  { value: 'surroundView360', label: '360° surround camera' },
  { value: 'headUpDisplay', label: 'Head-up display' },
  { value: 'panoramicRoof', label: 'Panoramic roof' },
  { value: 'largeTouchscreen', label: 'Large (12"+) touchscreen' },
  { value: 'digitalCluster', label: 'Digital instrument cluster' },
  { value: 'premiumAudio', label: 'Premium audio system' },
  { value: 'wirelessCarplayAndroid', label: 'Wireless CarPlay/Android Auto' },
  { value: 'adaptiveCruise', label: 'Adaptive cruise control' },
  { value: 'memorySeats', label: 'Memory seats' },
  { value: 'paddleShifters', label: 'Paddle shifters' },
  { value: 'sunroof', label: 'Sunroof' },
];

export const BODY_STYLE_OPTIONS = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'coupe', label: 'Coupe' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'wagon', label: 'Wagon' },
  { value: 'suv', label: 'SUV' },
  { value: 'truck', label: 'Truck' },
  { value: 'minivan', label: 'Minivan' },
  { value: 'convertible', label: 'Convertible' },
];

export const SIZE_CLASS_OPTIONS = [
  { value: 'subcompact', label: 'Subcompact', description: 'Smallest footprint, easiest to park' },
  { value: 'compact', label: 'Compact', description: 'Efficient, still roomy enough for 4' },
  { value: 'midsize', label: 'Midsize', description: 'The default family-car size' },
  { value: 'fullsize', label: 'Full-size', description: 'Maximum space, biggest footprint' },
  { value: 'midsize-suv', label: 'Midsize SUV', description: 'Two-row SUV/crossover' },
  { value: '3row-suv', label: '3-Row SUV', description: 'SUV with a third row of seats' },
];

export const FUEL_TYPE_OPTIONS = [
  { value: 'gas', label: 'Gas' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'phev', label: 'Plug-in hybrid' },
  { value: 'ev', label: 'Fully electric' },
  { value: 'diesel', label: 'Diesel' },
];

export const STYLING_OPTIONS = [
  { value: 'sporty', label: 'Sporty' },
  { value: 'aggressive', label: 'Aggressive' },
  { value: 'elegant', label: 'Elegant' },
  { value: 'understated', label: 'Understated' },
  { value: 'rugged', label: 'Rugged' },
  { value: 'luxurious', label: 'Luxurious' },
  { value: 'retro', label: 'Retro' },
];

export const BRAND_ORIGIN_OPTIONS = [
  { value: 'japanese', label: 'Japanese' },
  { value: 'korean', label: 'Korean' },
  { value: 'german', label: 'German' },
  { value: 'american', label: 'American' },
  { value: 'italian', label: 'Italian' },
];

export const SEATS_DOORS_OPTIONS = [
  { value: 'any', label: 'No minimum', minSeats: 0, minDoors: 0, description: 'Any seat/door count works' },
  { value: '2dr', label: '2-seat / 2-door OK', minSeats: 2, minDoors: 2, description: 'Fine with a 2-seater' },
  { value: '4-5seats', label: '4–5 seats, 4 doors', minSeats: 4, minDoors: 4, description: 'Standard sedan/SUV seating' },
  { value: '6plus', label: '6+ seats (3 rows)', minSeats: 6, minDoors: 4, description: 'Need a third row' },
];

export const DRIVETRAIN_OPTIONS = [
  { value: 'no-pref', label: 'No preference' },
  { value: 'FWD', label: 'Front-wheel drive' },
  { value: 'RWD', label: 'Rear-wheel drive' },
  { value: 'AWD', label: 'All-wheel drive' },
];

export const TRANSMISSION_OPTIONS = [
  { value: 'manual-required', label: 'Manual — required', description: 'Only show cars with a manual option' },
  { value: 'manual-preferred', label: 'Manual — preferred', description: 'Boost manuals, but automatics are fine' },
  { value: 'auto-fine', label: 'Automatic is fine', description: 'No preference either way' },
];

export const SCALE_LABELS = ['Not at all', 'A little', 'Somewhat', 'A lot', 'Extremely'];

export const questions = [
  {
    id: 'budget',
    key: 'budget',
    title: "What's your budget?",
    subtitle: 'Drag to set your maximum. We\'ll match against new or used pricing based on your toggle.',
    type: 'budget',
    hardFilter: true,
    min: 15000,
    max: 130000,
    step: 1000,
    default: { max: 45000, condition: 'either' },
  },
  {
    id: 'bodyStyle',
    key: 'bodyStyle',
    title: 'What body style(s) are you open to?',
    subtitle: 'Pick as many as you want. Leave all unselected for no preference.',
    type: 'multiSelect',
    hardFilter: true,
    options: BODY_STYLE_OPTIONS,
    default: [],
  },
  {
    id: 'sizeClass',
    key: 'sizeClass',
    title: 'What size class fits your life?',
    subtitle: "This nudges your ranking — it won't eliminate close matches.",
    type: 'singleSelect',
    hardFilter: false,
    weight: 2,
    options: [{ value: 'no-pref', label: 'No preference' }, ...SIZE_CLASS_OPTIONS],
    default: 'no-pref',
  },
  {
    id: 'seatsDoors',
    key: 'seatsDoors',
    title: 'How many seats and doors do you need, at minimum?',
    subtitle: 'Cars below this threshold will be filtered out entirely.',
    type: 'singleSelect',
    hardFilter: true,
    options: SEATS_DOORS_OPTIONS,
    default: 'any',
  },
  {
    id: 'fuelType',
    key: 'fuelType',
    title: 'Which powertrain(s) will you consider?',
    subtitle: 'Pick as many as you want. Leave all unselected for no preference.',
    type: 'multiSelect',
    hardFilter: true,
    options: FUEL_TYPE_OPTIONS,
    default: [],
  },
  {
    id: 'performancePriority',
    key: 'performancePriority',
    title: 'How much does performance and power matter?',
    subtitle: 'Horsepower and 0–60 time will be weighted by this.',
    type: 'scale',
    hardFilter: false,
    weight: 3,
    lowLabel: "Don't care",
    highLabel: 'Top priority',
    default: 2,
  },
  {
    id: 'drivetrain',
    key: 'drivetrain',
    title: 'Drivetrain preference?',
    subtitle: 'You can require it, or just lean toward it.',
    type: 'drivetrainSelect',
    hardFilter: 'conditional',
    weight: 2,
    options: DRIVETRAIN_OPTIONS,
    default: { pref: 'no-pref', required: false },
  },
  {
    id: 'transmission',
    key: 'transmission',
    title: 'Transmission?',
    subtitle: '',
    type: 'singleSelect',
    hardFilter: 'conditional',
    weight: 2,
    options: TRANSMISSION_OPTIONS,
    default: 'auto-fine',
  },
  {
    id: 'mustHaveFeatures',
    key: 'mustHaveFeatures',
    title: 'Any absolute must-have features?',
    subtitle: 'Cars missing ANY of these are removed from your results entirely — choose carefully.',
    type: 'featureChecklist',
    hardFilter: true,
    options: FEATURE_OPTIONS,
    default: [],
  },
  {
    id: 'niceToHaveFeatures',
    key: 'niceToHaveFeatures',
    title: "Anything you'd like, but don't require?",
    subtitle: "These boost a car's match score without ruling anything out.",
    type: 'featureChecklist',
    hardFilter: false,
    weight: 1.5,
    options: FEATURE_OPTIONS,
    default: [],
  },
  {
    id: 'runningCostSensitivity',
    key: 'runningCostSensitivity',
    title: 'How sensitive are you to running costs?',
    subtitle: 'Fuel grade, MPG, insurance tier, and maintenance all factor in.',
    type: 'scale',
    hardFilter: false,
    weight: 3,
    lowLabel: "Don't care",
    highLabel: 'Very sensitive',
    default: 2,
  },
  {
    id: 'reliabilityImportance',
    key: 'reliabilityImportance',
    title: 'How important is reliability?',
    subtitle: 'Weighted using each car’s real-world reliability reputation.',
    type: 'scale',
    hardFilter: false,
    weight: 2.5,
    lowLabel: "Don't care",
    highLabel: 'Extremely important',
    default: 3,
  },
  {
    id: 'fuelEconomyPriority',
    key: 'fuelEconomyPriority',
    title: 'How much does fuel economy matter?',
    subtitle: 'Separate from overall running cost — this is purely about MPG/MPGe.',
    type: 'scale',
    hardFilter: false,
    weight: 2,
    lowLabel: "Don't care",
    highLabel: 'Top priority',
    default: 2,
  },
  {
    id: 'cargoPracticality',
    key: 'cargoPracticality',
    title: 'How much do cargo space and practicality matter?',
    subtitle: 'Weighs cargo capacity and seat count.',
    type: 'scale',
    hardFilter: false,
    weight: 2,
    lowLabel: "Don't care",
    highLabel: 'Essential',
    default: 2,
  },
  {
    id: 'stylingDirection',
    key: 'stylingDirection',
    title: 'What styling direction do you like?',
    subtitle: 'Pick as many as apply. Leave unselected for no preference.',
    type: 'multiSelect',
    hardFilter: false,
    weight: 1.5,
    options: STYLING_OPTIONS,
    default: [],
  },
  {
    id: 'brands',
    key: 'brands',
    title: 'Any brands or origins to include or exclude?',
    subtitle: 'Excluded brands/origins are removed entirely. Included ones just get a scoring boost.',
    type: 'brandFilter',
    hardFilter: true,
    weight: 1,
    originOptions: BRAND_ORIGIN_OPTIONS,
    default: { includeMakes: [], excludeMakes: [], includeOrigins: [], excludeOrigins: [] },
  },
];

export function defaultAnswers() {
  const answers = {};
  for (const q of questions) {
    answers[q.key] = structuredClone ? structuredClone(q.default) : JSON.parse(JSON.stringify(q.default));
  }
  return answers;
}
