import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

/**
 * StatCard — styled like a torn receipt stub.
 * The perforated top edge + dashed divider is EcoLens's signature motif:
 * every number on this dashboard literally reads like a line on a receipt.
 */
export default function StatCard({ label, value, unit, change, changeLabel, accent = 'forest' }) {
  const isGood = change < 0; // less spend / less CO2 is "good"
  const accentColors = {
    forest: 'text-forest',
    amber: 'text-amber',
    coral: 'text-coral',
  };

  return (
    <div className="receipt-edge bg-white rounded-b-xl shadow-[0_2px_12px_rgba(15,46,29,0.08)] pt-4 card-lift">
      <div className="px-5 pb-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50 mb-2">
          {label}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className={`font-display text-4xl font-semibold ${accentColors[accent]}`}>
            {value}
          </span>
          {unit && <span className="text-sm font-medium text-ink/40">{unit}</span>}
        </div>

        <div className="mt-3 pt-3 border-t border-dashed border-ink/15 flex items-center gap-1.5">
          {isGood ? (
            <ArrowDownRight className="w-3.5 h-3.5 text-sage" strokeWidth={2.5} />
          ) : (
            <ArrowUpRight className="w-3.5 h-3.5 text-coral" strokeWidth={2.5} />
          )}
          <span className={`text-xs font-semibold ${isGood ? 'text-sage' : 'text-coral'}`}>
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-ink/40">{changeLabel}</span>
        </div>
      </div>
    </div>
  );
}
