import { TrendingUp } from 'lucide-react';
import { moodInsight } from '../data/mockMood';

export default function MoodInsight() {
  return (
    <div className="bg-forest rounded-xl shadow-[0_2px_12px_rgba(15,46,29,0.15)] p-6 text-paper">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-coral/20 flex items-center justify-center shrink-0">
          <TrendingUp className="w-4 h-4 text-coral" strokeWidth={2} />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-sage-light">
          Pattern detected
        </p>
      </div>

      <p className="font-display text-xl font-semibold leading-snug mb-2">
        {moodInsight.text}
      </p>
      <p className="text-xs text-sage-light">{moodInsight.comparisonText}</p>
    </div>
  );
}
