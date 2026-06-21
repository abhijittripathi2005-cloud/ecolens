import { LayoutDashboard, Receipt, Smile, Trophy, FileText } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'transactions', label: 'Activity', icon: Receipt },
  { id: 'mood', label: 'Mood', icon: Smile },
  { id: 'leaderboard', label: 'Score', icon: Trophy },
  { id: 'reports', label: 'Reports', icon: FileText },
];

export default function MobileNav({ active, onNavigate }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-forest border-t border-forest-light/60 flex items-center justify-around py-2 px-1 z-40 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
              isActive ? 'text-amber-light' : 'text-sage-light'
            }`}
          >
            <Icon className="w-5 h-5" strokeWidth={2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
