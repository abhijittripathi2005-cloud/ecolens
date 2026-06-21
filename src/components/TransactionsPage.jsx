import { categories } from '../data/mockData';

function catMeta(id) {
  return categories.find((c) => c.id === id) ?? { icon: '📦', label: id };
}

export default function TransactionsPage({ transactions }) {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalCO2 = transactions.reduce((sum, t) => sum + t.co2, 0);

  return (
    <main className="px-6 md:px-10 py-8 space-y-6 page-fade-in">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-forest">Transactions</h1>
        <p className="text-sm text-ink/50 mt-0.5">
          {transactions.length} entries · ₹{total.toLocaleString('en-IN')} total · {totalCO2.toFixed(1)} kg CO₂
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(15,46,29,0.08)] overflow-hidden">
        <div className="divide-y divide-dashed divide-ink/10">
          {transactions.map((t) => {
            const meta = catMeta(t.category);
            return (
              <div key={t.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-10 h-10 rounded-lg bg-paper-dim flex items-center justify-center text-lg shrink-0">
                  {meta.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink truncate">{t.label}</p>
                  <p className="font-mono text-[11px] text-ink/40 mt-0.5">{t.date} · {meta.label}</p>
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
    </main>
  );
}
