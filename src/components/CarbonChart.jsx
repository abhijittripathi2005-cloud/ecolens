import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { categoryBreakdown as mockCategoryBreakdown, categories } from '../data/mockData';

const CATEGORY_COLORS = {
  food: '#D4922A',
  transport: '#4A7856',
  fashion: '#E8634A',
  electronics: '#0F2E1D',
  groceries: '#7FA98C',
  entertainment: '#F0C77F',
  utilities: '#1C4A2E',
  other: '#9CA3AF',
};

function groupByCategory(transactions) {
  const buckets = {};
  for (const t of transactions) {
    if (!buckets[t.category]) buckets[t.category] = { co2: 0, value: 0 };
    buckets[t.category].co2 += t.co2;
    buckets[t.category].value += t.amount;
  }
  return Object.entries(buckets).map(([catId, totals]) => {
    const meta = categories.find((c) => c.id === catId);
    return {
      category: meta ? meta.label.split(' ')[0] : catId,
      co2: Math.round(totals.co2 * 10) / 10,
      value: totals.value,
      color: CATEGORY_COLORS[catId] ?? '#9CA3AF',
    };
  });
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-forest text-paper rounded-lg px-3 py-2 shadow-lg font-mono text-xs">
      <p className="text-sage-light mb-1">{d.category}</p>
      <p>{d.co2} kg CO₂</p>
      <p>₹{d.value} spent</p>
    </div>
  );
}

export default function CarbonChart({ transactions = [] }) {
  const data = useMemo(() => {
    const grouped = groupByCategory(transactions);
    return grouped.length ? grouped : mockCategoryBreakdown;
  }, [transactions]);

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(15,46,29,0.08)] p-6">
      <div className="mb-5">
        <h3 className="font-display text-lg font-semibold text-forest">Carbon by Category</h3>
        <p className="text-xs text-ink/50 mt-0.5">kg CO₂ equivalent, this week</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 5" stroke="#EFEADC" vertical={false} />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 11, fill: '#1A1A17', fillOpacity: 0.5 }}
            axisLine={{ stroke: '#EFEADC' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#1A1A17', fillOpacity: 0.4 }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#EFEADC' }} />
          <Bar dataKey="co2" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
