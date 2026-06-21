import StatCard from './StatCard';
import SpendChart from './SpendChart';
import CarbonChart from './CarbonChart';
import TransactionList from './TransactionList';
import GreenScoreGauge from './GreenScoreGauge';
import AIAdvisorPanel from './AIAdvisorPanel';
import { calculateGreenScore } from '../data/carbonEngine';

export default function DashboardPage({ transactions }) {
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalCO2 = transactions.reduce((sum, t) => sum + t.co2, 0);
  const avgPerTxn = transactions.length ? Math.round(totalSpent / transactions.length) : 0;
  const greenScore = calculateGreenScore(transactions);

  return (
    <main className="px-6 md:px-10 py-8 space-y-6 page-fade-in">
      {/* Stat row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Total Spent"
          value={`₹${totalSpent.toLocaleString('en-IN')}`}
          change={-8}
          changeLabel="vs last week"
          accent="amber"
        />
        <StatCard
          label="Carbon Footprint"
          value={Math.round(totalCO2 * 10) / 10}
          unit="kg CO₂"
          change={-12}
          changeLabel="vs last week"
          accent="forest"
        />
        <StatCard
          label="Avg per Transaction"
          value={`₹${avgPerTxn}`}
          change={3}
          changeLabel="vs last week"
          accent="coral"
        />
      </div>

      {/* AI Advisor — top billing, this is the wow factor */}
      <AIAdvisorPanel />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SpendChart transactions={transactions} />
        <CarbonChart transactions={transactions} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <TransactionList transactions={transactions} />
        </div>
        <GreenScoreGauge score={greenScore} />
      </div>
    </main>
  );
}
