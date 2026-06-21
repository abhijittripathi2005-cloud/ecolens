import { Flame, Trophy } from 'lucide-react';
import { leaderboard } from '../data/mockLeaderboard';

function initials(name) {
  return name.replace(' (You)', '').split(' ').map((w) => w[0]).slice(0, 2).join('');
}

const medalColors = ['#D4922A', '#9CA3AF', '#B5713A'];

export default function LeaderboardPage() {
  const sorted = [...leaderboard].sort((a, b) => b.score - a.score);
  const you = leaderboard.find((u) => u.isYou);

  return (
    <main className="px-6 md:px-10 py-8 space-y-6 page-fade-in">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-forest">Green Score</h1>
        <p className="text-sm text-ink/50 mt-0.5">See how you stack up against friends this week.</p>
      </div>

      {/* Your standing callout */}
      <div className="bg-forest rounded-xl shadow-[0_2px_12px_rgba(15,46,29,0.15)] p-6 text-paper flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-amber/20 flex items-center justify-center shrink-0">
          <Trophy className="w-6 h-6 text-amber-light" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-sage-light mb-1">
            Your rank
          </p>
          <p className="font-display text-xl font-semibold">
            #{sorted.findIndex((u) => u.isYou) + 1} of {sorted.length} — Top {Math.round(((sorted.findIndex((u) => u.isYou) + 1) / sorted.length) * 100)}%
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-display text-3xl font-semibold text-amber-light">{you?.score}</p>
          <p className="text-[11px] text-sage-light">score</p>
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(15,46,29,0.08)] p-6">
        <h3 className="font-display text-lg font-semibold text-forest mb-4">Bug Busters Friends</h3>

        <div className="space-y-1">
          {sorted.map((user, i) => (
            <div
              key={user.id}
              className={`flex items-center gap-4 px-3 py-3 rounded-lg ${
                user.isYou ? 'bg-paper-dim border border-dashed border-amber/50' : ''
              }`}
            >
              <span
                className="w-6 text-center font-mono text-sm font-semibold shrink-0"
                style={{ color: i < 3 ? medalColors[i] : '#1A1A1740' }}
              >
                {i + 1}
              </span>

              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                style={{ backgroundColor: user.avatarColor }}
              >
                {initials(user.name)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{user.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Flame className="w-3 h-3 text-coral" strokeWidth={2.5} />
                  <span className="text-[11px] text-ink/40">{user.streak} day streak</span>
                </div>
              </div>

              <span className="font-mono text-sm font-semibold text-forest shrink-0">{user.score}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
