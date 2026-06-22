import { moods as moodDefs } from '../data/mockMood';

function moodMeta(id) {
  return moodDefs.find((m) => m.id === id);
}

function dayLabel(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short' });
}

// Build the last 7 days as a grid, matching real mood entries where available
function buildWeek(moods) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const moodEntry = moods.find((m) => m.date === dateStr);
    days.push({ date: dateStr, mood: moodEntry?.mood ?? null });
  }
  return days;
}

export default function MoodHistory({ moods = [] }) {
  const week = buildWeek(moods);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(15,46,29,0.08)] p-6">
      <h3 className="font-display text-lg font-semibold text-forest mb-1">This Week</h3>
      <p className="text-xs text-ink/50 mb-5">Your mood check-ins, last 7 days</p>

      <div className="grid grid-cols-7 gap-1.5">
        {week.map((entry) => {
          const meta = moodMeta(entry.mood);
          const isToday = entry.date === today;
          return (
            <div
              key={entry.date}
              className={`flex flex-col items-center gap-1.5 rounded-lg py-3 px-1 ${
                isToday
                  ? 'bg-paper-dim border border-dashed border-amber/50'
                  : 'bg-paper-dim'
              }`}
            >
              <span className="text-[10px] font-mono text-ink/40 uppercase">{dayLabel(entry.date)}</span>
              <span className="text-2xl leading-none">{meta ? meta.emoji : '·'}</span>
              <span className="font-mono text-[10px] text-ink/50">
                {isToday && !meta ? 'today' : ''}
              </span>
            </div>
          );
        })}
      </div>

      {moods.length === 0 && (
        <p className="text-xs text-ink/40 text-center mt-4">
          No check-ins yet — tap an emoji above to log today's mood.
        </p>
      )}
    </div>
  );
}
