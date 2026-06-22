import { LayoutDashboard, Receipt, Smile, Trophy, FileText, Leaf, ShoppingBag } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'mood', label: 'Mood Tracker', icon: Smile },
  { id: 'leaderboard', label: 'Green Score', icon: Trophy },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
  { id: 'reports', label: 'Reports', icon: FileText },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col bg-forest text-paper shrink-0 min-h-screen">
      <div className="flex items-center gap-2 px-6 py-7">
        <Leaf className="w-7 h-7 text-amber-light" strokeWidth={2.5} />
        <span className="font-display text-2xl font-semibold tracking-tight">EcoLens</span>
      </div>

      <nav className="flex-1 px-3 mt-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-forest-light text-paper'
                  : 'text-sage-light hover:bg-forest-light/50 hover:text-paper'}`}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-6 py-5 border-t border-forest-light/60">
        <p className="font-mono text-[11px] text-sage-light/70 leading-relaxed">
          Byte Brains 🐛
        </p>
      </div>
    </aside>
  );
}
