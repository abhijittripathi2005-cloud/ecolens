import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { weeklySpend as mockWeeklySpend } from '../data/mockData';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function groupByDay(transactions) {
  const buckets = {};
  for (const t of transactions) {
    const d = new Date(t.date + 'T00:00:00');
    const label = DAY_LABELS[d.getDay()];
    if (!buckets[label]) buckets[label] = { day: label, spent: 0, co2: 0 };
    buckets[label].spent += t.amount;
    buckets[label].co2 += t.co2;
  }
  // Order Mon -> Sun for a natural week view
  const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return order
    .filter((d) => buckets[d])
    .map((d) => ({ ...buckets[d], co2: Math.round(buckets[d].co2 * 10) / 10 }));
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-forest text-paper rounded-lg px-3 py-2 shadow-lg font-mono text-xs">
      <p className="text-sage-light mb-1">{label}</p>
      <p>₹{payload[0]?.payload.spent} spent</p>
      <p>{payload[0]?.payload.co2} kg CO₂</p>
    </div>
  );
}

export default function SpendChart({ transactions = [] }) {
  const [view, setView] = useState('week');

  const data = useMemo(() => {
    const grouped = groupByDay(transactions);
    return grouped.length ? grouped : mockWeeklySpend;
  }, [transactions]);

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(15,46,29,0.08)] p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-lg font-semibold text-forest">Spending Trend</h3>
          <p className="text-xs text-ink/50 mt-0.5">Daily spend, this {view}</p>
        </div>
        <div className="flex bg-paper-dim rounded-lg p-1 text-xs font-medium">
          {['week', 'month'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-md capitalize transition-colors ${
                view === v ? 'bg-forest text-paper' : 'text-ink/50 hover:text-ink'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 5" stroke="#EFEADC" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: '#1A1A17', fillOpacity: 0.5 }}
            axisLine={{ stroke: '#EFEADC' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#1A1A17', fillOpacity: 0.4 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="spent"
            stroke="#D4922A"
            strokeWidth={2.5}
            dot={{ fill: '#D4922A', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
