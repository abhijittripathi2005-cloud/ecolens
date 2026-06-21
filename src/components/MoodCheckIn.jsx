import { useState } from 'react';
import { Check } from 'lucide-react';
import { moods } from '../data/mockMood';

export default function MoodCheckIn({ onCheckIn }) {
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(false);

  function handleSelect(moodId) {
    setSelected(moodId);
    setSaved(false);
  }

  function handleSave() {
    if (!selected) return;
    onCheckIn?.(selected);
    setSaved(true);
  }

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(15,46,29,0.08)] p-6">
      <h3 className="font-display text-lg font-semibold text-forest mb-1">How are you feeling today?</h3>
      <p className="text-xs text-ink/50 mb-5">Your daily check-in helps EcoLens spot spending patterns.</p>

      <div className="flex justify-between gap-2 mb-5">
        {moods.map((m) => (
          <button
            key={m.id}
            onClick={() => handleSelect(m.id)}
            className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all
              ${selected === m.id
                ? 'border-amber bg-paper-dim scale-105'
                : 'border-transparent hover:bg-paper-dim'}`}
          >
            <span className="text-3xl leading-none">{m.emoji}</span>
            <span className="text-[11px] font-medium text-ink/60">{m.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={!selected}
        className={`w-full flex items-center justify-center gap-2 font-semibold text-sm py-3 rounded-lg transition-colors
          ${saved
            ? 'bg-sage text-white'
            : selected
              ? 'bg-forest hover:bg-forest-light text-paper'
              : 'bg-paper-dim text-ink/30 cursor-not-allowed'}`}
      >
        {saved ? (
          <>
            <Check className="w-4 h-4" strokeWidth={2.5} />
            Logged for today
          </>
        ) : (
          'Save check-in'
        )}
      </button>
    </div>
  );
}
