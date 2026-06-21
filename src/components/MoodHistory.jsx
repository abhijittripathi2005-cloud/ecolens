import { moods, moodHistory } from '../data/mockMood';

function moodMeta(id) {
  return moods.find((m) => m.id === id);
}

function dayLabel(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short' });
}

export default function MoodHistory() {
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(15,46,29,0.08)] p-6">
      <h3 className="font-display text-lg font-semibold text-forest mb-1">This Week</h3>
      <p className="text-xs text-ink/50 mb-5">Mood + spend, side by side</p>

      <div className="grid grid-cols-7 gap-1.5">
        {moodHistory.map((entry) => {
          const meta = moodMeta(entry.mood);
          const isToday = entry.mood === null;
          return (
            <div
              key={entry.date}
              className={`flex flex-col items-center gap-1.5 rounded-lg py-3 px-1 ${
                isToday ? 'bg-paper-dim border border-dashed border-amber/50' : 'bg-paper-dim'
              }`}
            >
              <span className="text-[10px] font-mono text-ink/40 uppercase">{dayLabel(entry.date)}</span>
              <span className="text-2xl leading-none">{meta ? meta.emoji : '·'}</span>
              <span className="font-mono text-[10px] text-ink/50">
                {entry.spend ? `₹${entry.spend}` : '—'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
