import { TrendingUp, Minus } from 'lucide-react';

/**
 * Calculates real spend-mood correlation from Firestore data.
 * Groups transactions by date, joins with mood entries on matching dates,
 * then compares average spend on high-stress days vs calm days.
 */
function computeInsight(moods, transactions) {
  if (!moods.length || !transactions.length) return null;

  // Group transaction totals by date
  const spendByDate = {};
  transactions.forEach((t) => {
    spendByDate[t.date] = (spendByDate[t.date] || 0) + (t.amount || 0);
  });

  // Split mood entries into "stressed" days vs "calm" days
  const stressedDays = moods.filter((m) => m.mood === 'stressed' || m.mood === 'angry');
  const calmDays = moods.filter((m) => m.mood === 'great' || m.mood === 'okay');

  const avgSpend = (days) => {
    const withData = days.filter((m) => spendByDate[m.date] !== undefined);
    if (!withData.length) return null;
    const total = withData.reduce((sum, m) => sum + spendByDate[m.date], 0);
    return Math.round(total / withData.length);
  };

  const stressedAvg = avgSpend(stressedDays);
  const calmAvg = avgSpend(calmDays);

  if (stressedAvg === null || calmAvg === null) return null;

  const pctMore = Math.round(((stressedAvg - calmAvg) / (calmAvg || 1)) * 100);
  const diff = Math.abs(pctMore);

  if (diff < 5) {
    return {
      text: 'Your spending is consistent regardless of mood',
      detail: `₹${stressedAvg} on stressed days vs ₹${calmAvg} on calm days — almost no difference`,
      isNeutral: true,
    };
  }

  if (pctMore > 0) {
    return {
      text: `You spend ${diff}% more on stressed days`,
      detail: `₹${stressedAvg} avg on stressed days vs ₹${calmAvg} on calm days`,
      isNeutral: false,
    };
  }

  return {
    text: `You actually spend ${diff}% less when stressed`,
    detail: `₹${stressedAvg} avg on stressed days vs ₹${calmAvg} on calm days`,
    isNeutral: true,
  };
}

export default function MoodInsight({ moods = [], transactions = [] }) {
  const insight = computeInsight(moods, transactions);

  if (!insight) {
    return (
      <div className="bg-forest rounded-xl shadow-[0_2px_12px_rgba(15,46,29,0.15)] p-6 text-paper flex flex-col items-center justify-center text-center min-h-[140px]">
        <Minus className="w-6 h-6 text-sage-light mb-3" strokeWidth={1.8} />
        <p className="font-display text-base font-semibold mb-1">Not enough data yet</p>
        <p className="text-xs text-sage-light">Log your mood for a few days to see spending patterns.</p>
      </div>
    );
  }

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
      <p className="font-display text-xl font-semibold leading-snug mb-2">{insight.text}</p>
      <p className="text-xs text-sage-light">{insight.detail}</p>
    </div>
  );
}
