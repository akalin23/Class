export default function Intro({ onStart, carCount, questionCount }) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-16 max-w-xl mx-auto">
      <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold mb-4">Car Picker</span>
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">Find your car.</h1>
      <p className="text-zinc-400 text-lg leading-relaxed mb-4">
        {questionCount} questions about the actual car — budget, size, drivetrain, features, running costs — scored
        against a database of {carCount} real vehicles.
      </p>
      <p className="text-zinc-500 leading-relaxed mb-10">
        This is not a personality quiz. There's no "pick a vacation spot." Every question maps to a real
        specification, and your results come with honest trade-offs, not just a flattering match.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-8 py-3.5 text-lg transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 focus-visible:outline-offset-2"
      >
        Start the quiz
      </button>
      <p className="text-zinc-600 text-sm mt-6">Takes about 2 minutes. You can go back and change any answer.</p>
    </div>
  );
}
