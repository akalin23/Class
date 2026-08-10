export default function MatchCounter({ count, total }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full bg-zinc-800/80 border border-zinc-700 px-4 py-2 text-sm text-zinc-200"
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2">
        <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
      </span>
      <span>
        <strong className="text-white font-semibold">{count}</strong> of {total} cars still match
      </span>
    </div>
  );
}
