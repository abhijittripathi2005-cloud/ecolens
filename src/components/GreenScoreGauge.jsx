export default function GreenScoreGauge({ score = 68 }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const tier = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs work';

  return (
    <div className="bg-forest rounded-xl shadow-[0_2px_12px_rgba(15,46,29,0.15)] p-6 text-paper flex flex-col items-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-sage-light mb-4 self-start">
        Green Score
      </p>

      <div className="relative w-36 h-36">
        <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
          <circle cx="72" cy="72" r={radius} fill="none" stroke="#1C4A2E" strokeWidth="10" />
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="none"
            stroke="#F0C77F"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl font-semibold">{score}</span>
          <span className="text-[10px] text-sage-light">/ 100</span>
        </div>
      </div>

      <p className="mt-4 text-sm font-medium text-amber-light">{tier}</p>
      <p className="text-xs text-sage-light text-center mt-1">
        Top 18% among Byte Brains this week
      </p>
    </div>
  );
}
