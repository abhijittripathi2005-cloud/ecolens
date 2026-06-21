import { transactions as mockTransactions, categories } from '../data/mockData';

function catMeta(id) {
  return categories.find((c) => c.id === id) ?? { icon: '📦', label: id };
}

export default function TransactionList({ transactions = mockTransactions }) {
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(15,46,29,0.08)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-forest">Recent Transactions</h3>
        <button className="text-xs font-medium text-sage hover:text-forest transition-colors">
          View all
        </button>
      </div>

      <div className="divide-y divide-dashed divide-ink/10">
        {transactions.slice(0, 6).map((t) => {
          const meta = catMeta(t.category);
          return (
            <div key={t.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="w-9 h-9 rounded-lg bg-paper-dim flex items-center justify-center text-base shrink-0">
                {meta.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink truncate">{t.label}</p>
                <p className="font-mono text-[11px] text-ink/40">{t.date}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono text-sm font-semibold text-ink">₹{t.amount}</p>
                <p className="font-mono text-[11px] text-sage">{t.co2} kg CO₂</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
